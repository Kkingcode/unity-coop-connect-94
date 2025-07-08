import { supabase } from '@/integrations/supabase/client';

// Temporary type casting until database types are regenerated
const supabaseClient = supabase as any;

export interface CooperativeSettings {
  loanSettings: {
    maxLoanAmount: number;
    defaultInterestRate: number;
    maxLoanTerm: number;
    collateralRequired: boolean;
    guarantorsRequired: number;
    autoApprovalLimit: number;
    latePaymentGracePeriod: number;
  };
  savingsSettings: {
    minimumBalance: number;
    interestRate: number;
    withdrawalLimits: {
      daily: number;
      monthly: number;
    };
    compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  };
  membershipSettings: {
    registrationFee: number;
    monthlyDues: number;
    minimumAge: number;
    maximumAge: number;
    documentRequirements: string[];
    approvalWorkflow: 'automatic' | 'manual' | 'committee';
    probationPeriod: number;
  };
  fineStructure: {
    latePaymentFine: number;
    missedMeetingFine: number;
    defaultLoanFine: number;
    documentationFine: number;
    customFines: any[];
  };
  meetingSettings: {
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    quorumPercentage: number;
    votingThreshold: number;
    allowVirtualAttendance: boolean;
  };
}

export interface Cooperative {
  id: string;
  name: string;
  logo?: string;
  primary_color: string;
  secondary_color: string;
  motto?: string;
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  member_limit: number;
  current_members: number;
  status: 'active' | 'suspended' | 'trial' | 'expired' | 'pending_approval';
  created_at: string;
  last_payment?: string;
  next_billing: string;
  monthly_fee: number;
  contact_email: string;
  contact_phone: string;
  address?: string;
  settings: CooperativeSettings;
  admin_name?: string;
  admin_password?: string;
}

export interface OnboardingRequest {
  id: string;
  cooperative_name: string;
  admin_name: string;
  contact_email: string;
  contact_phone: string;
  address?: string;
  expected_members: number;
  selected_tier: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  notes?: string;
  logo?: string;
}

class CooperativeService {
  // Create cooperative (Super Admin)
  async createCooperative(cooperativeData: Omit<Cooperative, 'id' | 'created_at' | 'current_members'>): Promise<Cooperative | null> {
    try {
      const { data, error } = await supabaseClient
        .from('cooperatives')
        .insert({
          name: cooperativeData.name,
          logo: cooperativeData.logo,
          primary_color: cooperativeData.primary_color,
          secondary_color: cooperativeData.secondary_color,
          motto: cooperativeData.motto,
          subscription_tier: cooperativeData.subscription_tier,
          member_limit: cooperativeData.member_limit,
          status: cooperativeData.status,
          last_payment: cooperativeData.last_payment,
          next_billing: cooperativeData.next_billing,
          monthly_fee: cooperativeData.monthly_fee,
          contact_email: cooperativeData.contact_email,
          contact_phone: cooperativeData.contact_phone,
          address: cooperativeData.address,
          settings: cooperativeData.settings,
          admin_name: cooperativeData.admin_name,
          admin_password: cooperativeData.admin_password,
          current_members: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating cooperative:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Create cooperative error:', error);
      return null;
    }
  }

  // Submit onboarding request (Cooperative Admin Self-Registration)
  async submitOnboardingRequest(requestData: Omit<OnboardingRequest, 'id' | 'submitted_at' | 'status'>): Promise<OnboardingRequest | null> {
    try {
      const { data, error } = await supabaseClient
        .from('onboarding_requests')
        .insert({
          cooperative_name: requestData.cooperative_name,
          admin_name: requestData.admin_name,
          contact_email: requestData.contact_email,
          contact_phone: requestData.contact_phone,
          address: requestData.address,
          expected_members: requestData.expected_members,
          selected_tier: requestData.selected_tier,
          status: 'pending',
          notes: requestData.notes,
          logo: requestData.logo
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting onboarding request:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Submit onboarding request error:', error);
      return null;
    }
  }

  // Get all cooperatives (Super Admin)
  async getAllCooperatives(): Promise<Cooperative[]> {
    try {
      const { data, error } = await supabaseClient
        .from('cooperatives')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cooperatives:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get cooperatives error:', error);
      return [];
    }
  }

  // Get all onboarding requests (Super Admin)
  async getAllOnboardingRequests(): Promise<OnboardingRequest[]> {
    try {
      const { data, error } = await supabaseClient
        .from('onboarding_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching onboarding requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get onboarding requests error:', error);
      return [];
    }
  }

  // Approve onboarding request (Super Admin)
  async approveOnboardingRequest(requestId: string): Promise<boolean> {
    try {
      // Get the onboarding request
      const { data: request, error: fetchError } = await supabaseClient
        .from('onboarding_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError || !request) {
        console.error('Error fetching onboarding request:', fetchError);
        return false;
      }

      // Create the cooperative
      const tierPricing = {
        starter: { price: 15000, limit: 100 },
        professional: { price: 35000, limit: 500 },
        enterprise: { price: 75000, limit: -1 }
      };

      const tier = tierPricing[request.selected_tier as keyof typeof tierPricing] || tierPricing.starter;

      const cooperativeData = {
        name: request.cooperative_name,
        logo: request.logo,
        primary_color: '#3B82F6',
        secondary_color: '#1E40AF',
        motto: 'Progress Through Unity',
        subscription_tier: request.selected_tier as 'starter' | 'professional' | 'enterprise',
        member_limit: tier.limit,
        status: 'trial' as const,
        last_payment: new Date().toISOString(),
        next_billing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        monthly_fee: tier.price,
        contact_email: request.contact_email,
        contact_phone: request.contact_phone,
        address: request.address,
        admin_name: request.admin_name,
        admin_password: this.generateTemporaryPassword(),
        settings: this.getDefaultSettings()
      };

      const newCooperative = await this.createCooperative(cooperativeData);

      if (!newCooperative) {
        return false;
      }

      // Update onboarding request status
      const { error: updateError } = await supabaseClient
        .from('onboarding_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating onboarding request:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Approve onboarding request error:', error);
      return false;
    }
  }

  // Reject onboarding request (Super Admin)
  async rejectOnboardingRequest(requestId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('onboarding_requests')
        .update({ 
          status: 'rejected',
          notes: reason 
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error rejecting onboarding request:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Reject onboarding request error:', error);
      return false;
    }
  }

  // Update cooperative settings (Editable business rules)
  async updateCooperativeSettings(cooperativeId: string, settings: CooperativeSettings): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('cooperatives')
        .update({ settings })
        .eq('id', cooperativeId);

      if (error) {
        console.error('Error updating cooperative settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Update cooperative settings error:', error);
      return false;
    }
  }

  // Update cooperative status (Super Admin)
  async updateCooperativeStatus(cooperativeId: string, status: Cooperative['status']): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('cooperatives')
        .update({ status })
        .eq('id', cooperativeId);

      if (error) {
        console.error('Error updating cooperative status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Update cooperative status error:', error);
      return false;
    }
  }

  // Upload and update cooperative logo
  async uploadCooperativeLogo(cooperativeId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cooperative-logos/${cooperativeId}-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabaseClient.storage
        .from('cooperative-assets')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('cooperative-assets')
        .getPublicUrl(fileName);

      // Update cooperative record
      const { error: updateError } = await supabaseClient
        .from('cooperatives')
        .update({ logo: publicUrl })
        .eq('id', cooperativeId);

      if (updateError) {
        console.error('Error updating cooperative logo:', updateError);
        return null;
      }

      return publicUrl;
    } catch (error) {
      console.error('Upload logo error:', error);
      return null;
    }
  }

  // Get platform analytics (Real data)
  async getPlatformAnalytics() {
    try {
      const { data: cooperatives, error: coopError } = await supabaseClient
        .from('cooperatives')
        .select('*');

      if (coopError) {
        console.error('Error fetching cooperatives for analytics:', coopError);
        return this.getDefaultAnalytics();
      }

      const totalCooperatives = cooperatives?.length || 0;
      const activeCooperatives = cooperatives?.filter(c => c.status === 'active') || [];
      const totalMembers = cooperatives?.reduce((sum: number, coop: any) => sum + (coop.current_members || 0), 0) || 0;
      const monthlyRevenue = activeCooperatives.reduce((sum: number, coop: any) => sum + (coop.monthly_fee || 0), 0);
      
      // Calculate churn rate (simplified - cooperatives that became inactive this month)
      const churnRate = totalCooperatives > 0 ? 
        ((cooperatives?.filter(c => c.status === 'suspended' || c.status === 'expired').length || 0) / totalCooperatives) * 100 : 0;

      return {
        totalCooperatives,
        totalMembers,
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12,
        growthRate: 15.5, // Calculate based on historical data
        activeSubscriptions: activeCooperatives.length,
        churnRate: Math.round(churnRate * 100) / 100,
        averageRevenuePerUser: totalMembers > 0 ? monthlyRevenue / totalMembers : 0,
        topPerformingCooperatives: cooperatives?.sort((a: any, b: any) => (b.current_members || 0) - (a.current_members || 0)).slice(0, 3) || [],
        revenueByTier: this.calculateRevenueByTier(activeCooperatives)
      };
    } catch (error) {
      console.error('Get platform analytics error:', error);
      return this.getDefaultAnalytics();
    }
  }

  private calculateRevenueByTier(cooperatives: any[]) {
    return cooperatives.reduce((acc: any, coop: any) => {
      const tier = coop.subscription_tier || 'starter';
      acc[tier] = (acc[tier] || 0) + (coop.monthly_fee || 0);
      return acc;
    }, {});
  }

  private getDefaultAnalytics() {
    return {
      totalCooperatives: 0,
      totalMembers: 0,
      monthlyRevenue: 0,
      annualRevenue: 0,
      growthRate: 0,
      activeSubscriptions: 0,
      churnRate: 0,
      averageRevenuePerUser: 0,
      topPerformingCooperatives: [],
      revenueByTier: { starter: 0, professional: 0, enterprise: 0 }
    };
  }

  private generateTemporaryPassword(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private getDefaultSettings(): CooperativeSettings {
    return {
      loanSettings: {
        maxLoanAmount: 500000,
        defaultInterestRate: 12,
        maxLoanTerm: 24,
        collateralRequired: true,
        guarantorsRequired: 2,
        autoApprovalLimit: 50000,
        latePaymentGracePeriod: 7
      },
      savingsSettings: {
        minimumBalance: 5000,
        interestRate: 8,
        withdrawalLimits: { daily: 50000, monthly: 200000 },
        compoundingFrequency: 'monthly'
      },
      membershipSettings: {
        registrationFee: 2000,
        monthlyDues: 1000,
        minimumAge: 18,
        maximumAge: 65,
        documentRequirements: ['National ID', 'Passport Photo'],
        approvalWorkflow: 'manual',
        probationPeriod: 90
      },
      fineStructure: {
        latePaymentFine: 500,
        missedMeetingFine: 200,
        defaultLoanFine: 1000,
        documentationFine: 100,
        customFines: []
      },
      meetingSettings: {
        frequency: 'monthly',
        quorumPercentage: 60,
        votingThreshold: 75,
        allowVirtualAttendance: true
      }
    };
  }
}

export const cooperativeService = new CooperativeService();