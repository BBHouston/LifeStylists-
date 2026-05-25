import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Props {
  taskLabel: string;
  durationMinutes?: number;
  onComplete?: () => void;
}

export default function SprintTimer({ taskLabel, durationMinutes = 10, onComplete }: Props) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            onComplete?.();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const pct    = remaining / totalSeconds;
  const offset = circumference * (1 - pct);
  const mins   = Math.floor(remaining / 60);
  const secs   = remaining % 60;

  function reset() {
    setRunning(false);
    setRemaining(totalSeconds);
    setDone(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={done ? '#22c55e' : '#2563eb'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {done
            ? <CheckCircle2 className="w-10 h-10 text-green-500" />
            : <span className="text-2xl font-bold text-gray-800 tabular-nums">
                {mins}:{secs.toString().padStart(2, '0')}
              </span>
          }
        </div>
      </div>

      <p className="text-sm font-medium text-gray-700 text-center px-2">{taskLabel}</p>

      {done ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-green-600 font-semibold text-sm">Sprint complete! Great work.</p>
          <button onClick={reset} className="text-sm text-gray-500 underline">Reset</button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRunning(r => !r)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> {remaining < totalSeconds ? 'Resume' : 'Start'}</>}
          </button>
          <button onClick={reset} className="text-gray-400 hover:text-gray-600 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
