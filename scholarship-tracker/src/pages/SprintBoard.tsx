import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Scholarship, ProgressStep } from '../types';
import { PROGRESS_STEPS } from '../types';
import { loadScholarships, updateScholarship } from '../storage';
import SprintTimer from '../components/SprintTimer';
import UrgencyBadge from '../components/UrgencyBadge';
import { getUrgency } from '../storage';

const SPRINT_TASKS: Record<ProgressStep, string> = {
  found:    'Review the scholarship page & note all requirements',
  research: 'Research the organization\'s mission & values',
  outline:  'Bullet-point your essay outline — 3 key points max',
  draft:    'Write your messy first draft without stopping',
  edit:     'Polish: trim, sharpen, fix grammar',
  review:   'Send to one reviewer — copy the link now',
  submit:   'Final checklist: all docs attached? Submit early!',
};

export default function SprintBoard() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const active = loadScholarships().filter((s: Scholarship) => s.status === 'active');
    active.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    setScholarships(active);
  }, []);

  function handleSprintComplete(scholarship: Scholarship) {
    const idx = PROGRESS_STEPS.findIndex(s => s.id === scholarship.currentStep);
    const nextStep = PROGRESS_STEPS[idx + 1]?.id ?? scholarship.currentStep;
    const updated: Scholarship = {
      ...scholarship,
      completedSteps: [...new Set([...scholarship.completedSteps, scholarship.currentStep])],
      currentStep: nextStep,
    };
    updateScholarship(updated);
    setScholarships(prev => prev.map(s => s.id === updated.id ? updated : s));
    setActiveId(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" /> Sprint Board
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pick a scholarship, launch a 10-minute sprint, and advance one step.
            Small wins compound.
          </p>
        </div>

        {/* How it works */}
        <div className="gradient-hero rounded-2xl p-5 text-white mb-8">
          <h2 className="font-bold mb-2">The Sprint Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {[
              ['1. Pick', 'Choose one scholarship and one step to focus on.'],
              ['2. Sprint', 'Set a 10-minute timer and do ONLY that one thing.'],
              ['3. Advance', 'Mark it done and move to the next step. Repeat.'],
            ].map(([num, desc]) => (
              <div key={num} className="bg-white/15 rounded-xl p-3">
                <div className="font-bold mb-1">{num}</div>
                <div className="text-blue-100">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {scholarships.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-600 mb-2">No active scholarships</p>
            <p className="text-sm mb-5">Add a scholarship to start sprinting.</p>
            <Link to="/add" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + Add Scholarship
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scholarships.map(s => {
              const urgency = getUrgency(s.deadline);
              const currentStepObj = PROGRESS_STEPS.find(p => p.id === s.currentStep)!;
              const isActive = activeId === s.id;

              return (
                <div
                  key={s.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all ${
                    isActive ? 'border-blue-400 shadow-lg' : 'border-transparent'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{s.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(s.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <Clock className="w-3.5 h-3.5 text-gray-400 ml-1" />
                          <span className="text-xs text-gray-500">{s.timeCommitmentHours}h</span>
                        </div>
                      </div>
                      <UrgencyBadge urgency={urgency} deadline={s.deadline} />
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 mb-4">
                      <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                        Current Step
                      </div>
                      <div className="text-sm font-medium text-gray-800">{currentStepObj?.label}</div>
                      <div className="text-xs text-gray-500">{currentStepObj?.description}</div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1 mb-4">
                      {PROGRESS_STEPS.map(step => (
                        <div
                          key={step.id}
                          className={`h-1.5 flex-1 rounded-full ${
                            s.completedSteps.includes(step.id) ? 'bg-green-400' :
                            step.id === s.currentStep ? 'bg-blue-500' :
                            'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {isActive ? (
                      <div>
                        <SprintTimer
                          taskLabel={SPRINT_TASKS[s.currentStep]}
                          durationMinutes={10}
                          onComplete={() => handleSprintComplete(s)}
                        />
                        <button
                          onClick={() => setActiveId(null)}
                          className="mt-3 w-full text-sm text-gray-400 hover:text-gray-600"
                        >
                          Cancel sprint
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveId(s.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-colors"
                        >
                          <Zap className="w-4 h-4" /> Sprint Now
                        </button>
                        <Link
                          to={`/scholarship/${s.id}`}
                          className="flex items-center justify-center gap-1 bg-gray-100 text-gray-600 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Motivational prompt */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Today's Focus Prompt</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            "What is one task you've been avoiding that would take 10 minutes or less?
            Set a timer, start it right now, and complete that task before it ends."
          </p>
        </div>
      </div>
    </div>
  );
}
