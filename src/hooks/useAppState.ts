import { useState, useEffect } from 'react';

export interface Member {
  id: number;
  name: string;
  membershipId: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'dormant';
  balance: number;
  loanBalance: number;
  investmentBalance: number;
  sex: string;
  homeAddress: string;
  town: string;
  lga: string;
  stateOfOrigin: string;
  occupation: string;
  jobAddress: string;
  introducedBy: string;
  photo?: string;
  nextOfKin: {
    name: string;
    address: string;
    phone: string;
    altPhone: string;
    photo?: string;
  };
  guarantors: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  lastActivityDate?: string;
  fines: number;
  guarantorFor: Array<{
    memberId: number;
    memberName: string;
    loanAmount: number;
    remainingAmount: number;
  }>;
  signatures?: {
    applicant?: string;
    guarantor1?: string;
    guarantor2?: string;
    president?: string;
    secretary?: string;
  };
  documents?: {
    idCard?: string;
    passportPhoto?: string;
    nepaBill?: string;
    registrationForm?: string;
    nomineeForm?: string;
  };
}

export interface Loan {
  id: number;
  memberName: string;
  memberId: string;
  amount: number;
  purpose: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'repaid' | 'defaulted';
  guarantors: Array<{
    name: string;
    memberId: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  weeklyPayment: number;
  weeksRemaining: number;
  fines: number;
  repaymentHistory: Array<{
    date: string;
    amount: number;
    adminId: string;
  }>;
  nextPaymentDate: string;
}

export interface Investment {
  id: number;
  productName: string;
  productImages: string[];
  description: string;
  unitPrice: number;
  totalWeeks: number;
  availableUnits: number;
  totalUnits: number;
  createdDate: string;
  status: 'active' | 'closed';
  applications: Array<{
    memberId: number;
    memberName: string;
    quantity: number;
    totalAmount: number;
    applicationDate: string;
    status: 'pending' | 'approved' | 'rejected';
    repaymentHistory: Array<{
      date: string;
      amount: number;
      adminId: string;
    }>;
    remainingAmount: number;
    weeksRemaining: number;
  }>;
}

export interface Approval {
  id: number;
  type: 'membership' | 'loan' | 'investment' | 'withdrawal' | 'guarantor';
  applicantName: string;
  applicantId?: number;
  amount?: number;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
  priority: 'high' | 'medium' | 'low';
  memberData?: Partial<Member>;
  relatedId?: number;
  guarantorData?: {
    loanId: number;
    requesterName: string;
    loanAmount: number;
    purpose: string;
  };
}

export interface Activity {
  id: number;
  type: 'loan' | 'member' | 'payment' | 'savings' | 'approval' | 'investment' | 'fine' | 'admin';
  description: string;
  amount?: string;
  time: string;
  adminId?: string;
  adminName?: string;
  memberId?: number;
  memberName?: string;
}

export interface Notification {
  id: number;
  memberId: number;
  title: string;
  message: string;
  type: 'loan' | 'savings' | 'investment' | 'guarantor' | 'general' | 'default';
  date: string;
  read: boolean;
  actionRequired?: boolean;
  relatedId?: number;
}

export interface AGM {
  id: number;
  title: string;
  date: string;
  agenda: string[];
  notice: string;
  venue: string;
  attendees: Array<{
    memberId: number;
    memberName: string;
    rsvpStatus: 'pending' | 'attending' | 'not_attending';
  }>;
  documents: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface AdminLog {
  id: number;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  targetMember?: string;
  amount?: number;
}

export interface Feedback {
  id: number;
  memberId: number;
  memberName: string;
  title: string;
  message: string;
  category: 'complaint' | 'suggestion' | 'question' | 'bug_report';
  status: 'new' | 'seen' | 'implemented' | 'rejected';
  response?: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

interface AppState {
  members: Member[];
  loans: Loan[];
  investments: Investment[];
  approvals: Approval[];
  activities: Activity[];
  notifications: Notification[];
  agms: AGM[];
  adminLogs: AdminLog[];
  feedback: Feedback[];
  dailyReturns: {
    date: string;
    totalAmount: number;
    loanReturns: number;
    investmentReturns: number;
    savings: number;
  }[];
}

// Initial data with expanded structure
const initialMembers: Member[] = [
  {
    id: 1,
    name: 'John Doe',
    membershipId: 'MEM001',
    email: 'john@example.com',
    phone: '+234 800 123 4567',
    joinDate: '2023-01-15',
    status: 'active',
    balance: 450000,
    loanBalance: 150000,
    investmentBalance: 0,
    fines: 0,
    sex: 'Male',
    homeAddress: '123 Main Street',
    town: 'Lagos',
    lga: 'Lagos Island',
    stateOfOrigin: 'Lagos',
    occupation: 'Engineer',
    jobAddress: '456 Business District',
    introducedBy: 'Alice Johnson',
    guarantorFor: [],
    lastActivityDate: '2024-06-20',
    nextOfKin: {
      name: 'Jane Doe',
      address: '123 Main Street',
      phone: '+234 800 111 2222',
      altPhone: '+234 800 333 4444'
    },
    guarantors: [
      { name: 'Alice Johnson', address: '789 Oak Avenue', phone: '+234 800 555 6666' },
      { name: 'Bob Williams', address: '321 Pine Street', phone: '+234 800 777 8888' }
    ],
    lastPaymentDate: '2024-06-15',
    lastPaymentAmount: 6250,
    signatures: {
      applicant: '/placeholder-signature.png',
      guarantor1: '/placeholder-signature.png',
      guarantor2: '/placeholder-signature.png',
      president: '/placeholder-signature.png',
      secretary: '/placeholder-signature.png'
    }
  },
  {
    id: 2,
    name: 'Alice Johnson',
    membershipId: 'MEM002',
    email: 'alice@example.com',
    phone: '+234 800 234 5678',
    joinDate: '2023-02-20',
    status: 'active',
    balance: 320000,
    loanBalance: 0,
    investmentBalance: 0,
    fines: 0,
    sex: 'Female',
    homeAddress: '789 Oak Avenue',
    town: 'Abuja',
    lga: 'Wuse',
    stateOfOrigin: 'FCT',
    occupation: 'Teacher',
    jobAddress: '123 School Road',
    introducedBy: 'Carol Davis',
    guarantorFor: [],
    lastActivityDate: '2024-06-18',
    nextOfKin: {
      name: 'Mark Johnson',
      address: '789 Oak Avenue',
      phone: '+234 800 222 3333',
      altPhone: '+234 800 444 5555'
    },
    guarantors: [
      { name: 'John Doe', address: '123 Main Street', phone: '+234 800 123 4567' },
      { name: 'Carol Davis', address: '654 Elm Street', phone: '+234 800 999 0000' }
    ],
    lastPaymentDate: undefined,
    lastPaymentAmount: undefined,
    signatures: {
      applicant: '/placeholder-signature.png',
      guarantor1: '/placeholder-signature.png',
      guarantor2: '/placeholder-signature.png',
      president: '/placeholder-signature.png',
      secretary: '/placeholder-signature.png'
    }
  },
  {
    id: 3,
    name: 'Bob Williams',
    membershipId: 'MEM003',
    email: 'bob@example.com',
    phone: '+234 800 345 6789',
    joinDate: '2023-03-10',
    status: 'suspended',
    balance: 125000,
    loanBalance: 75000,
    investmentBalance: 0,
    fines: 1500,
    sex: 'Male',
    homeAddress: '321 Pine Street',
    town: 'Kano',
    lga: 'Nassarawa',
    stateOfOrigin: 'Kano',
    occupation: 'Trader',
    jobAddress: '987 Market Square',
    introducedBy: 'John Doe',
    guarantorFor: [],
    lastActivityDate: '2024-06-10',
    nextOfKin: {
      name: 'Sarah Williams',
      address: '321 Pine Street',
      phone: '+234 800 333 4444',
      altPhone: '+234 800 555 6666'
    },
    guarantors: [
      { name: 'John Doe', address: '123 Main Street', phone: '+234 800 123 4567' }
    ],
    lastPaymentDate: '2024-06-10',
    lastPaymentAmount: 3125,
    signatures: {
      applicant: '/placeholder-signature.png',
      guarantor1: '/placeholder-signature.png',
      guarantor2: '/placeholder-signature.png',
      president: '/placeholder-signature.png',
      secretary: '/placeholder-signature.png'
    }
  }
];

const initialLoans: Loan[] = [
  {
    id: 1,
    memberName: 'John Doe',
    memberId: 'MEM001',
    amount: 150000,
    purpose: 'Business expansion',
    applicationDate: '2024-06-15',
    status: 'approved',
    guarantors: [
      { name: 'Alice Johnson', memberId: 'MEM002', status: 'accepted' },
      { name: 'Bob Williams', memberId: 'MEM003', status: 'accepted' }
    ],
    weeklyPayment: 6250,
    weeksRemaining: 18,
    fines: 0,
    repaymentHistory: [],
    nextPaymentDate: '2024-06-22'
  }
];

const initialInvestments: Investment[] = [
  {
    id: 1,
    productName: 'Agricultural Equipment Package',
    productImages: ['/placeholder-product1.jpg', '/placeholder-product2.jpg'],
    description: 'Complete farming equipment set including tractors and irrigation systems',
    unitPrice: 500000,
    totalWeeks: 52,
    availableUnits: 8,
    totalUnits: 10,
    createdDate: '2024-06-01',
    status: 'active',
    applications: []
  }
];

const initialApprovals: Approval[] = [
  {
    id: 1,
    type: 'loan',
    applicantName: 'Alice Johnson',
    applicantId: 2,
    amount: 200000,
    applicationDate: '2024-06-20',
    status: 'pending',
    details: 'Request for business loan to expand teaching materials shop',
    priority: 'medium'
  },
  {
    id: 2,
    type: 'membership',
    applicantName: 'David Brown',
    applicationDate: '2024-06-19',
    status: 'pending',
    details: 'New member application - Teacher at Local Primary School',
    priority: 'low',
    memberData: {
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+234 800 456 7890',
      sex: 'Male',
      homeAddress: '456 Cedar Street',
      town: 'Port Harcourt',
      occupation: 'Teacher'
    }
  }
];

const initialActivities: Activity[] = [
  {
    id: 1,
    type: 'payment',
    description: 'Loan repayment from John Doe',
    amount: '₦6,250',
    time: '2024-06-20 10:30 AM',
    adminId: 'ADMIN001',
    adminName: 'Admin User',
    memberId: 1,
    memberName: 'John Doe'
  },
  {
    id: 2,
    type: 'savings',
    description: 'Savings deposit from Alice Johnson',
    amount: '₦15,000',
    time: '2024-06-20 09:15 AM',
    adminId: 'ADMIN001',
    adminName: 'Admin User',
    memberId: 2,
    memberName: 'Alice Johnson'
  }
];

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    members: initialMembers,
    loans: initialLoans,
    investments: initialInvestments,
    approvals: initialApprovals,
    activities: initialActivities,
    notifications: [],
    agms: [],
    adminLogs: [],
    feedback: [],
    dailyReturns: []
  });

  // Helper functions for loan guarantor system
  const searchMemberByName = (name: string) => {
    return state.members.filter(member => 
      member.name.toLowerCase().includes(name.toLowerCase()) && 
      member.status === 'active'
    );
  };

  const canMemberBeGuarantor = (memberId: number) => {
    const member = state.members.find(m => m.id === memberId);
    return member && member.loanBalance === 0 && member.status === 'active';
  };

  const requestGuarantor = (loanId: number, guarantorId: number) => {
    const loan = state.loans.find(l => l.id === loanId);
    const guarantor = state.members.find(m => m.id === guarantorId);
    
    if (loan && guarantor) {
      // Create notification for guarantor
      const notification: Notification = {
        id: Date.now(),
        memberId: guarantorId,
        title: 'Guarantor Request',
        message: `${loan.memberName} has requested you to be their guarantor for a loan of ₦${loan.amount.toLocaleString()}. Please review and respond.`,
        type: 'guarantor',
        date: new Date().toISOString(),
        read: false,
        actionRequired: true,
        relatedId: loanId
      };

      setState(prev => ({
        ...prev,
        notifications: [...prev.notifications, notification]
      }));
    }
  };

  const respondToGuarantorRequest = (notificationId: number, response: 'accepted' | 'rejected') => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === notificationId);
      if (!notification || !notification.relatedId) return prev;

      const updatedLoans = prev.loans.map(loan => {
        if (loan.id === notification.relatedId) {
          const updatedGuarantors = loan.guarantors.map(g => 
            g.memberId === notification.memberId.toString() 
              ? { ...g, status: response }
              : g
          );
          return { ...loan, guarantors: updatedGuarantors };
        }
        return loan;
      });

      const updatedNotifications = prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true, actionRequired: false } : n
      );

      return {
        ...prev,
        loans: updatedLoans,
        notifications: updatedNotifications
      };
    });
  };

  // Daily returns calculation
  const calculateDailyReturns = (date: string = new Date().toISOString().split('T')[0]) => {
    const activities = state.activities.filter(a => a.time.includes(date));
    let totalAmount = 0;
    let loanReturns = 0;
    let investmentReturns = 0;
    let savings = 0;

    activities.forEach(activity => {
      if (activity.amount) {
        const amount = parseFloat(activity.amount.replace(/[₦,]/g, ''));
        if (activity.type === 'payment' && activity.description.includes('loan')) {
          loanReturns += amount;
        } else if (activity.type === 'investment') {
          investmentReturns += amount;
        } else if (activity.type === 'savings') {
          savings += amount;
        }
      }
    });

    totalAmount = loanReturns + investmentReturns + savings;

    return { date, totalAmount, loanReturns, investmentReturns, savings };
  };

  // Enhanced activity logging
  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Date.now()
    };
    setState(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities]
    }));
  };

  const addAdminLog = (adminId: string, adminName: string, action: string, details: string, targetMember?: string, amount?: number) => {
    const log: AdminLog = {
      id: Date.now(),
      adminId,
      adminName,
      action,
      details,
      timestamp: new Date().toISOString(),
      targetMember,
      amount
    };

    setState(prev => ({
      ...prev,
      adminLogs: [log, ...prev.adminLogs]
    }));
  };

  // Enhanced savings management
  const addSavings = (memberId: number, amounts: { loan?: number; investment?: number; savings?: number }, adminId: string, adminName: string) => {
    setState(prev => {
      const updatedMembers = prev.members.map(member => {
        if (member.id === memberId) {
          const updatedMember = { ...member };
          
          if (amounts.loan && member.loanBalance >= amounts.loan) {
            updatedMember.loanBalance -= amounts.loan;
          }
          if (amounts.investment && member.investmentBalance >= amounts.investment) {
            updatedMember.investmentBalance -= amounts.investment;
          }
          if (amounts.savings) {
            updatedMember.balance += amounts.savings;
          }
          
          return updatedMember;
        }
        return member;
      });

      return { ...prev, members: updatedMembers };
    });

    // Log the activity
    const totalAmount = (amounts.loan || 0) + (amounts.investment || 0) + (amounts.savings || 0);
    addActivity({
      type: 'savings',
      description: `Payment allocated by ${adminName}`,
      amount: `₦${totalAmount.toLocaleString()}`,
      time: 'Just now',
      adminId,
      adminName,
      memberId
    });

    addAdminLog(adminId, adminName, 'Payment Allocation', `Allocated payment for member ${memberId}`, undefined, totalAmount);
  };

  // Add missing functions needed by components
  const updateMemberBalance = (memberId: number, amount: number) => {
    setState(prev => ({
      ...prev,
      members: prev.members.map(member => 
        member.id === memberId 
          ? { ...member, balance: member.balance + amount }
          : member
      )
    }));
  };

  const approveApplication = (approvalId: number) => {
    setState(prev => ({
      ...prev,
      approvals: prev.approvals.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: 'approved' as const }
          : approval
      )
    }));

    // Add activity log
    const approval = state.approvals.find(a => a.id === approvalId);
    if (approval) {
      addActivity({
        type: 'approval',
        description: `${approval.type} application approved for ${approval.applicantName}`,
        amount: approval.amount ? `₦${approval.amount.toLocaleString()}` : undefined,
        time: 'Just now',
        adminId: 'ADMIN001',
        adminName: 'Admin User'
      });
    }
  };

  const rejectApplication = (approvalId: number) => {
    setState(prev => ({
      ...prev,
      approvals: prev.approvals.map(approval => 
        approval.id === approvalId 
          ? { ...approval, status: 'rejected' as const }
          : approval
      )
    }));

    // Add activity log
    const approval = state.approvals.find(a => a.id === approvalId);
    if (approval) {
      addActivity({
        type: 'approval',
        description: `${approval.type} application rejected for ${approval.applicantName}`,
        amount: approval.amount ? `₦${approval.amount.toLocaleString()}` : undefined,
        time: 'Just now',
        adminId: 'ADMIN001',
        adminName: 'Admin User'
      });
    }
  };

  // Investment management
  const createInvestment = (investment: Omit<Investment, 'id' | 'createdDate' | 'applications'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now(),
      createdDate: new Date().toISOString(),
      applications: []
    };

    setState(prev => ({
      ...prev,
      investments: [...prev.investments, newInvestment]
    }));

    return newInvestment;
  };

  const applyForInvestment = (investmentId: number, memberId: number, quantity: number) => {
    setState(prev => {
      const investment = prev.investments.find(i => i.id === investmentId);
      const member = prev.members.find(m => m.id === memberId);
      
      if (!investment || !member) return prev;

      const totalAmount = investment.unitPrice * quantity;
      const application = {
        memberId,
        memberName: member.name,
        quantity,
        totalAmount,
        applicationDate: new Date().toISOString(),
        status: 'pending' as const,
        repaymentHistory: [],
        remainingAmount: totalAmount,
        weeksRemaining: investment.totalWeeks
      };

      const updatedInvestments = prev.investments.map(inv => 
        inv.id === investmentId 
          ? { ...inv, applications: [...inv.applications, application] }
          : inv
      );

      return { ...prev, investments: updatedInvestments };
    });
  };

  // Auto-fine system
  const applyWeeklyFines = () => {
    setState(prev => {
      const updatedMembers = prev.members.map(member => {
        if (member.loanBalance > 0) {
          const loan = prev.loans.find(l => l.memberId === member.membershipId && l.status === 'approved');
          if (loan && new Date(loan.nextPaymentDate) < new Date()) {
            const fine = member.loanBalance * 0.02; // 2% fine
            return { ...member, fines: member.fines + fine };
          }
        }
        return member;
      });

      return { ...prev, members: updatedMembers };
    });
  };

  // Check for dormant members
  const checkDormantMembers = () => {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    setState(prev => ({
      ...prev,
      members: prev.members.map(member => {
        const lastActivity = new Date(member.lastActivityDate || member.joinDate);
        if (lastActivity < threeWeeksAgo && member.status === 'active') {
          return { ...member, status: 'dormant' as const };
        }
        return member;
      })
    }));
  };

  // Stats calculation
  const stats = {
    totalMembers: state.members.length,
    totalSavings: state.members.reduce((sum, member) => sum + member.balance, 0),
    totalLoans: state.loans.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0),
    activeLoans: state.loans.filter(loan => loan.status === 'approved' && loan.weeksRemaining > 0).length,
    activeLoanAmount: state.loans
      .filter(loan => loan.status === 'approved' && loan.weeksRemaining > 0)
      .reduce((sum, loan) => sum + loan.amount, 0),
    totalInvestments: state.investments.reduce((sum, inv) => 
      sum + inv.applications
        .filter(app => app.status === 'approved')
        .reduce((appSum, app) => appSum + app.totalAmount, 0), 0),
    pendingApprovals: state.approvals.filter(approval => approval.status === 'pending').length,
    totalFines: state.members.reduce((sum, member) => sum + member.fines, 0),
    dailyReturns: calculateDailyReturns(),
    dormantMembers: state.members.filter(member => member.status === 'dormant').length
  };

  return {
    ...state,
    stats,
    searchMemberByName,
    canMemberBeGuarantor,
    requestGuarantor,
    respondToGuarantorRequest,
    calculateDailyReturns,
    addActivity,
    addAdminLog,
    addSavings,
    updateMemberBalance,
    approveApplication,
    rejectApplication,
    createInvestment,
    applyForInvestment,
    applyWeeklyFines,
    checkDormantMembers
  };
};
