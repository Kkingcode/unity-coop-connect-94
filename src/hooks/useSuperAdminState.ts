
import { useState, useEffect } from 'react';
import { 
  Cooperative, 
  SuperAdmin, 
  PlatformAnalytics, 
  SubscriptionTier, 
  CooperativeOnboarding,
  BillingRecord,
  PlatformSettings
} from '@/types/multiTenant';
import { cooperativeService } from '@/services/cooperativeService';
import { toast } from 'sonner';

// Enhanced mock data for the platform
const mockCooperatives: Cooperative[] = [
  {
    id: 'coop-1',
    name: 'Sunrise Cooperative Society',
    logo: '/placeholder.svg',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    motto: 'Unity in Progress',
    subscriptionTier: 'professional',
    memberLimit: 500,
    currentMembers: 234,
    status: 'active',
    createdDate: '2024-01-15',
    lastPayment: '2024-06-01',
    nextBilling: '2024-07-01',
    monthlyFee: 35000,
    contactEmail: 'admin@sunrise-coop.ng',
    contactPhone: '+234-801-234-5678',
    address: 'Lagos, Nigeria',
    settings: {
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
        withdrawalLimits: {
          daily: 50000,
          monthly: 200000
        },
        compoundingFrequency: 'monthly'
      },
      membershipSettings: {
        registrationFee: 2000,
        monthlyDues: 1000,
        minimumAge: 18,
        maximumAge: 65,
        documentRequirements: ['National ID', 'Passport Photo', 'Bank Statement'],
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
    },
    customization: {
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#10B981',
        backgroundColor: '#F9FAFB',
        textColor: '#111827'
      },
      branding: {
        logo: '/placeholder.svg',
        favicon: '/favicon.ico',
        motto: 'Unity in Progress',
        tagline: 'Building wealth together'
      },
      features: {
        enabledModules: ['loans', 'savings', 'investments', 'meetings'],
        customFields: [],
        dashboardLayout: 'default'
      }
    }
  },
  {
    id: 'coop-2',
    name: 'Unity Savings & Credit',
    logo: '/placeholder.svg',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    motto: 'Strength through Unity',
    subscriptionTier: 'starter',
    memberLimit: 100,
    currentMembers: 87,
    status: 'active',
    createdDate: '2024-03-10',
    lastPayment: '2024-06-01',
    nextBilling: '2024-07-01',
    monthlyFee: 15000,
    contactEmail: 'info@unity-sc.ng',
    contactPhone: '+234-802-345-6789',
    address: 'Abuja, Nigeria',
    settings: {
      loanSettings: {
        maxLoanAmount: 200000,
        defaultInterestRate: 10,
        maxLoanTerm: 12,
        collateralRequired: false,
        guarantorsRequired: 1,
        autoApprovalLimit: 25000,
        latePaymentGracePeriod: 5
      },
      savingsSettings: {
        minimumBalance: 2000,
        interestRate: 6,
        withdrawalLimits: {
          daily: 20000,
          monthly: 80000
        },
        compoundingFrequency: 'quarterly'
      },
      membershipSettings: {
        registrationFee: 1000,
        monthlyDues: 500,
        minimumAge: 21,
        maximumAge: 60,
        documentRequirements: ['National ID', 'Passport Photo'],
        approvalWorkflow: 'automatic',
        probationPeriod: 60
      },
      fineStructure: {
        latePaymentFine: 300,
        missedMeetingFine: 100,
        defaultLoanFine: 500,
        documentationFine: 50,
        customFines: []
      },
      meetingSettings: {
        frequency: 'weekly',
        quorumPercentage: 50,
        votingThreshold: 60,
        allowVirtualAttendance: false
      }
    },
    customization: {
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        accentColor: '#F59E0B',
        backgroundColor: '#F9FAFB',
        textColor: '#111827'
      },
      branding: {
        logo: '/placeholder.svg',
        favicon: '/favicon.ico',
        motto: 'Strength through Unity'
      },
      features: {
        enabledModules: ['loans', 'savings', 'meetings'],
        customFields: [],
        dashboardLayout: 'compact'
      }
    }
  }
];

const mockSubscriptionTiers: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15000,
    memberLimit: 100,
    features: [
      'Basic member management',
      'Loan tracking',
      'Savings management',
      'Simple reporting',
      'Email support',
      'Mobile responsive'
    ],
    description: 'Perfect for small cooperatives starting their digital journey',
    customFeatures: {
      multiBranch: false,
      apiAccess: false,
      customIntegrations: false,
      dedicatedSupport: false,
      trainingIncluded: false
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 35000,
    memberLimit: 500,
    features: [
      'Advanced member management',
      'Investment tracking',
      'Advanced reporting',
      'SMS notifications',
      'Custom branding',
      'Priority support',
      'Meeting management',
      'Document management'
    ],
    description: 'Ideal for growing cooperatives with more members',
    isPopular: true,
    customFeatures: {
      multiBranch: true,
      apiAccess: false,
      customIntegrations: false,
      dedicatedSupport: true,
      trainingIncluded: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 75000,
    memberLimit: -1, // Unlimited
    features: [
      'Unlimited members',
      'Multi-branch support',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Training sessions',
      'White-label options',
      'Advanced analytics',
      'Audit trails',
      'Custom workflows'
    ],
    description: 'For large cooperatives and federations',
    customFeatures: {
      multiBranch: true,
      apiAccess: true,
      customIntegrations: true,
      dedicatedSupport: true,
      trainingIncluded: true
    }
  }
];

export const useSuperAdminState = () => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(mockCooperatives);
  const [subscriptionTiers] = useState<SubscriptionTier[]>(mockSubscriptionTiers);
  const [onboardingRequests, setOnboardingRequests] = useState<CooperativeOnboarding[]>([]);
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    general: {
      platformName: 'Alajeseku.com',
      supportEmail: 'support@alajeseku.com',
      supportPhone: '+234-700-ALAJE-KU',
      timezone: 'Africa/Lagos',
      currency: 'NGN',
      language: 'en'
    },
    billing: {
      gracePeriodDays: 7,
      suspensionWarningDays: 3,
      autoSuspendAfterDays: 14,
      paymentGateways: ['paystack', 'flutterwave']
    },
    features: {
      enableTrialPeriod: true,
      trialDurationDays: 30,
      enableReferralProgram: false,
      referralBonus: 5000
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5
    }
  });

  const [analytics, setAnalytics] = useState<PlatformAnalytics>({
    totalCooperatives: mockCooperatives.length,
    totalMembers: mockCooperatives.reduce((sum, coop) => sum + coop.currentMembers, 0),
    monthlyRevenue: mockCooperatives.reduce((sum, coop) => sum + (coop.status === 'active' ? coop.monthlyFee : 0), 0),
    annualRevenue: mockCooperatives.reduce((sum, coop) => sum + (coop.status === 'active' ? coop.monthlyFee * 12 : 0), 0),
    growthRate: 15.5,
    activeSubscriptions: mockCooperatives.filter(c => c.status === 'active').length,
    churnRate: 2.1,
    averageRevenuePerUser: 0,
    topPerformingCooperatives: mockCooperatives.slice(0, 3),
    revenueByTier: {
      starter: 45000,
      professional: 140000,
      enterprise: 225000
    },
    memberGrowthTrend: [
      { month: 'Jan', value: 180, change: 12 },
      { month: 'Feb', value: 195, change: 8.3 },
      { month: 'Mar', value: 210, change: 7.7 },
      { month: 'Apr', value: 235, change: 11.9 },
      { month: 'May', value: 255, change: 8.5 },
      { month: 'Jun', value: 321, change: 25.9 }
    ],
    revenueGrowthTrend: [
      { month: 'Jan', value: 125000, change: 15 },
      { month: 'Feb', value: 138000, change: 10.4 },
      { month: 'Mar', value: 155000, change: 12.3 },
      { month: 'Apr', value: 172000, change: 11.0 },
      { month: 'May', value: 189000, change: 9.9 },
      { month: 'Jun', value: 410000, change: 117 }
    ]
  });

  // Cooperative Management Functions
  const addCooperative = async (cooperativeData: {
    name: string;
    logo?: string;
    primary_color: string;
    secondary_color: string;
    motto?: string;
    subscription_tier: 'starter' | 'professional' | 'enterprise';
    member_limit: number;
    status: 'active' | 'suspended' | 'trial' | 'expired' | 'pending_approval';
    last_payment?: string;
    next_billing: string;
    monthly_fee: number;
    contact_email: string;
    contact_phone: string;
    address?: string;
    settings: any;
  }) => {
    try {
      const newCooperative = await cooperativeService.createCooperative(cooperativeData);
      if (newCooperative) {
        await loadCooperatives();
        await loadAnalytics();
        toast.success('Cooperative created successfully');
        return true;
      } else {
        toast.error('Failed to create cooperative');
        return false;
      }
    } catch (error) {
      console.error('Error adding cooperative:', error);
      toast.error('Failed to create cooperative');
      return false;
    }
  };

  const updateCooperative = (id: string, updates: Partial<Cooperative>) => {
    setCooperatives(prev => 
      prev.map(coop => 
        coop.id === id ? { ...coop, ...updates } : coop
      )
    );
    console.log('Cooperative updated:', id, updates);
  };

  const suspendCooperative = (id: string) => {
    updateCooperative(id, { status: 'suspended' });
    console.log('Cooperative suspended:', id);
  };

  const reactivateCooperative = (id: string) => {
    updateCooperative(id, { status: 'active' });
    console.log('Cooperative reactivated:', id);
  };

  const deleteCooperative = (id: string) => {
    setCooperatives(prev => prev.filter(coop => coop.id !== id));
    console.log('Cooperative deleted:', id);
  };

  // Onboarding Management
  const addOnboardingRequest = (request: Omit<CooperativeOnboarding, 'id' | 'submittedDate' | 'status'>) => {
    const newRequest: CooperativeOnboarding = {
      ...request,
      id: `onboard-${Date.now()}`,
      submittedDate: new Date().toISOString(),
      status: 'pending'
    };
    setOnboardingRequests(prev => [...prev, newRequest]);
    console.log('New onboarding request:', newRequest);
  };

  const approveOnboardingRequest = async (id: string) => {
    try {
      const success = await cooperativeService.approveOnboardingRequest(id);
      if (success) {
        await loadCooperatives();
        await loadOnboardingRequests();
        await loadAnalytics();
        toast.success('Onboarding request approved successfully');
      } else {
        toast.error('Failed to approve onboarding request');
      }
    } catch (error) {
      console.error('Error approving onboarding request:', error);
      toast.error('Failed to approve onboarding request');
    }
  };

  const rejectOnboardingRequest = async (id: string, reason: string) => {
    try {
      const success = await cooperativeService.rejectOnboardingRequest(id, reason);
      if (success) {
        await loadOnboardingRequests();
        toast.success('Onboarding request rejected');
      } else {
        toast.error('Failed to reject onboarding request');
      }
    } catch (error) {
      console.error('Error rejecting onboarding request:', error);
      toast.error('Failed to reject onboarding request');
    }
  };

  // Utility Functions
  const getCooperativeById = (id: string) => {
    return cooperatives.find(coop => coop.id === id);
  };

  const getSubscriptionTierById = (id: string) => {
    return subscriptionTiers.find(tier => tier.id === id);
  };

  const getCooperativesByTier = (tier: string) => {
    return cooperatives.filter(coop => coop.subscriptionTier === tier);
  };

  const getActiveCooperatives = () => {
    return cooperatives.filter(coop => coop.status === 'active');
  };

  // Load functions
  const loadCooperatives = async () => {
    try {
      const data = await cooperativeService.getAllCooperatives();
      // Convert database format to frontend format
      const formattedCooperatives = data.map(coop => ({
        id: coop.id,
        name: coop.name,
        logo: coop.logo || '/placeholder.svg',
        primaryColor: coop.primary_color,
        secondaryColor: coop.secondary_color,
        motto: coop.motto || '',
        subscriptionTier: coop.subscription_tier,
        memberLimit: coop.member_limit,
        currentMembers: coop.current_members,
        status: coop.status,
        createdDate: coop.created_at,
        lastPayment: coop.last_payment || '',
        nextBilling: coop.next_billing,
        monthlyFee: coop.monthly_fee,
        contactEmail: coop.contact_email,
        contactPhone: coop.contact_phone,
        address: coop.address || '',
        settings: { ...coop.settings, fineStructure: { ...coop.settings.fineStructure, customFines: [] } },
        customization: {
          theme: {
            primaryColor: coop.primary_color,
            secondaryColor: coop.secondary_color,
            accentColor: '#10B981',
            backgroundColor: '#F9FAFB',
            textColor: '#111827'
          },
          branding: {
            logo: coop.logo || '/placeholder.svg',
            favicon: '/favicon.ico',
            motto: coop.motto || ''
          },
          features: {
            enabledModules: ['loans', 'savings', 'meetings'],
            customFields: [],
            dashboardLayout: 'default'
          }
        }
      }));
      setCooperatives(formattedCooperatives);
    } catch (error) {
      console.error('Error loading cooperatives:', error);
      toast.error('Failed to load cooperatives');
    }
  };

  const loadOnboardingRequests = async () => {
    try {
      const data = await cooperativeService.getAllOnboardingRequests();
      // Convert database format to frontend format
      const formattedRequests = data.map(req => ({
        id: req.id,
        cooperativeName: req.cooperative_name,
        contactPerson: req.admin_name,
        email: req.contact_email,
        phone: req.contact_phone,
        address: req.address || '',
        expectedMembers: req.expected_members,
        selectedTier: req.selected_tier,
        status: req.status,
        submittedDate: req.submitted_at,
        documents: [],
        notes: req.notes
      }));
      setOnboardingRequests(formattedRequests);
    } catch (error) {
      console.error('Error loading onboarding requests:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await cooperativeService.getPlatformAnalytics();
      setAnalytics(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadCooperatives();
    loadOnboardingRequests();
    loadAnalytics();
  }, []);

  // Update analytics when cooperatives change
  useEffect(() => {
    if (cooperatives.length > 0) {
      const totalRevenue = cooperatives.reduce((sum, coop) => sum + (coop.status === 'active' ? coop.monthlyFee : 0), 0);
      const totalMembers = cooperatives.reduce((sum, coop) => sum + coop.currentMembers, 0);
      
      setAnalytics(prev => ({
        ...prev,
        totalCooperatives: cooperatives.length,
        totalMembers,
        monthlyRevenue: totalRevenue,
        annualRevenue: totalRevenue * 12,
        activeSubscriptions: cooperatives.filter(c => c.status === 'active').length,
        averageRevenuePerUser: totalMembers > 0 ? totalRevenue / totalMembers : 0,
        topPerformingCooperatives: cooperatives
          .sort((a, b) => b.currentMembers - a.currentMembers)
          .slice(0, 3),
        revenueByTier: {
          starter: cooperatives.filter(c => c.subscriptionTier === 'starter' && c.status === 'active')
            .reduce((sum, c) => sum + c.monthlyFee, 0),
          professional: cooperatives.filter(c => c.subscriptionTier === 'professional' && c.status === 'active')
            .reduce((sum, c) => sum + c.monthlyFee, 0),
          enterprise: cooperatives.filter(c => c.subscriptionTier === 'enterprise' && c.status === 'active')
            .reduce((sum, c) => sum + c.monthlyFee, 0)
        }
      }));
    }
  }, [cooperatives]);

  return {
    cooperatives,
    subscriptionTiers,
    onboardingRequests,
    billingRecords,
    platformSettings,
    analytics,
    addCooperative,
    updateCooperative,
    suspendCooperative,
    reactivateCooperative,
    deleteCooperative,
    addOnboardingRequest,
    approveOnboardingRequest,
    rejectOnboardingRequest,
    getCooperativeById,
    getSubscriptionTierById,
    getCooperativesByTier,
    getActiveCooperatives,
    loadCooperatives,
    loadOnboardingRequests,
    loadAnalytics,
    setPlatformSettings
  };
};
