
export interface Cooperative {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  motto: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise' | 'custom';
  memberLimit: number;
  currentMembers: number;
  status: 'active' | 'suspended' | 'trial' | 'expired';
  createdDate: string;
  lastPayment: string;
  nextBilling: string;
  monthlyFee: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  settings: CooperativeSettings;
}

export interface CooperativeSettings {
  loanSettings: {
    maxLoanAmount: number;
    defaultInterestRate: number;
    maxLoanTerm: number;
    collateralRequired: boolean;
    guarantorsRequired: number;
  };
  savingsSettings: {
    minimumBalance: number;
    interestRate: number;
    withdrawalLimits: {
      daily: number;
      monthly: number;
    };
  };
  membershipSettings: {
    registrationFee: number;
    monthlyDues: number;
    minimumAge: number;
    documentRequirements: string[];
  };
  fineStructure: {
    latePaymentFine: number;
    missedMeetingFine: number;
    defaultLoanFine: number;
  };
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  permissions: string[];
}

export interface PlatformAnalytics {
  totalCooperatives: number;
  totalMembers: number;
  monthlyRevenue: number;
  growthRate: number;
  activeSubscriptions: number;
  churnRate: number;
  topPerformingCooperatives: Cooperative[];
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  memberLimit: number;
  features: string[];
  description: string;
}
