import { supabase } from '@/integrations/supabase/client';
import * as bcrypt from 'bcryptjs';

// Temporary type casting until database types are regenerated
const supabaseClient = supabase as any;

export interface AuthUser {
  id: string;
  email?: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'sub_admin' | 'member';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  account_number: string;
  name?: string;
  balance?: number;
  savings_balance?: number;
  loan_balance?: number;
}

export interface LoginCredentials {
  accountNumber: string;
  password: string;
}

export interface CreateMemberData {
  name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  address?: string;
  occupation?: string;
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  next_of_kin_relationship?: string;
  monthly_contribution?: number;
}

class AuthService {
  // Login with account number and password (phone initially)
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      console.log('Attempting login for:', credentials.accountNumber);
      
      // Query the users table with the account number
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select(`
          *,
          members(*),
          admins(*)
        `)
        .eq('account_number', credentials.accountNumber)
        .eq('status', 'active')
        .single();

      if (userError || !userData) {
        console.error('User not found:', userError);
        return null;
      }

      // Verify password (compare with hashed phone number)
      const isValidPassword = await bcrypt.compare(credentials.password, userData.password_hash);
      if (!isValidPassword) {
        console.error('Invalid password');
        return null;
      }

      // Update last login
      await supabaseClient
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Build user object based on role
      let name = '';
      let balance = 0;
      let savings_balance = 0;
      let loan_balance = 0;

      if ((userData as any).role === 'member' && (userData as any).members?.[0]) {
        const member = (userData as any).members[0];
        name = member.name;
        balance = member.balance || 0;
        savings_balance = member.savings_balance || 0;
        loan_balance = member.loan_balance || 0;
      } else if (((userData as any).role === 'admin' || (userData as any).role === 'super_admin' || (userData as any).role === 'sub_admin') && (userData as any).admins?.[0]) {
        const admin = (userData as any).admins[0];
        name = admin.name;
      }

      const user: AuthUser = {
        id: (userData as any).id,
        email: (userData as any).email,
        phone: (userData as any).phone,
        role: (userData as any).role,
        status: (userData as any).status,
        account_number: (userData as any).account_number,
        name,
        balance,
        savings_balance,
        loan_balance
      };

      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Create new member account
  async createMember(memberData: CreateMemberData): Promise<{ user: AuthUser; accountNumber: string } | null> {
    try {
      // Hash the phone number as initial password
      const passwordHash = await bcrypt.hash(memberData.phone, 10);

      // Create user record
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .insert({
          email: memberData.email,
          phone: memberData.phone,
          password_hash: passwordHash,
          role: 'member',
          status: 'active'
        })
        .select()
        .single();

      if (userError || !userData) {
        console.error('Error creating user:', userError);
        return null;
      }

      // Create member record
      const { data: memberRecord, error: memberError } = await supabaseClient
        .from('members')
        .insert({
          user_id: userData.id,
          membership_id: userData.account_number, // Use auto-generated account number
          name: memberData.name,
          date_of_birth: memberData.date_of_birth,
          address: memberData.address,
          occupation: memberData.occupation,
          next_of_kin_name: memberData.next_of_kin_name,
          next_of_kin_phone: memberData.next_of_kin_phone,
          next_of_kin_relationship: memberData.next_of_kin_relationship,
          monthly_contribution: memberData.monthly_contribution || 0
        })
        .select()
        .single();

      if (memberError) {
        console.error('Error creating member:', memberError);
        // Cleanup user record if member creation fails
        await supabaseClient.from('users').delete().eq('id', userData.id);
        return null;
      }

      const newUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        phone: userData.phone,
        role: 'member',
        status: 'active',
        account_number: userData.account_number,
        name: memberData.name,
        balance: 0,
        savings_balance: 0,
        loan_balance: 0
      };

      return { user: newUser, accountNumber: userData.account_number };

    } catch (error) {
      console.error('Create member error:', error);
      return null;
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // For demo purposes, always return true
      // In real implementation, this would update the password in Supabase
      console.log('Password change simulated for user:', userId);
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      // For demo purposes, return mock data
      // In real implementation, this would fetch from Supabase
      return {
        id: userId,
        phone: '+2348000000000',
        role: 'member',
        status: 'active',
        account_number: 'ACC123456',
        name: 'Demo User',
        balance: 0,
        savings_balance: 0,
        loan_balance: 0
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Update member profile
  async updateMemberProfile(userId: string, updates: Partial<CreateMemberData>): Promise<boolean> {
    try {
      // For demo purposes, always return true
      console.log('Member profile update simulated for user:', userId);
      return true;
    } catch (error) {
      console.error('Update member profile error:', error);
      return false;
    }
  }

  // Get all members (admin only)
  async getAllMembers(): Promise<AuthUser[]> {
    try {
      // For demo purposes, return empty array
      // In real implementation, this would fetch from Supabase
      return [];
    } catch (error) {
      console.error('Get all members error:', error);
      return [];
    }
  }

  // Suspend/Activate member
  async updateMemberStatus(userId: string, status: 'active' | 'suspended'): Promise<boolean> {
    try {
      // For demo purposes, always return true
      console.log('Member status update simulated for user:', userId, 'to status:', status);
      return true;
    } catch (error) {
      console.error('Update member status error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();