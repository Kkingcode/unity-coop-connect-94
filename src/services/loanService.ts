import { supabase } from '@/integrations/supabase/client';

// Temporary type casting until database types are regenerated
const supabaseClient = supabase as any;

export interface LoanApplication {
  id: string;
  member_id: string;
  amount: number;
  purpose: string;
  duration_months: number;
  guarantor1_id: string;
  guarantor2_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  interest_rate: number;
  monthly_payment: number;
  total_amount: number;
  application_date: string;
  approval_date?: string;
  approval_notes?: string;
  member_name?: string;
  guarantor1_name?: string;
  guarantor2_name?: string;
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  payment_type: 'monthly' | 'partial' | 'full';
  payment_method: 'cash' | 'bank_transfer' | 'mobile_money';
  notes?: string;
}

export interface LoanSummary {
  total_disbursed: number;
  total_repaid: number;
  outstanding_balance: number;
  active_loans: number;
  defaulted_loans: number;
}

class LoanService {
  // Calculate loan terms with interest
  calculateLoanTerms(amount: number, durationMonths: number, interestRate: number = 5) {
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalAmount = amount * (1 + (interestRate / 100) * (durationMonths / 12));
    const monthlyPayment = totalAmount / durationMonths;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalAmount: Math.round(totalAmount),
      interestAmount: Math.round(totalAmount - amount)
    };
  }

  // Submit new loan application
  async createLoanApplication(applicationData: {
    memberId: string;
    amount: number;
    purpose: string;
    durationMonths: number;
    guarantor1Id: string;
    guarantor2Id?: string;
  }): Promise<LoanApplication | null> {
    try {
      const loanTerms = this.calculateLoanTerms(applicationData.amount, applicationData.durationMonths);
      
      const { data, error } = await supabaseClient
        .from('loan_applications')
        .insert({
          member_id: applicationData.memberId,
          amount: applicationData.amount,
          purpose: applicationData.purpose,
          duration_months: applicationData.durationMonths,
          guarantor1_id: applicationData.guarantor1Id,
          guarantor2_id: applicationData.guarantor2Id,
          status: 'pending',
          interest_rate: 5, // Default 5% annual interest
          monthly_payment: loanTerms.monthlyPayment,
          total_amount: loanTerms.totalAmount,
          application_date: new Date().toISOString()
        })
        .select(`
          *,
          members!loan_applications_member_id_fkey(name),
          guarantor1:members!loan_applications_guarantor1_id_fkey(name),
          guarantor2:members!loan_applications_guarantor2_id_fkey(name)
        `)
        .single();

      if (error) {
        console.error('Error creating loan application:', error);
        return null;
      }

      return {
        ...data,
        member_name: data.members?.name,
        guarantor1_name: data.guarantor1?.name,
        guarantor2_name: data.guarantor2?.name
      };
    } catch (error) {
      console.error('Create loan application error:', error);
      return null;
    }
  }

  // Get all loan applications (admin view)
  async getAllLoanApplications(): Promise<LoanApplication[]> {
    try {
      const { data, error } = await supabaseClient
        .from('loan_applications')
        .select(`
          *,
          members!loan_applications_member_id_fkey(name),
          guarantor1:members!loan_applications_guarantor1_id_fkey(name),
          guarantor2:members!loan_applications_guarantor2_id_fkey(name)
        `)
        .order('application_date', { ascending: false });

      if (error) {
        console.error('Error fetching loan applications:', error);
        return [];
      }

      return data.map((loan: any) => ({
        ...loan,
        member_name: loan.members?.name,
        guarantor1_name: loan.guarantor1?.name,
        guarantor2_name: loan.guarantor2?.name
      }));
    } catch (error) {
      console.error('Get loan applications error:', error);
      return [];
    }
  }

  // Get member's loan applications
  async getMemberLoanApplications(memberId: string): Promise<LoanApplication[]> {
    try {
      const { data, error } = await supabaseClient
        .from('loan_applications')
        .select(`
          *,
          members!loan_applications_member_id_fkey(name),
          guarantor1:members!loan_applications_guarantor1_id_fkey(name),
          guarantor2:members!loan_applications_guarantor2_id_fkey(name)
        `)
        .eq('member_id', memberId)
        .order('application_date', { ascending: false });

      if (error) {
        console.error('Error fetching member loan applications:', error);
        return [];
      }

      return data.map((loan: any) => ({
        ...loan,
        member_name: loan.members?.name,
        guarantor1_name: loan.guarantor1?.name,
        guarantor2_name: loan.guarantor2?.name
      }));
    } catch (error) {
      console.error('Get member loan applications error:', error);
      return [];
    }
  }

  // Approve loan application
  async approveLoanApplication(loanId: string, approvalNotes?: string): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('loan_applications')
        .update({
          status: 'approved',
          approval_date: new Date().toISOString(),
          approval_notes: approvalNotes || 'Loan approved'
        })
        .eq('id', loanId);

      if (error) {
        console.error('Error approving loan:', error);
        return false;
      }

      // TODO: Update member's loan balance in members table
      // This would be handled by a database trigger or additional update

      return true;
    } catch (error) {
      console.error('Approve loan error:', error);
      return false;
    }
  }

  // Reject loan application
  async rejectLoanApplication(loanId: string, rejectionReason?: string): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('loan_applications')
        .update({
          status: 'rejected',
          approval_notes: rejectionReason || 'Loan application rejected'
        })
        .eq('id', loanId);

      if (error) {
        console.error('Error rejecting loan:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Reject loan error:', error);
      return false;
    }
  }

  // Record loan payment
  async recordLoanPayment(paymentData: {
    loanId: string;
    amount: number;
    paymentType: 'monthly' | 'partial' | 'full';
    paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money';
    notes?: string;
  }): Promise<LoanPayment | null> {
    try {
      const { data, error } = await supabaseClient
        .from('loan_payments')
        .insert({
          loan_id: paymentData.loanId,
          amount: paymentData.amount,
          payment_date: new Date().toISOString(),
          payment_type: paymentData.paymentType,
          payment_method: paymentData.paymentMethod,
          notes: paymentData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording loan payment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Record loan payment error:', error);
      return null;
    }
  }

  // Get loan payments history
  async getLoanPayments(loanId: string): Promise<LoanPayment[]> {
    try {
      const { data, error } = await supabaseClient
        .from('loan_payments')
        .select('*')
        .eq('loan_id', loanId)
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching loan payments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get loan payments error:', error);
      return [];
    }
  }

  // Get loan summary statistics
  async getLoanSummary(): Promise<LoanSummary> {
    try {
      // Get all approved loans
      const { data: approvedLoans, error: loansError } = await supabaseClient
        .from('loan_applications')
        .select('amount, total_amount')
        .eq('status', 'approved');

      if (loansError) {
        console.error('Error fetching loan summary:', loansError);
        return {
          total_disbursed: 0,
          total_repaid: 0,
          outstanding_balance: 0,
          active_loans: 0,
          defaulted_loans: 0
        };
      }

      // Get all payments
      const { data: payments, error: paymentsError } = await supabaseClient
        .from('loan_payments')
        .select('amount');

      if (paymentsError) {
        console.error('Error fetching payments summary:', paymentsError);
      }

      const totalDisbursed = approvedLoans?.reduce((sum, loan) => sum + loan.amount, 0) || 0;
      const totalRepaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const outstandingBalance = totalDisbursed - totalRepaid;

      return {
        total_disbursed: totalDisbursed,
        total_repaid: totalRepaid,
        outstanding_balance: Math.max(0, outstandingBalance),
        active_loans: approvedLoans?.length || 0,
        defaulted_loans: 0 // TODO: Calculate based on overdue payments
      };
    } catch (error) {
      console.error('Get loan summary error:', error);
      return {
        total_disbursed: 0,
        total_repaid: 0,
        outstanding_balance: 0,
        active_loans: 0,
        defaulted_loans: 0
      };
    }
  }

  // Check member eligibility for new loan
  async checkLoanEligibility(memberId: string, requestedAmount: number): Promise<{
    eligible: boolean;
    reason?: string;
    maxEligibleAmount?: number;
  }> {
    try {
      // Get member's current loans
      const { data: currentLoans, error } = await supabaseClient
        .from('loan_applications')
        .select('amount, status')
        .eq('member_id', memberId)
        .in('status', ['approved', 'pending']);

      if (error) {
        console.error('Error checking loan eligibility:', error);
        return { eligible: false, reason: 'Unable to verify eligibility' };
      }

      const hasActiveLoan = currentLoans && currentLoans.length > 0;
      if (hasActiveLoan) {
        return { 
          eligible: false, 
          reason: 'Member has an active or pending loan application' 
        };
      }

      // TODO: Add more eligibility checks:
      // - Member savings balance
      // - Membership duration
      // - Payment history
      // - Maximum loan amount based on savings

      return { eligible: true };
    } catch (error) {
      console.error('Check loan eligibility error:', error);
      return { eligible: false, reason: 'Unable to verify eligibility' };
    }
  }
}

export const loanService = new LoanService();