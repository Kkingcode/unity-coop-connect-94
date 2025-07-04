
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
  customization: CooperativeCustomization;
}

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
    customFines: CustomFine[];
  };
  meetingSettings: {
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    quorumPercentage: number;
    votingThreshold: number;
    allowVirtualAttendance: boolean;
  };
}

export interface CustomFine {
  id: string;
  name: string;
  amount: number;
  description: string;
  isActive: boolean;
}

export interface CooperativeCustomization {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  branding: {
    logo: string;
    favicon: string;
    headerImage?: string;
    motto: string;
    tagline?: string;
  };
  features: {
    enabledModules: string[];
    customFields: CustomField[];
    dashboardLayout: string;
  };
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  permissions: string[];
  createdDate: string;
  lastLogin: string;
}

export interface PlatformAnalytics {
  totalCooperatives: number;
  totalMembers: number;
  monthlyRevenue: number;
  annualRevenue: number;
  growthRate: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  topPerformingCooperatives: Cooperative[];
  revenueByTier: Record<string, number>;
  memberGrowthTrend: MonthlyData[];
  revenueGrowthTrend: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  value: number;
  change: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  memberLimit: number;
  features: string[];
  description: string;
  isPopular?: boolean;
  customFeatures?: {
    multiBranch: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
    dedicatedSupport: boolean;
    trainingIncluded: boolean;
  };
}

export interface CooperativeOnboarding {
  id: string;
  cooperativeName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  expectedMembers: number;
  selectedTier: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedDate: string;
  documents: OnboardingDocument[];
  notes?: string;
}

export interface OnboardingDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedDate: string;
  verified: boolean;
}

export interface BillingRecord {
  id: string;
  cooperativeId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
  description: string;
  paymentMethod?: string;
}

export interface PlatformSettings {
  general: {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    language: string;
  };
  billing: {
    gracePeriodDays: number;
    suspensionWarningDays: number;
    autoSuspendAfterDays: number;
    paymentGateways: string[];
  };
  features: {
    enableTrialPeriod: boolean;
    trialDurationDays: number;
    enableReferralProgram: boolean;
    referralBonus: number;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
}
