import React from 'react';

interface TrialStatusProps {
  trialExpiresAt?: string;
  onUpgrade?: () => void;
}

const TrialStatus: React.FC<TrialStatusProps> = ({ trialExpiresAt, onUpgrade }) => {
  if (!trialExpiresAt) return null;

  const getTrialTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return { text: 'انتهت', isExpired: true, isUrgent: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return { 
        text: `${days} يوم`, 
        isExpired: false, 
        isUrgent: days <= 1 
      };
    }
    
    return { 
      text: `${hours} ساعة`, 
      isExpired: false, 
      isUrgent: hours <= 24 
    };
  };

  const timeRemaining = getTrialTimeRemaining(trialExpiresAt);

  return (
    <div className={`p-4 rounded-2xl border ${
      timeRemaining.isExpired 
        ? 'bg-red-50 border-red-200' 
        : timeRemaining.isUrgent 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            timeRemaining.isExpired 
              ? 'bg-red-100' 
              : timeRemaining.isUrgent 
              ? 'bg-yellow-100' 
              : 'bg-blue-100'
          }`}>
            <svg className={`w-5 h-5 ${
              timeRemaining.isExpired 
                ? 'text-red-600' 
                : timeRemaining.isUrgent 
                ? 'text-yellow-600' 
                : 'text-blue-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className={`font-medium ${
              timeRemaining.isExpired 
                ? 'text-red-800' 
                : timeRemaining.isUrgent 
                ? 'text-yellow-800' 
                : 'text-blue-800'
            }`}>
              {timeRemaining.isExpired 
                ? 'انتهت فترة التجربة' 
                : 'فترة التجربة تنتهي خلال'}
            </p>
            {!timeRemaining.isExpired && (
              <p className={`text-sm ${
                timeRemaining.isUrgent ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {timeRemaining.text}
              </p>
            )}
          </div>
        </div>
        
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRemaining.isExpired 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : timeRemaining.isUrgent 
                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {timeRemaining.isExpired ? 'تجديد الآن' : 'ترقية الباقة'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrialStatus;
