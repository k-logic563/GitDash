interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  suffix?: string;
  description?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  suffix = '',
  description 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}{suffix}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="text-sm font-medium">
              {changeType === 'increase' ? '+' : ''}{change}%
            </span>
            <svg 
              className={`w-4 h-4 ml-1 ${
                changeType === 'increase' ? 'rotate-0' : 'rotate-180'
              }`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}