import { supabase } from '@/integrations/supabase/client';
import * as bcrypt from 'bcryptjs';

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
      // For demo purposes, simulate database interaction
      // The actual Supabase integration will work once the database is properly set up
      console.log('Attempting login for:', credentials.accountNumber);
      
      // This is a temporary mock implementation
      // Replace with actual Supabase calls once tables are created
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Create new member account
  async createMember(memberData: CreateMemberData): Promise<{ user: AuthUser; accountNumber: string } | null> {
    try {
      // For demo purposes, simulate the database operation
      // In real implementation, this would use proper Supabase insert
      
      // Generate account number (simulate)
      const accountNumber = `ACC${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Hash the phone number as initial password
      const passwordHash = await bcrypt.hash(memberData.phone, 10);

      // Simulate successful user creation
      const newUser: AuthUser = {
        id: `user_${Date.now()}`,
        email: memberData.email,
        phone: memberData.phone,
        role: 'member',
        status: 'active',
        account_number: accountNumber,
        name: memberData.name,
        balance: 0,
        savings_balance: 0,
        loan_balance: 0
      };

      return { user: newUser, accountNumber };

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