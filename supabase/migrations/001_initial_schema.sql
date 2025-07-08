-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'sub_admin', 'member');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'repaid');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'loan_disbursement', 'loan_repayment', 'fine', 'investment');

-- Users table (base authentication)
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    status user_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    account_number TEXT UNIQUE,
    cooperative_id UUID -- For multi-tenant support
);

-- Members table (extends users)
CREATE TABLE public.members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    membership_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE,
    address TEXT,
    occupation TEXT,
    next_of_kin_name TEXT,
    next_of_kin_phone TEXT,
    next_of_kin_relationship TEXT,
    balance DECIMAL(15,2) DEFAULT 0,
    savings_balance DECIMAL(15,2) DEFAULT 0,
    loan_balance DECIMAL(15,2) DEFAULT 0,
    total_paid DECIMAL(15,2) DEFAULT 0,
    repayment_rating INTEGER DEFAULT 0 CHECK (repayment_rating >= 0 AND repayment_rating <= 5),
    join_date DATE DEFAULT CURRENT_DATE,
    guarantor_limit INTEGER DEFAULT 2,
    monthly_contribution DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table
CREATE TABLE public.admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    is_sub_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cooperatives table (for multi-tenant)
CREATE TABLE public.cooperatives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    primary_color TEXT DEFAULT '#2563eb',
    secondary_color TEXT DEFAULT '#64748b',
    motto TEXT,
    subscription_tier TEXT DEFAULT 'starter',
    member_limit INTEGER DEFAULT 100,
    current_members INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan applications table
CREATE TABLE public.loan_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    purpose TEXT NOT NULL,
    status loan_status DEFAULT 'pending',
    monthly_payment DECIMAL(10,2),
    weekly_payment DECIMAL(10,2),
    total_paid DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2),
    weeks_remaining INTEGER,
    next_payment_date DATE,
    fines DECIMAL(10,2) DEFAULT 0,
    guarantor1_id UUID REFERENCES public.members(id),
    guarantor2_id UUID REFERENCES public.members(id),
    application_date DATE DEFAULT CURRENT_DATE,
    approved_date DATE,
    approved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    type transaction_type NOT NULL,
    description TEXT,
    reference_id TEXT,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    processed_by UUID REFERENCES public.users(id),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account number sequence
CREATE SEQUENCE account_number_seq START 100001;

-- Function to generate account number
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ACC' || LPAD(nextval('account_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate account number for new users
CREATE OR REPLACE FUNCTION set_account_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.account_number IS NULL THEN
        NEW.account_number := generate_account_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate account number
CREATE TRIGGER trigger_set_account_number
    BEFORE INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION set_account_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
        )
    );

-- RLS Policies for members table
CREATE POLICY "Members can view own data" ON public.members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.id = user_id
        )
    );

CREATE POLICY "Admins can manage members" ON public.members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
        )
    );

-- RLS Policies for admins table
CREATE POLICY "Super admins can manage admins" ON public.admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'super_admin'
        )
    );

CREATE POLICY "Admins can view own data" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.id = user_id
        )
    );

-- RLS Policies for loan applications
CREATE POLICY "Members can view own loans" ON public.loan_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.members m 
            JOIN public.users u ON u.id = m.user_id
            WHERE u.id = auth.uid() 
            AND m.id = member_id
        )
    );

CREATE POLICY "Admins can manage loans" ON public.loan_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
        )
    );

-- RLS Policies for transactions
CREATE POLICY "Members can view own transactions" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.members m 
            JOIN public.users u ON u.id = m.user_id
            WHERE u.id = auth.uid() 
            AND m.id = member_id
        )
    );

CREATE POLICY "Admins can manage transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
        )
    );

-- Insert default super admin (password will be hashed in the app)
INSERT INTO public.users (email, phone, password_hash, role, status, account_number)
VALUES 
    ('superadmin@alajeseku.com', '+2348000000001', '$2b$10$placeholder', 'super_admin', 'active', 'SUPER001'),
    ('admin@alajeseku.com', '+2348000000002', '$2b$10$placeholder', 'admin', 'active', 'ADMIN001');

-- Insert corresponding admin records
WITH super_user AS (SELECT id FROM public.users WHERE email = 'superadmin@alajeseku.com'),
     admin_user AS (SELECT id FROM public.users WHERE email = 'admin@alajeseku.com')
INSERT INTO public.admins (user_id, name, permissions, is_sub_admin)
SELECT 
    super_user.id, 
    'Super Administrator', 
    ARRAY['all'], 
    false
FROM super_user
UNION ALL
SELECT 
    admin_user.id, 
    'Main Administrator', 
    ARRAY['members', 'loans', 'transactions', 'reports'], 
    false
FROM admin_user;

-- Add cooperatives table for multi-tenant support
CREATE TABLE cooperatives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#1E40AF',
    motto TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
    member_limit INTEGER DEFAULT 100,
    current_members INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'trial' CHECK (status IN ('active', 'suspended', 'trial', 'expired', 'pending_approval')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_payment TIMESTAMP WITH TIME ZONE,
    next_billing TIMESTAMP WITH TIME ZONE NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address TEXT,
    settings JSONB DEFAULT '{}',
    admin_name VARCHAR(255),
    admin_password VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add onboarding requests table
CREATE TABLE onboarding_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cooperative_name VARCHAR(255) NOT NULL,
    admin_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address TEXT,
    expected_members INTEGER DEFAULT 0,
    selected_tier VARCHAR(20) DEFAULT 'starter' CHECK (selected_tier IN ('starter', 'professional', 'enterprise')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    logo TEXT
);

-- Add billing records table
CREATE TABLE billing_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'failed')),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add storage bucket for cooperative assets
INSERT INTO storage.buckets (id, name, public) VALUES ('cooperative-assets', 'cooperative-assets', true);

-- Add cooperative_id to existing tables for multi-tenancy
ALTER TABLE members ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE;
ALTER TABLE admins ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE;
ALTER TABLE savings_transactions ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE;
ALTER TABLE loan_applications ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE;
ALTER TABLE loan_payments ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE;

-- Update RLS policies for multi-tenant support
CREATE POLICY "Public can view cooperatives" ON cooperatives FOR SELECT USING (true);
CREATE POLICY "Super admin can manage cooperatives" ON cooperatives FOR ALL USING (true);
CREATE POLICY "Public can submit onboarding requests" ON onboarding_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Super admin can manage onboarding" ON onboarding_requests FOR ALL USING (true);
CREATE POLICY "Super admin can manage billing" ON billing_records FOR ALL USING (true);

-- Enable RLS on new tables
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;