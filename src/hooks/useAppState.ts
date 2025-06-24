import { useState } from 'react';

export interface Member {
  id: string;
  name: string;
  membershipId: string;
  email: string;
  phone: string;
  address: string;
  homeAddress?: string;
  town?: string;
  lga?: string;
  stateOfOrigin?: string;
  occupation?: string;
  jobAddress?: string;
  introducedBy?: string;
  sex?: string;
  joinDate: string;
  balance: number;
  savings: number;
  loanBalance: number;
  investmentBalance?: number;
  status: 'active' | 'inactive' | 'suspended' | 'dormant';
  documents: string[];
  guaranteedLoans: any[];
  guarantorFor?: any[];
  guarantors?: Array<{
    name: string;
    phone: string;
    address: string;
  }>;
  fines: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  lastActivityDate?: string;
  nextOfKin?: {
    name: string;
    phone: string;
    altPhone: string;
    address: string;
  };
  signatures?: {
    applicant?: string;
    guarantor1?: string;
    guarantor2?: string;
    president?: string;
    secretary?: string;
  };
  repaymentRating?: {
    stars: number;
    totalLoans: number;
    onTimePayments: number;
    earlyPayments: number;
    latePayments: number;
    missedPayments: number;
    averageDaysLate: number;
  };
}

export interface LoanApplication {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  purpose: string;
  duration: number;
  guarantor1: any;
  guarantor2: any | null;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  monthlyPayment: number;
  weeklyPayment?: number;
  weeksRemaining?: number;
  nextPaymentDate?: string;
  fines?: number;
  totalPaid?: number;
  remainingAmount?: number;
  paymentHistory?: Array<{
    date: string;
    amount: number;
    daysEarly?: number;
    daysLate?: number;
    fine?: number;
  }>;
}

export interface Investment {
  id: string;
  productName: string;
  productImages: string[];
  description: string;
  unitPrice: number;
  totalWeeks: number;
  availableUnits: number;
  totalUnits: number;
  status: 'active' | 'closed';
  applications: InvestmentApplication[];
}

export interface InvestmentApplication {
  memberId: string;
  memberName: string;
  quantity: number;
  totalAmount: number;
  remainingAmount: number;
  weeksRemaining: number;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  targetMember?: string;
  amount?: number;
}

export interface Activity {
  id: string;
  description: string;
  time: string;
  adminName?: string;
  memberName?: string;
  amount?: string;
  type?: string;
}

export interface Notification {
  id: number;
  memberId: string;
  type: 'guarantor' | 'investment' | 'loan' | 'general';
  title: string;
  message: string;
  actionRequired: boolean;
  timestamp: string;
}

export interface Approval {
  id: string;
  type: 'loan' | 'investment' | 'member';
  applicantId: string;
  applicantName: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  priority?: 'high' | 'medium' | 'low';
  details?: string;
}

export interface AGM {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string[];
  attendees: Array<{
    memberId: string;
    rsvpStatus: 'attending' | 'not_attending' | 'pending';
  }>;
  status: 'scheduled' | 'completed' | 'cancelled';
  notice?: string;
  documents?: any[];
}

export interface Feedback {
  id: string;
  memberId: string;
  memberName: string;
  type: 'suggestion' | 'complaint' | 'compliment';
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  title?: string;
  date?: string;
  response?: string;
}

// Calculate repayment rating based on loan history
const calculateRepaymentRating = (member: Member, loans: LoanApplication[]): Member['repaymentRating'] => {
  const memberLoans = loans.filter(loan => 
    loan.memberId === member.id && loan.status === 'approved'
  );

  if (memberLoans.length === 0) {
    return {
      stars: 5, // New members start with 5 stars
      totalLoans: 0,
      onTimePayments: 0,
      earlyPayments: 0,
      latePayments: 0,
      missedPayments: 0,
      averageDaysLate: 0
    };
  }

  let onTimePayments = 0;
  let earlyPayments = 0;
  let latePayments = 0;
  let missedPayments = 0;
  let totalDaysLate = 0;
  let totalPayments = 0;

  memberLoans.forEach(loan => {
    if (loan.paymentHistory) {
      loan.paymentHistory.forEach(payment => {
        totalPayments++;
        if (payment.daysEarly && payment.daysEarly > 0) {
          earlyPayments++;
        } else if (payment.daysLate && payment.daysLate > 0) {
          latePayments++;
          totalDaysLate += payment.daysLate;
        } else {
          onTimePayments++;
        }
      });
    }

    // Check for missed payments (fines without corresponding payments)
    if (loan.fines && loan.fines > 0) {
      missedPayments += Math.floor(loan.fines / 1000); // Assuming 1000 fine per missed payment
    }
  });

  const averageDaysLate = latePayments > 0 ? totalDaysLate / latePayments : 0;
  
  // Calculate star rating
  let stars = 5;
  
  if (totalPayments === 0) return {
    stars: 5,
    totalLoans: memberLoans.length,
    onTimePayments,
    earlyPayments,
    latePayments,
    missedPayments,
    averageDaysLate
  };

  const onTimePercentage = (onTimePayments + earlyPayments) / totalPayments;
  const latePercentage = latePayments / totalPayments;
  const missedPercentage = missedPayments / totalPayments;

  // Rating algorithm
  if (onTimePercentage >= 0.95 && earlyPayments > 0) {
    stars = 5; // Excellent
  } else if (onTimePercentage >= 0.9) {
    stars = 4; // Very Good
  } else if (onTimePercentage >= 0.8) {
    stars = 3; // Good
  } else if (onTimePercentage >= 0.6) {
    stars = 2; // Fair
  } else {
    stars = 1; // Poor
  }

  // Penalties
  if (missedPercentage > 0.1) stars = Math.max(1, stars - 1);
  if (averageDaysLate > 7) stars = Math.max(1, stars - 0.5);

  return {
    stars: Math.round(stars),
    totalLoans: memberLoans.length,
    onTimePayments,
    earlyPayments,
    latePayments,
    missedPayments,
    averageDaysLate: Math.round(averageDaysLate)
  };
};

// Mock data with payment history
const mockMembers: Member[] = [
  {
    id: 'MEM001',
    name: 'John Doe',
    membershipId: 'ONCS001',
    email: 'john@example.com',
    phone: '+234-801-234-5678',
    address: '123 Lagos Street, Lagos',
    homeAddress: '123 Lagos Street, Lagos',
    town: 'Lagos',
    lga: 'Lagos Mainland',
    stateOfOrigin: 'Lagos',
    occupation: 'Teacher',
    jobAddress: '456 School Street, Lagos',
    introducedBy: 'Jane Smith',
    sex: 'Male',
    joinDate: '2023-01-15',
    balance: 125000,
    savings: 45000,
    investmentBalance: 0,
    loanBalance: 0, // John paid off his loan
    status: 'active',
    documents: [],
    guaranteedLoans: [],
    guarantorFor: [{ memberId: 'MEM002', memberName: 'Alice Johnson', loanAmount: 200000, remainingAmount: 180000 }],
    guarantors: [],
    fines: 0,
    lastPaymentDate: '2024-01-10',
    lastPaymentAmount: 5000,
    lastActivityDate: '2024-01-10',
    nextOfKin: {
      name: 'Mary Doe',
      phone: '+234-801-111-1111',
      altPhone: '+234-802-111-1111',
      address: '789 Family Street, Lagos'
    }
  },
  {
    id: 'MEM002',
    name: 'Alice Johnson',
    membershipId: 'ONCS002',
    email: 'alice@example.com',
    phone: '+234-802-234-5678',
    address: '456 Abuja Avenue, Abuja',
    homeAddress: '456 Abuja Avenue, Abuja',
    town: 'Abuja',
    lga: 'Abuja Municipal',
    stateOfOrigin: 'FCT',
    occupation: 'Nurse',
    jobAddress: '789 Hospital Road, Abuja',
    introducedBy: 'Michael Johnson',
    sex: 'Female',
    joinDate: '2023-02-20',
    balance: 89000,
    savings: 32000,
    investmentBalance: 0,
    loanBalance: 180000, // Alice has an active loan
    status: 'active',
    documents: [],
    guaranteedLoans: [],
    guarantorFor: [],
    guarantors: [
      { name: 'John Doe', phone: '+234-801-234-5678', address: '123 Lagos Street, Lagos' },
      { name: 'Michael Johnson', phone: '+234-803-234-5678', address: '789 Port Harcourt Road, Port Harcourt' }
    ],
    fines: 0,
    lastPaymentDate: '2024-01-05',
    lastPaymentAmount: 20000,
    lastActivityDate: '2024-01-05',
    nextOfKin: {
      name: 'John Smith',
      phone: '+234-802-222-2222',
      altPhone: '+234-803-222-2222',
      address: '123 Family Avenue, Abuja'
    }
  },
  {
    id: 'MEM003',
    name: 'Michael Johnson',
    membershipId: 'ONCS003',
    email: 'michael@example.com',
    phone: '+234-803-234-5678',
    address: '789 Port Harcourt Road, Port Harcourt',
    homeAddress: '789 Port Harcourt Road, Port Harcourt',
    town: 'Port Harcourt',
    lga: 'Port Harcourt City',
    stateOfOrigin: 'Rivers',
    occupation: 'Engineer',
    jobAddress: '456 Oil Company Street, Port Harcourt',
    introducedBy: 'John Doe',
    sex: 'Male',
    joinDate: '2023-03-10',
    balance: 156000,
    savings: 67000,
    investmentBalance: 0,
    loanBalance: 0,
    status: 'inactive',
    documents: [],
    guaranteedLoans: [],
    guarantorFor: [],
    guarantors: [],
    fines: 0,
    lastPaymentDate: '2023-12-20',
    lastPaymentAmount: 2000,
    lastActivityDate: '2023-12-20',
    nextOfKin: {
      name: 'Sarah Johnson',
      phone: '+234-803-333-3333',
      altPhone: '+234-804-333-3333',
      address: '456 Family Road, Port Harcourt'
    }
  }
];

const mockLoanApplications: LoanApplication[] = [
  {
    id: 'LOAN001',
    memberId: 'MEM002',
    memberName: 'Alice Johnson',
    amount: 200000,
    purpose: 'Business expansion',
    duration: 24,
    guarantor1: { name: 'John Doe', phone: '+234-801-234-5678' },
    guarantor2: { name: 'Michael Johnson', phone: '+234-803-234-5678' },
    status: 'approved',
    applicationDate: '2023-12-01',
    monthlyPayment: 10000,
    weeklyPayment: 2500,
    weeksRemaining: 18,
    nextPaymentDate: '2024-01-15',
    fines: 0,
    totalPaid: 20000,
    remainingAmount: 180000,
    paymentHistory: [
      { date: '2023-12-15', amount: 10000, daysEarly: 1 },
      { date: '2024-01-05', amount: 10000 }
    ]
  }
];

const mockInvestments: Investment[] = [
  {
    id: 'INV001',
    productName: 'Palm Oil Investment Package',
    productImages: [],
    description: 'Invest in our premium palm oil production with guaranteed returns',
    unitPrice: 50000,
    totalWeeks: 52,
    availableUnits: 45,
    totalUnits: 100,
    status: 'active',
    applications: [
      {
        memberId: 'MEM001',
        memberName: 'John Doe',
        quantity: 2,
        totalAmount: 100000,
        remainingAmount: 60000,
        weeksRemaining: 30,
        status: 'approved',
        applicationDate: '2024-01-15'
      }
    ]
  }
];

const mockActivities: Activity[] = [
  {
    id: 'ACT001',
    type: 'registration',
    description: 'New member registration',
    time: '2 hours ago',
    adminName: 'Admin User',
    memberName: 'John Doe'
  },
  {
    id: 'ACT002',
    type: 'loan',
    description: 'Loan application approved',
    time: '4 hours ago',
    adminName: 'Admin User',
    memberName: 'Alice Johnson',
    amount: '₦200,000'
  }
];

const mockApprovals: Approval[] = [
  {
    id: 'APP001',
    type: 'loan',
    applicantId: 'MEM001',
    applicantName: 'John Doe',
    amount: 50000,
    status: 'pending',
    applicationDate: '2024-01-15',
    priority: 'high',
    details: 'Emergency loan for medical expenses'
  }
];

const mockAGMs: AGM[] = [
  {
    id: 'AGM001',
    title: 'Annual General Meeting 2024',
    date: '2024-03-15',
    time: '10:00',
    venue: 'Community Hall',
    agenda: ['Financial Report', 'Election of Officers', 'New Policies'],
    attendees: [
      { memberId: 'MEM001', rsvpStatus: 'attending' },
      { memberId: 'MEM002', rsvpStatus: 'pending' }
    ],
    status: 'scheduled',
    notice: 'All members are expected to attend this important meeting',
    documents: []
  }
];

const mockFeedback: Feedback[] = [];

export const useAppState = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>(mockLoanApplications);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [agms, setAGMs] = useState<AGM[]>(mockAGMs);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);

  // Update members with repayment ratings
  const membersWithRatings = members.map(member => ({
    ...member,
    repaymentRating: calculateRepaymentRating(member, loanApplications)
  }));

  // Stats calculation
  const stats = {
    totalMembers: members.length,
    totalSavings: members.reduce((sum, member) => sum + member.savings, 0),
    totalLoans: members.reduce((sum, member) => sum + member.loanBalance, 0),
    activeLoans: members.filter(member => member.loanBalance > 0).length,
    activeLoanAmount: members.reduce((sum, member) => sum + member.loanBalance, 0),
    totalInvestments: investments.reduce((sum, inv) => 
      sum + inv.applications.reduce((appSum, app) => appSum + (app.status === 'approved' ? app.remainingAmount : 0), 0), 0),
    pendingApprovals: loanApplications.filter(loan => loan.status === 'pending').length + 
      investments.reduce((sum, inv) => sum + inv.applications.filter(app => app.status === 'pending').length, 0),
    totalFines: members.reduce((sum, member) => sum + (member.fines || 0), 0),
    dailyReturns: { 
      date: new Date().toISOString().split('T')[0], 
      amount: 85000,
      totalAmount: 85000,
      loanReturns: 35000,
      investmentReturns: 25000,
      savings: 25000
    },
    dormantMembers: members.filter(member => member.status === 'dormant').length
  };

  const dailyReturns = [
    { date: '2024-01-01', amount: 50000, totalAmount: 50000, loanReturns: 20000, investmentReturns: 15000, savings: 15000 },
    { date: '2024-01-02', amount: 75000, totalAmount: 75000, loanReturns: 30000, investmentReturns: 25000, savings: 20000 },
    { date: '2024-01-03', amount: 60000, totalAmount: 60000, loanReturns: 25000, investmentReturns: 20000, savings: 15000 },
    { date: '2024-01-04', amount: 80000, totalAmount: 80000, loanReturns: 35000, investmentReturns: 25000, savings: 20000 },
    { date: '2024-01-05', amount: 95000, totalAmount: 95000, loanReturns: 40000, investmentReturns: 30000, savings: 25000 },
    { date: '2024-01-06', amount: 70000, totalAmount: 70000, loanReturns: 30000, investmentReturns: 20000, savings: 20000 },
    { date: '2024-01-07', amount: 85000, totalAmount: 85000, loanReturns: 35000, investmentReturns: 25000, savings: 25000 }
  ];

  // Check if member can apply for loan
  const canMemberApplyForLoan = (memberId: string): { canApply: boolean; reason?: string } => {
    const member = members.find(m => m.id === memberId);
    if (!member) return { canApply: false, reason: 'Member not found' };

    // Check if member has active loan
    if (member.loanBalance > 0) {
      return { canApply: false, reason: 'You have an active loan that must be repaid first' };
    }

    // Check if member is guaranteeing someone else's loan
    if (member.guarantorFor && member.guarantorFor.length > 0) {
      const activeGuarantees = member.guarantorFor.filter(g => g.remainingAmount > 0);
      if (activeGuarantees.length > 0) {
        return { 
          canApply: false, 
          reason: `You are currently guaranteeing ${activeGuarantees.length} active loan(s). Complete guarantor obligations first.` 
        };
      }
    }

    return { canApply: true };
  };

  // Member management functions
  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember = {
      ...memberData,
      id: `MEM${String(members.length + 1).padStart(3, '0')}`
    };
    setMembers(prev => [...prev, newMember]);
    addAdminLog('ADMIN001', 'Admin User', 'Member Added', `Added new member: ${newMember.name}`);
  };

  const updateMember = (memberId: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
    addAdminLog('ADMIN001', 'Admin User', 'Member Updated', `Updated member: ${memberId}`);
  };

  const updateMemberBalance = (memberId: string, amount: number, type: 'add' | 'subtract') => {
    setMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const newBalance = type === 'add' ? member.balance + amount : member.balance - amount;
        return { ...member, balance: Math.max(0, newBalance) };
      }
      return member;
    }));
    addAdminLog('ADMIN001', 'Admin User', 'Balance Update', `${type === 'add' ? 'Added' : 'Subtracted'} ₦${amount} for member: ${memberId}`);
  };

  const suspendMember = (memberId: string) => {
    updateMember(memberId, { status: 'suspended' });
    addAdminLog('ADMIN001', 'Admin User', 'Member Suspended', `Suspended member: ${memberId}`);
  };

  const activateMember = (memberId: string) => {
    updateMember(memberId, { status: 'active' });
    addAdminLog('ADMIN001', 'Admin User', 'Member Activated', `Activated member: ${memberId}`);
  };

  // Investment management functions
  const createInvestment = (investmentData: Omit<Investment, 'id' | 'applications'>) => {
    const newInvestment = {
      ...investmentData,
      id: `INV${String(investments.length + 1).padStart(3, '0')}`,
      applications: []
    };
    setInvestments(prev => [...prev, newInvestment]);
    addAdminLog('ADMIN001', 'Admin User', 'Investment Created', `Created investment: ${newInvestment.productName}`);
  };

  const applyForInvestment = (investmentId: string, memberId: string, memberName: string, quantity: number) => {
    setInvestments(prev => prev.map(investment => {
      if (investment.id === investmentId) {
        const totalAmount = investment.unitPrice * quantity;
        const newApplication: InvestmentApplication = {
          memberId,
          memberName,
          quantity,
          totalAmount,
          remainingAmount: totalAmount,
          weeksRemaining: investment.totalWeeks,
          status: 'pending',
          applicationDate: new Date().toISOString()
        };
        return {
          ...investment,
          applications: [...investment.applications, newApplication]
        };
      }
      return investment;
    }));
  };

  // Loan management functions
  const createLoanApplication = (loanData: Omit<LoanApplication, 'id'>) => {
    const eligibility = canMemberApplyForLoan(loanData.memberId);
    if (!eligibility.canApply) {
      throw new Error(eligibility.reason);
    }

    const newLoan = {
      ...loanData,
      id: `LOAN${String(loanApplications.length + 1).padStart(3, '0')}`
    };
    setLoanApplications(prev => [...prev, newLoan]);
    addAdminLog('ADMIN001', 'Admin User', 'Loan Application', `New loan application: ${newLoan.memberName} - ₦${newLoan.amount}`);
  };

  const approveLoan = (loanId: string) => {
    setLoanApplications(prev => prev.map(loan => 
      loan.id === loanId ? { ...loan, status: 'approved' as const } : loan
    ));
    
    const loan = loanApplications.find(l => l.id === loanId);
    if (loan) {
      updateMember(loan.memberId, { 
        loanBalance: loan.amount,
        balance: members.find(m => m.id === loan.memberId)?.balance + loan.amount || loan.amount
      });
      addAdminLog('ADMIN001', 'Admin User', 'Loan Approved', `Approved loan: ${loan.memberName} - ₦${loan.amount}`);
    }
  };

  // Notification functions
  const respondToGuarantorRequest = (notificationId: number, response: 'accepted' | 'rejected', userId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, actionRequired: false }
        : notification
    ));
    addAdminLog(userId, 'User', 'Guarantor Response', `Guarantor request ${response}`);
  };

  // Admin functions
  const addAdminLog = (adminId: string, adminName: string, action: string, details: string) => {
    const newLog: AdminLog = {
      id: `LOG${String(adminLogs.length + 1).padStart(3, '0')}`,
      adminId,
      adminName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAdminLogs(prev => [...prev, newLog]);
  };

  const addActivity = (description: string, type?: string, memberName?: string, amount?: string) => {
    const newActivity: Activity = {
      id: `ACT${String(activities.length + 1).padStart(3, '0')}`,
      description,
      time: new Date().toLocaleString(),
      adminName: 'Admin User',
      memberName,
      amount,
      type
    };
    setActivities(prev => [...prev, newActivity]);
  };

  // Additional functions for missing features
  const approveApplication = (applicationId: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === applicationId ? { ...approval, status: 'approved' as const } : approval
    ));
  };

  const rejectApplication = (applicationId: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === applicationId ? { ...approval, status: 'rejected' as const } : approval
    ));
  };

  const createAGM = (agmData: Omit<AGM, 'id'>) => {
    const newAGM = {
      ...agmData,
      id: `AGM${String(agms.length + 1).padStart(3, '0')}`
    };
    setAGMs(prev => [...prev, newAGM]);
  };

  const updateAGMRSVP = (agmId: string, memberId: string) => {
    setAGMs(prev => prev.map(agm => 
      agm.id === agmId 
        ? { 
            ...agm, 
            attendees: agm.attendees.some(a => a.memberId === memberId) 
              ? agm.attendees.map(a => a.memberId === memberId ? {...a, rsvpStatus: 'attending' as const} : a)
              : [...agm.attendees, { memberId, rsvpStatus: 'attending' as const }]
          }
        : agm
    ));
  };

  const applyAutomatedFines = () => {
    console.log('Applying automated fines...');
  };

  const sendBroadcastMessage = (memberIds: string[], message: string, subject: string) => {
    console.log('Sending broadcast message to:', memberIds, subject, message);
  };

  const allocateSavings = (memberId: string, amount: number) => {
    updateMember(memberId, { 
      savings: members.find(m => m.id === memberId)?.savings + amount || amount 
    });
    addAdminLog('ADMIN001', 'Admin User', 'Savings Allocation', `Allocated ₦${amount} to member: ${memberId}`);
  };

  const updateFeedbackStatus = (feedbackId: string, status: 'pending' | 'reviewed' | 'resolved') => {
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId ? { ...f, status } : f
    ));
  };

  return {
    // Data
    members: membersWithRatings,
    investments,
    loanApplications,
    loans: loanApplications, // Alias for compatibility
    adminLogs,
    stats,
    dailyReturns,
    activities,
    notifications,
    approvals,
    agms,
    feedback,
    
    // Member functions
    addMember,
    updateMember,
    updateMemberBalance,
    suspendMember,
    activateMember,
    canMemberApplyForLoan,
    
    // Investment functions
    createInvestment,
    applyForInvestment,
    
    // Loan functions
    createLoanApplication,
    approveLoan,
    
    // Notification functions
    respondToGuarantorRequest,
    
    // Admin functions
    addAdminLog,
    addActivity,
    approveApplication,
    rejectApplication,
    createAGM,
    updateAGMRSVP,
    applyAutomatedFines,
    sendBroadcastMessage,
    allocateSavings,
    updateFeedbackStatus
  };
};
