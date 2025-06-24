
import { useState } from 'react';

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
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const StarRating = ({ rating, size = 'md', showTooltip = true }: StarRatingProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const containerClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getStarColor = (index: number) => {
    if (index < rating.stars) {
      if (rating.stars >= 4) return 'text-green-500';
      if (rating.stars >= 3) return 'text-yellow-500';
      if (rating.stars >= 2) return 'text-orange-500';
      return 'text-red-500';
    }
    return 'text-gray-300';
  };

  const getRatingText = () => {
    if (rating.stars >= 4.5) return 'Excellent';
    if (rating.stars >= 3.5) return 'Very Good';
    if (rating.stars >= 2.5) return 'Good';
    if (rating.stars >= 1.5) return 'Fair';
    return 'Poor';
  };

  const getPerformancePercentage = () => {
    const totalPayments = rating.onTimePayments + rating.earlyPayments + rating.latePayments;
    if (totalPayments === 0) return 0;
    return Math.round(((rating.onTimePayments + rating.earlyPayments) / totalPayments) * 100);
  };

  return (
    <div className="relative inline-block">
      <div 
        className={`flex items-center gap-1 cursor-pointer ${containerClasses[size]}`}
        onMouseEnter={() => showTooltip && setShowDetails(true)}
        onMouseLeave={() => showTooltip && setShowDetails(false)}
      >
        {/* Stars */}
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`${sizeClasses[size]} ${getStarColor(star)} fill-current`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        
        {/* Rating number and text */}
        <span className="font-medium text-gray-700">
          {rating.stars}.0
        </span>
        <span className="text-gray-500">
          ({getRatingText()})
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && showDetails && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="text-sm">
            <div className="font-semibold text-gray-900 mb-2 flex items-center justify-between">
              <span>Repayment History</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${getStarColor(star)} fill-current`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {rating.totalLoans === 0 ? (
              <p className="text-gray-600">New member - No loan history yet</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Performance:</span>
                  <span className="font-medium text-green-600">{getPerformancePercentage()}% on-time</span>
                </div>
                
                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Total Loans:</span>
                    <span className="font-medium">{rating.totalLoans}</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-600">
                    <span>On-time Payments:</span>
                    <span className="font-medium">{rating.onTimePayments}</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>Early Payments:</span>
                    <span className="font-medium">{rating.earlyPayments}</span>
                  </div>
                  <div className="flex justify-between text-xs text-orange-600">
                    <span>Late Payments:</span>
                    <span className="font-medium">{rating.latePayments}</span>
                  </div>
                  <div className="flex justify-between text-xs text-red-600">
                    <span>Missed Payments:</span>
                    <span className="font-medium">{rating.missedPayments}</span>
                  </div>
                  {rating.averageDaysLate > 0 && (
                    <div className="flex justify-between text-xs text-red-500">
                      <span>Avg Days Late:</span>
                      <span className="font-medium">{rating.averageDaysLate}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-2">
                  <div className="text-xs text-gray-500">
                    Rating based on payment consistency, punctuality, and overall loan behavior
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StarRating;
