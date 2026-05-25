import type { UrgencyLevel } from '../types';
import { getDaysUntil } from '../storage';

const CONFIG: Record<UrgencyLevel, { label: string; classes: string }> = {
  critical: { label: 'URGENT',  classes: 'bg-red-100 text-red-700 border border-red-200' },
  high:     { label: 'HIGH',    classes: 'bg-orange-100 text-orange-700 border border-orange-200' },
  medium:   { label: 'MEDIUM',  classes: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  low:      { label: 'ON TRACK',classes: 'bg-green-100 text-green-700 border border-green-200' },
};

interface Props {
  urgency: UrgencyLevel;
  deadline: string;
}

export default function UrgencyBadge({ urgency, deadline }: Props) {
  const { label, classes } = CONFIG[urgency];
  const days = getDaysUntil(deadline);
  const daysText = days < 0
    ? 'Past deadline'
    : days === 0
    ? 'Due today!'
    : days === 1
    ? '1 day left'
    : `${days} days left`;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${classes}`}>
        {label}
      </span>
      <span className="text-xs text-gray-500">{daysText}</span>
    </div>
  );
}
