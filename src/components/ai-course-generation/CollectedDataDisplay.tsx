// src/components/ai-course-generation/CollectedDataDisplay.tsx
import React from 'react';
import { CollectedData } from '../../interfaces/aiCourseGeneration';
import { CheckCircle2, Info } from 'lucide-react';

interface CollectedDataDisplayProps {
  data: CollectedData;
  className?: string;
}

export const CollectedDataDisplay: React.FC<CollectedDataDisplayProps> = ({
  data,
  className = '',
}) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-blue-900">Collected Information</h4>
      </div>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-blue-900 capitalize">
                {key.replace(/_/g, ' ')}:
              </span>{' '}
              <span className="text-blue-700">{formatValue(value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



