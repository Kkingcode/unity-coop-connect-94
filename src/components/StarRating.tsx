
import { Star } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface StarRatingProps {
  rating: {
    stars: number;
    totalLoans: number;
    onTimePayments: number;
    earlyPayments: number;
    latePayments: number;
    missedPayments: number;
    averageDaysLate: number;
  };
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ rating, showTooltip = true, size = 'md' }: StarRatingProps) => {
  const { stars, totalLoans, onTimePayments, earlyPayments, latePayments, missedPayments, averageDaysLate } = rating;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 5: return 'Excellent';
      case 4: return 'Very Good';
      case 3: return 'Good';
      case 2: return 'Fair';
      case 1: return 'Poor';
      default: return 'Not Rated';
    }
  };

  const getTooltipContent = () => {
    if (totalLoans === 0) {
      return "New member - No loan history available";
    }

    const totalPayments = onTimePayments + earlyPayments + latePayments;
    const onTimePercentage = totalPayments > 0 ? Math.round(((onTimePayments + earlyPayments) / totalPayments) * 100) : 0;

    return (
      <div className="text-xs space-y-1">
        <div className="font-medium">{getRatingText(stars)} ({stars}/5 stars)</div>
        <div>Total Loans: {totalLoans}</div>
        <div>On-time Rate: {onTimePercentage}%</div>
        <div>Early Payments: {earlyPayments}</div>
        <div>Late Payments: {latePayments}</div>
        <div>Missed Payments: {missedPayments}</div>
        {averageDaysLate > 0 && (
          <div>Avg. Days Late: {averageDaysLate}</div>
        )}
      </div>
    );
  };

  const StarDisplay = () => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= stars
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">
        {stars}/5
      </span>
    </div>
  );

  if (!showTooltip) {
    return <StarDisplay />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <StarDisplay />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StarRating;
