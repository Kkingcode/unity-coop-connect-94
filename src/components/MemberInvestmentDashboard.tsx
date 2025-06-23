
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Package, TrendingUp, CheckCircle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

interface MemberInvestmentDashboardProps {
  user: any;
  onNavigate: (screen: string) => void;
}

const MemberInvestmentDashboard = ({ user, onNavigate }: MemberInvestmentDashboardProps) => {
  const { investments, members } = useAppState();
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const calculateDaysRemaining = (applicationDate: string, totalWeeks: number) => {
    const startDate = new Date(applicationDate);
    const endDate = new Date(startDate.getTime() + (totalWeeks * 7 * 24 * 60 * 60 * 1000));
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysRemaining);
  };

  const getMyApplications = () => {
    return investments.reduce((acc, investment) => {
      const myApplication = investment.applications.find(app => app.memberId === user.id);
      if (myApplication) {
        acc.push({
          ...investment,
          myApplication
        });
      }
      return acc;
    }, [] as any[]);
  };

  const getAvailableInvestments = () => {
    return investments.filter(inv => 
      inv.status === 'active' && 
      inv.availableUnits > 0 &&
      !inv.applications.some(app => app.memberId === user.id)
    );
  };

  const myApplications = getMyApplications();
  const availableInvestments = getAvailableInvestments();

  return (
    <div className="space-y-6">
      {/* My Active Investments */}
      {myApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Investments</h2>
          <div className="space-y-4">
            {myApplications.map((investment) => {
              const app = investment.myApplication;
              const daysRemaining = calculateDaysRemaining(app.applicationDate, investment.totalWeeks);
              const weeksElapsed = investment.totalWeeks - app.weeksRemaining;
              const progressPercentage = ((investment.totalWeeks - app.weeksRemaining) / investment.totalWeeks) * 100;
              const isOverdue = daysRemaining === 0 && app.remainingAmount > 0;
              const isCompleted = app.remainingAmount === 0;

              return (
                <Card key={investment.id} className={`glass-card ${isOverdue ? 'border-red-200 bg-red-50' : isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{investment.productName}</h3>
                        <p className="text-gray-600 text-sm mb-3">{investment.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium">{formatCurrency(app.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Remaining</p>
                            <p className="font-medium text-red-600">{formatCurrency(app.remainingAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Weekly Payment</p>
                            <p className="font-medium">{formatCurrency(app.totalAmount / investment.totalWeeks)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{app.quantity} units</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {isCompleted ? (
                          <Badge className="bg-green-100 text-green-800 mb-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : isOverdue ? (
                          <Badge className="bg-red-100 text-red-800 mb-2">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800 mb-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {daysRemaining} days left
                          </Badge>
                        )}
                      </div>
                    </div>

                    {!isCompleted && (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>

                        {isOverdue && (
                          <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-red-700">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-medium">Payment Overdue</span>
                            </div>
                            <p className="text-red-600 text-sm mt-1">
                              Your investment payment is overdue. Please contact the admin immediately.
                            </p>
                          </div>
                        )}

                        {daysRemaining <= 21 && daysRemaining > 0 && (
                          <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">Payment Due Soon</span>
                            </div>
                            <p className="text-yellow-600 text-sm mt-1">
                              You have {daysRemaining} days remaining to complete your investment.
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {isCompleted && (
                      <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Investment Completed</span>
                        </div>
                        <p className="text-green-600 text-sm mt-1">
                          Congratulations! You have successfully completed this investment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Investments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Investments</h2>
        {availableInvestments.length > 0 ? (
          <div className="grid gap-4">
            {availableInvestments.map((investment) => (
              <Card key={investment.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{investment.productName}</h3>
                      <p className="text-gray-600 text-sm mb-3">{investment.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Unit Price</p>
                          <p className="font-medium">{formatCurrency(investment.unitPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Available Units</p>
                          <p className="font-medium">{investment.availableUnits}/{investment.totalUnits}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium">{investment.totalWeeks} weeks</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Weekly Payment</p>
                          <p className="font-medium">{formatCurrency(investment.unitPrice / investment.totalWeeks)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        <Package className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                      <br />
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setSelectedInvestment(investment.id)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Investments</h3>
              <p className="text-gray-600">Check back later for new investment opportunities</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberInvestmentDashboard;
