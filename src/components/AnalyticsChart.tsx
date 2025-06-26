'use client';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line';
  color?: string;
}

export default function AnalyticsChart({ 
  title, 
  data, 
  type = 'bar', 
  color = 'blue' 
}: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {type === 'bar' && (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 font-medium">
                {item.label}
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-4 relative">
                  <div
                    className={`${colorMap[color]} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-12 text-sm text-gray-900 font-semibold text-right">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'line' && (
        <div className="relative h-48">
          <svg className="w-full h-full">
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (item.value / maxValue) * 80;
              
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    className={`fill-${color}-500`}
                  />
                  {index < data.length - 1 && (
                    <line
                      x1={`${x}%`}
                      y1={`${y}%`}
                      x2={`${((index + 1) / (data.length - 1)) * 100}%`}
                      y2={`${100 - (data[index + 1].value / maxValue) * 80}%`}
                      stroke={colorMap[color].replace('bg-', '')}
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <span key={index} className="text-xs text-gray-500">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}