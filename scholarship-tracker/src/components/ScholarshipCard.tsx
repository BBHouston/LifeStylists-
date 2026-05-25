import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Clock, Trash2, ExternalLink } from 'lucide-react';
import type { Scholarship } from '../types';
import { getUrgency } from '../storage';
import UrgencyBadge from './UrgencyBadge';
import ProgressBar from './ProgressBar';

interface Props {
  scholarship: Scholarship;
  onDelete: (id: string) => void;
}

const URGENCY_BORDER: Record<string, string> = {
  critical: 'urgency-critical',
  high:     'urgency-high',
  medium:   'urgency-medium',
  low:      'urgency-low',
};

export default function ScholarshipCard({ scholarship: s, onDelete }: Props) {
  const urgency = getUrgency(s.deadline);

  return (
    <div className={`rounded-xl p-5 shadow-sm card-hover ${URGENCY_BORDER[urgency]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base">{s.name}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            {s.amount && (
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="w-3.5 h-3.5" /> {s.amount}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-3.5 h-3.5" /> ~{s.timeCommitmentHours}h
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(s.id)}
          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3">
        <UrgencyBadge urgency={urgency} deadline={s.deadline} />
      </div>

      <div className="mt-3">
        <ProgressBar currentStep={s.currentStep} completedSteps={s.completedSteps} compact />
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/scholarship/${s.id}`}
          className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg text-center hover:bg-blue-700 transition-colors"
        >
          Track Progress
        </Link>
        {s.website && (
          <a
            href={s.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
