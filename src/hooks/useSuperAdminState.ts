
import { useState, useEffect } from 'react';
import { Cooperative, SuperAdmin, PlatformAnalytics, SubscriptionTier } from '@/types/multiTenant';

// Mock data for development
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
        guarantorsRequired: 2
      },
      savingsSettings: {
        minimumBalance: 5000,
        interestRate: 8,
        withdrawalLimits: {
          daily: 50000,
          monthly: 200000
        }
      },
      membershipSettings: {
        registrationFee: 2000,
        monthlyDues: 1000,
        minimumAge: 18,
        documentRequirements: ['National ID', 'Passport Photo', 'Bank Statement']
      },
      fineStructure: {
        latePaymentFine: 500,
        missedMeetingFine: 200,
        defaultLoanFine: 1000
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
        guarantorsRequired: 1
      },
      savingsSettings: {
        minimumBalance: 2000,
        interestRate: 6,
        withdrawalLimits: {
          daily: 20000,
          monthly: 80000
        }
      },
      membershipSettings: {
        registrationFee: 1000,
        monthlyDues: 500,
        minimumAge: 21,
        documentRequirements: ['National ID', 'Passport Photo']
      },
      fineStructure: {
        latePaymentFine: 300,
        missedMeetingFine: 100,
        defaultLoanFine: 500
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
    features: ['Basic member management', 'Loan tracking', 'Simple reporting', 'Email support'],
    description: 'Perfect for small cooperatives starting their digital journey'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 35000,
    memberLimit: 500,
    features: ['Advanced member management', 'Investment tracking', 'Advanced reporting', 'SMS notifications', 'Custom branding', 'Priority support'],
    description: 'Ideal for growing cooperatives with more members'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 75000,
    memberLimit: -1, // Unlimited
    features: ['Unlimited members', 'Multi-branch support', 'API access', 'Custom integrations', 'Dedicated support', 'Training sessions'],
    description: 'For large cooperatives and federations'
  }
];

export const useSuperAdminState = () => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(mockCooperatives);
  const [subscriptionTiers] = useState<SubscriptionTier[]>(mockSubscriptionTiers);
  const [analytics, setAnalytics] = useState<PlatformAnalytics>({
    totalCooperatives: mockCooperatives.length,
    totalMembers: mockCooperatives.reduce((sum, coop) => sum + coop.currentMembers, 0),
    monthlyRevenue: mockCooperatives.reduce((sum, coop) => sum + (coop.status === 'active' ? coop.monthlyFee : 0), 0),
    growthRate: 15.5,
    activeSubscriptions: mockCooperatives.filter(c => c.status === 'active').length,
    churnRate: 2.1,
    topPerformingCooperatives: mockCooperatives.slice(0, 3)
  });

  const addCooperative = (cooperativeData: Omit<Cooperative, 'id' | 'createdDate' | 'currentMembers'>) => {
    const newCooperative: Cooperative = {
      ...cooperativeData,
      id: `coop-${Date.now()}`,
      createdDate: new Date().toISOString(),
      currentMembers: 0
    };
    
    setCooperatives(prev => [...prev, newCooperative]);
    console.log('New cooperative added:', newCooperative);
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

  const getCooperativeById = (id: string) => {
    return cooperatives.find(coop => coop.id === id);
  };

  const getSubscriptionTierById = (id: string) => {
    return subscriptionTiers.find(tier => tier.id === id);
  };

  // Update analytics when cooperatives change
  useEffect(() => {
    setAnalytics({
      totalCooperatives: cooperatives.length,
      totalMembers: cooperatives.reduce((sum, coop) => sum + coop.currentMembers, 0),
      monthlyRevenue: cooperatives.reduce((sum, coop) => sum + (coop.status === 'active' ? coop.monthlyFee : 0), 0),
      growthRate: 15.5, // This would be calculated based on historical data
      activeSubscriptions: cooperatives.filter(c => c.status === 'active').length,
      churnRate: 2.1, // This would be calculated based on cancellations
      topPerformingCooperatives: cooperatives.slice(0, 3)
    });
  }, [cooperatives]);

  return {
    cooperatives,
    subscriptionTiers,
    analytics,
    addCooperative,
    updateCooperative,
    suspendCooperative,
    reactivateCooperative,
    deleteCooperative,
    getCooperativeById,
    getSubscriptionTierById
  };
};
