// src/components/ai-course-generation/StatusBadge.tsx
import React from 'react';
import { SessionStatus } from '../../interfaces/aiCourseGeneration';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: SessionStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    collecting_info: {
      label: 'Collecting Information',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: Clock,
    },
    collecting_requirements: {
      label: 'Collecting Requirements',
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: Clock,
    },
    outline_generated: {
      label: 'Outline Generated',
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      icon: Sparkles,
    },
    generating_course: {
      label: 'Generating Course',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: Loader2,
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: XCircle,
    },
    failed: {
      label: 'Failed',
      color: 'bg-red-100 text-red-700 border-red-300',
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  const isSpinning = status === 'generating_course';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-sm font-medium ${config.color} ${className}`}
    >
      <Icon
        className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`}
      />
      <span>{config.label}</span>
    </div>
  );
};

