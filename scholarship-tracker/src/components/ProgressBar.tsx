import { CheckCircle2 } from 'lucide-react';
import { PROGRESS_STEPS, type ProgressStep } from '../types';

interface Props {
  currentStep: ProgressStep;
  completedSteps: ProgressStep[];
  compact?: boolean;
}

export default function ProgressBar({ currentStep, completedSteps, compact = false }: Props) {
  const currentIdx = PROGRESS_STEPS.findIndex(s => s.id === currentStep);

  if (compact) {
    const pct = Math.round(((completedSteps.length) / PROGRESS_STEPS.length) * 100);
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{PROGRESS_STEPS[Math.min(currentIdx, PROGRESS_STEPS.length - 1)]?.label}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max gap-0">
        {PROGRESS_STEPS.map((step, idx) => {
          const isDone    = completedSteps.includes(step.id);
          const isActive  = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isDone   ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                             'bg-gray-200 text-gray-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isDone ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < PROGRESS_STEPS.length - 1 && (
                <div className={`h-0.5 w-8 mx-1 mb-5 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
