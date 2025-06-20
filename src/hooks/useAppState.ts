
import { useState, useEffect } from 'react';

export interface Member {
  id: number;
  name: string;
  membershipId: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  balance: number;
  loanBalance: number;
  sex: string;
  homeAddress: string;
  town: string;
  lga: string;
  stateOfOrigin: string;
  occupation: string;
  jobAddress: string;
  introducedBy: string;
  nextOfKin: {
    name: string;
    address: string;
    phone: string;
    altPhone: string;
  };
  guarantors: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export interface Loan {
  id: number;
  memberName: string;
  memberId: string;
  amount: number;
  purpose: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  guarantors: string[];
  weeklyPayment: number;
  weeksRemaining: number;
  fines: number;
}

export interface Approval {
  id: number;
  type: 'membership' | 'loan' | 'withdrawal';
  applicantName: string;
  amount?: number;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
  priority: 'high' | 'medium' | 'low';
  memberData?: Partial<Member>;
}

export interface Activity {
  id: number;
  type: 'loan' | 'member' | 'payment' | 'savings' | 'approval';
  description: string;
  amount?: string;
  time: string;
}

interface AppState {
  members: Member[];
  loans: Loan[];
  approvals: Approval[];
  activities: Activity[];
}

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
    sex: 'Male',
    homeAddress: '123 Main Street',
    town: 'Lagos',
    lga: 'Lagos Island',
    stateOfOrigin: 'Lagos',
    occupation: 'Engineer',
    jobAddress: '456 Business District',
    introducedBy: 'Alice Johnson',
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
    lastPaymentAmount: 6250
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
    sex: 'Female',
    homeAddress: '789 Oak Avenue',
    town: 'Abuja',
    lga: 'Wuse',
    stateOfOrigin: 'FCT',
    occupation: 'Teacher',
    jobAddress: '123 School Road',
    introducedBy: 'Carol Davis',
    nextOfKin: {
      name: 'Mark Johnson',
      address: '789 Oak Avenue',
      phone: '+234 800 222 3333',
      altPhone: '+234 800 444 5555'
    },
    guarantors: [
      { name: 'John Doe', address: '123 Main Street', phone: '+234 800 123 4567' },
      { name: 'Carol Davis', address: '654 Elm Street', phone: '+234 800 999 0000' }
    ]
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
    sex: 'Male',
    homeAddress: '321 Pine Street',
    town: 'Kano',
    lga: 'Nassarawa',
    stateOfOrigin: 'Kano',
    occupation: 'Trader',
    jobAddress: '987 Market Square',
    introducedBy: 'John Doe',
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
    lastPaymentAmount: 3125
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
    guarantors: ['Alice Johnson', 'Bob Williams'],
    weeklyPayment: 6250,
    weeksRemaining: 18,
    fines: 0
  },
  {
    id: 2,
    memberName: 'Bob Williams',
    memberId: 'MEM003',
    amount: 75000,
    purpose: 'Emergency medical',
    applicationDate: '2024-06-08',
    status: 'approved',
    guarantors: ['John Doe'],
    weeklyPayment: 3125,
    weeksRemaining: 12,
    fines: 1500
  }
];

const initialApprovals: Approval[] = [
  {
    id: 1,
    type: 'loan',
    applicantName: 'Carol Davis',
    amount: 200000,
    applicationDate: '2024-06-18',
    status: 'pending',
    details: 'Home improvement loan with 2 guarantors',
    priority: 'high'
  },
  {
    id: 2,
    type: 'membership',
    applicantName: 'Sarah Wilson',
    applicationDate: '2024-06-17',
    status: 'pending',
    details: 'New member registration - Teacher',
    priority: 'medium',
    memberData: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+234 800 456 7890',
      sex: 'Female',
      homeAddress: '456 Valley Road',
      town: 'Port Harcourt',
      lga: 'Port Harcourt City',
      stateOfOrigin: 'Rivers',
      occupation: 'Teacher',
      jobAddress: '789 Education Avenue',
      introducedBy: 'Alice Johnson',
      balance: 0,
      loanBalance: 0,
      status: 'active' as const
    }
  },
  {
    id: 3,
    type: 'withdrawal',
    applicantName: 'Alice Johnson',
    amount: 50000,
    applicationDate: '2024-06-16',
    status: 'pending',
    details: 'Emergency withdrawal request',
    priority: 'high'
  }
];

const initialActivities: Activity[] = [
  { id: 1, type: 'loan', description: 'New loan application from Carol Davis', amount: '₦200,000', time: '2 min ago' },
  { id: 2, type: 'member', description: 'New member registration: Sarah Wilson', amount: '', time: '15 min ago' },
  { id: 3, type: 'payment', description: 'Loan repayment from John Doe', amount: '₦6,250', time: '1 hour ago' },
  { id: 4, type: 'savings', description: 'Savings deposit from Alice Johnson', amount: '₦50,000', time: '2 hours ago' },
];

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    members: initialMembers,
    loans: initialLoans,
    approvals: initialApprovals,
    activities: initialActivities
  });

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

  const addMember = (memberData: Omit<Member, 'id' | 'membershipId' | 'joinDate' | 'balance' | 'loanBalance'>) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now(),
      membershipId: `MEM${String(state.members.length + 1).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      balance: 0,
      loanBalance: 0
    };
    
    setState(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
    
    addActivity({
      type: 'member',
      description: `New member registered: ${newMember.name}`,
      time: 'Just now'
    });
    
    return newMember;
  };

  const approveApplication = (approvalId: number) => {
    setState(prev => {
      const approval = prev.approvals.find(a => a.id === approvalId);
      if (!approval) return prev;

      let updatedMembers = prev.members;
      let updatedLoans = prev.loans;

      if (approval.type === 'membership' && approval.memberData) {
        const newMember = addMember(approval.memberData as any);
        updatedMembers = [...prev.members, newMember];
      } else if (approval.type === 'loan' && approval.amount) {
        const member = prev.members.find(m => m.name === approval.applicantName);
        if (member) {
          updatedMembers = prev.members.map(m => 
            m.id === member.id 
              ? { ...m, loanBalance: m.loanBalance + approval.amount! }
              : m
          );
          
          const newLoan: Loan = {
            id: Date.now(),
            memberName: approval.applicantName,
            memberId: member.membershipId,
            amount: approval.amount,
            purpose: approval.details,
            applicationDate: approval.applicationDate,
            status: 'approved',
            guarantors: [],
            weeklyPayment: Math.ceil(approval.amount / 24),
            weeksRemaining: 24,
            fines: 0
          };
          updatedLoans = [...prev.loans, newLoan];
        }
      }

      addActivity({
        type: 'approval',
        description: `${approval.type} application approved for ${approval.applicantName}`,
        amount: approval.amount ? `₦${approval.amount.toLocaleString()}` : '',
        time: 'Just now'
      });

      return {
        ...prev,
        members: updatedMembers,
        loans: updatedLoans,
        approvals: prev.approvals.map(a => 
          a.id === approvalId ? { ...a, status: 'approved' as const } : a
        )
      };
    });
  };

  const rejectApplication = (approvalId: number) => {
    setState(prev => {
      const approval = prev.approvals.find(a => a.id === approvalId);
      if (!approval) return prev;

      addActivity({
        type: 'approval',
        description: `${approval.type} application rejected for ${approval.applicantName}`,
        time: 'Just now'
      });

      return {
        ...prev,
        approvals: prev.approvals.map(a => 
          a.id === approvalId ? { ...a, status: 'rejected' as const } : a
        )
      };
    });
  };

  const updateMemberBalance = (memberId: number, amount: number) => {
    setState(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.id === memberId 
          ? { ...m, balance: m.balance + amount }
          : m
      )
    }));
  };

  const stats = {
    totalMembers: state.members.length,
    totalSavings: state.members.reduce((sum, member) => sum + member.balance, 0),
    activeLoans: state.loans.filter(loan => loan.status === 'approved' && loan.weeksRemaining > 0).length,
    activeLoanAmount: state.loans
      .filter(loan => loan.status === 'approved' && loan.weeksRemaining > 0)
      .reduce((sum, loan) => sum + loan.amount, 0),
    pendingApprovals: state.approvals.filter(approval => approval.status === 'pending').length
  };

  return {
    ...state,
    stats,
    addMember,
    addActivity,
    approveApplication,
    rejectApplication,
    updateMemberBalance
  };
};
