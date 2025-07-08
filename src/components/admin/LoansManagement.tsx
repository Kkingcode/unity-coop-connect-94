import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { loanService, LoanApplication, LoanSummary } from '@/services/loanService';
import { toast } from 'sonner';

interface PaymentModalProps {
  loan: LoanApplication;
  isOpen: boolean;
  onClose: () => void;
  onPaymentRecorded: () => void;
}

const PaymentModal = ({ loan, isOpen, onClose, onPaymentRecorded }: PaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'mobile_money'>('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const result = await loanService.recordLoanPayment({
        loanId: loan.id,
        amount: Number(amount),
        paymentType: 'partial',
        paymentMethod,
        notes
      });

      if (result) {
        toast.success('Payment recorded successfully');
        onPaymentRecorded();
        onClose();
        setAmount('');
        setNotes('');
      } else {
        toast.error('Failed to record payment');
      }
    } catch (error) {
      console.error('Payment recording error:', error);
      toast.error('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Loan Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Member: {loan.member_name}</p>
            <p className="text-sm text-muted-foreground">Loan Amount: {formatCurrency(loan.amount)}</p>
            <p className="text-sm text-muted-foreground">Monthly Payment: {formatCurrency(loan.monthly_payment)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Payment Amount (₦)</label>
            <Input
              type="number"
              placeholder="Enter payment amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <Textarea
              placeholder="Payment notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LoansManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadLoans();
    loadSummary();
  }, []);

  const loadLoans = async () => {
    try {
      const loanApplications = await loanService.getAllLoanApplications();
      setLoans(loanApplications);
    } catch (error) {
      console.error('Error loading loans:', error);
      toast.error('Failed to load loan applications');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const loanSummary = await loanService.getLoanSummary();
      setSummary(loanSummary);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-cyan-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredLoans = loans.filter(loan => 
    activeTab === 'all' || loan.status === activeTab
  );

  const handleApproveLoan = async (loanId: string) => {
    try {
      const success = await loanService.approveLoanApplication(loanId);
      if (success) {
        toast.success('Loan approved successfully');
        loadLoans();
        loadSummary();
      } else {
        toast.error('Failed to approve loan');
      }
    } catch (error) {
      console.error('Error approving loan:', error);
      toast.error('Failed to approve loan');
    }
  };

  const handleRejectLoan = async (loanId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to reject ${memberName}'s loan application?`)) {
      return;
    }

    try {
      const success = await loanService.rejectLoanApplication(loanId, 'Application rejected by admin');
      if (success) {
        toast.success('Loan application rejected');
        loadLoans();
      } else {
        toast.error('Failed to reject loan application');
      }
    } catch (error) {
      console.error('Error rejecting loan:', error);
      toast.error('Failed to reject loan application');
    }
  };

  const handleRecordPayment = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setShowPaymentModal(true);
  };

  const handlePaymentRecorded = () => {
    loadLoans();
    loadSummary();
  };

  return (
    <div className="animate-slide-in-right">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loans Management</h1>
          <p className="text-muted-foreground">Review and manage loan applications and repayments</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Disbursed</p>
                  <p className="font-semibold">{formatCurrency(summary.total_disbursed)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Repaid</p>
                  <p className="font-semibold">{formatCurrency(summary.total_repaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="font-semibold">{formatCurrency(summary.outstanding_balance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="font-semibold">{summary.active_loans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading loan applications...</p>
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No loan applications found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLoans.map((loan) => (
                <Card key={loan.id} className="glass-card hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{loan.member_name}</h3>
                          <Badge className={getStatusColor(loan.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(loan.status)}
                              {loan.status}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <p><span className="font-medium">Amount:</span> {formatCurrency(loan.amount)}</p>
                            <p><span className="font-medium">Purpose:</span> {loan.purpose}</p>
                            <p><span className="font-medium">Applied:</span> {new Date(loan.application_date).toLocaleDateString()}</p>
                            <p><span className="font-medium">Duration:</span> {loan.duration_months} months</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Monthly Payment:</span> {formatCurrency(loan.monthly_payment)}</p>
                            <p><span className="font-medium">Total Amount:</span> {formatCurrency(loan.total_amount)}</p>
                            <p><span className="font-medium">Interest Rate:</span> {loan.interest_rate}%</p>
                            {loan.approval_date && (
                              <p><span className="font-medium">Approved:</span> {new Date(loan.approval_date).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p><span className="font-medium">Guarantors:</span> {loan.guarantor1_name}{loan.guarantor2_name ? `, ${loan.guarantor2_name}` : ''}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => toast.info('Loan details view coming soon!')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {loan.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveLoan(loan.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-300" 
                            onClick={() => handleRejectLoan(loan.id, loan.member_name || 'Member')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {loan.status === 'approved' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-600 border-blue-300" 
                          onClick={() => handleRecordPayment(loan)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Record Payment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      {selectedLoan && (
        <PaymentModal
          loan={selectedLoan}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedLoan(null);
          }}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}
    </div>
  );
};

export default LoansManagement;