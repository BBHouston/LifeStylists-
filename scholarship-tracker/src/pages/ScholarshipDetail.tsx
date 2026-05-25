import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Circle, ExternalLink,
  Calendar, DollarSign, Clock, FileText, ChevronRight,
  ChevronDown, Send, Trash2
} from 'lucide-react';
import type { Scholarship, ProgressStep } from '../types';
import { PROGRESS_STEPS } from '../types';
import { loadScholarships, updateScholarship, deleteScholarship, getUrgency } from '../storage';
import ProgressBar from '../components/ProgressBar';
import UrgencyBadge from '../components/UrgencyBadge';
import SprintTimer from '../components/SprintTimer';

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [activeSprint, setActiveSprint] = useState<ProgressStep | null>(null);
  const [showEssays, setShowEssays] = useState(false);

  useEffect(() => {
    const s = loadScholarships().find(s => s.id === id);
    setScholarship(s || null);
  }, [id]);

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Scholarship not found.</p>
          <Link to="/dashboard" className="text-blue-600 underline">Go back</Link>
        </div>
      </div>
    );
  }

  function advanceStep(stepId: ProgressStep) {
    if (!scholarship) return;
    const idx = PROGRESS_STEPS.findIndex(s => s.id === stepId);
    const nextStep = PROGRESS_STEPS[idx + 1]?.id ?? stepId;
    const updated: Scholarship = {
      ...scholarship,
      completedSteps: [...new Set([...scholarship.completedSteps, stepId])],
      currentStep: nextStep,
      status: nextStep === 'submit' && scholarship.currentStep === 'submit'
        ? 'submitted'
        : scholarship.status,
      submittedAt: nextStep === 'submit' && scholarship.currentStep === 'submit'
        ? new Date().toISOString()
        : scholarship.submittedAt,
    };
    updateScholarship(updated);
    setScholarship(updated);
    setActiveSprint(null);
  }

  function markSubmitted() {
    if (!scholarship) return;
    const updated: Scholarship = {
      ...scholarship,
      completedSteps: PROGRESS_STEPS.map(s => s.id),
      currentStep: 'submit',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    updateScholarship(updated);
    setScholarship(updated);
  }

  function toggleEssay(i: number) {
    if (!scholarship) return;
    const updated = {
      ...scholarship,
      essayPrompts: scholarship.essayPrompts.map((e, idx) =>
        idx === i ? { ...e, done: !e.done } : e
      ),
    };
    updateScholarship(updated);
    setScholarship(updated);
  }

  function handleDelete() {
    if (!scholarship || !confirm('Delete this scholarship?')) return;
    deleteScholarship(scholarship.id);
    navigate('/dashboard');
  }

  const urgency = getUrgency(scholarship.deadline);
  const currentIdx = PROGRESS_STEPS.findIndex(s => s.id === scholarship.currentStep);
  const isSubmitted = scholarship.status === 'submitted';

  const SPRINT_TASKS: Record<ProgressStep, string> = {
    found:    'Review the scholarship requirements carefully',
    research: 'Research the organization & note key values',
    outline:  'Bullet-point your essay outline—no full sentences yet',
    draft:    'Write a messy first draft—don\'t stop, don\'t edit',
    edit:     'Polish your draft: clarity, grammar, word count',
    review:   'Send to one trusted reviewer for feedback',
    submit:   'Final check: all docs attached, submit early',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <button onClick={handleDelete} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{scholarship.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                {scholarship.amount && (
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="w-3.5 h-3.5" /> {scholarship.amount}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-3.5 h-3.5" /> ~{scholarship.timeCommitmentHours}h total
                </span>
                {scholarship.website && (
                  <a
                    href={scholarship.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Visit Site
                  </a>
                )}
              </div>
            </div>
            {isSubmitted && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
              </span>
            )}
          </div>

          <div className="mt-4">
            <UrgencyBadge urgency={urgency} deadline={scholarship.deadline} />
          </div>
        </div>

        {/* Progress tracker */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">Application Progress</h2>
          <ProgressBar currentStep={scholarship.currentStep} completedSteps={scholarship.completedSteps} />
        </div>

        {/* Action steps */}
        {!isSubmitted && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
            <h2 className="font-semibold text-gray-900 mb-4">Your Action Plan</h2>
            <div className="flex flex-col gap-3">
              {PROGRESS_STEPS.map((step, idx) => {
                const isDone    = scholarship.completedSteps.includes(step.id);
                const isActive  = step.id === scholarship.currentStep;
                const isLocked  = idx > currentIdx;

                return (
                  <div
                    key={step.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isDone   ? 'border-green-200 bg-green-50' :
                      isActive ? 'border-blue-200 bg-blue-50' :
                      isLocked ? 'border-gray-100 bg-gray-50 opacity-60' :
                                 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isDone   ? 'bg-green-500 text-white' :
                        isActive ? 'bg-blue-600 text-white' :
                                   'bg-gray-200 text-gray-400'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-500'}`}>
                            {step.label}
                          </span>
                          {isActive && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              Current Step
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>

                        {isActive && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => setActiveSprint(activeSprint === step.id ? null : step.id)}
                              className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              ⚡ Start 10-min Sprint
                            </button>
                            <button
                              onClick={() => advanceStep(step.id)}
                              className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {activeSprint === step.id && (
                      <div className="mt-4 pt-4 border-t border-blue-100">
                        <SprintTimer
                          taskLabel={SPRINT_TASKS[step.id]}
                          durationMinutes={10}
                          onComplete={() => advanceStep(step.id)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {scholarship.currentStep !== 'submit' || !scholarship.completedSteps.includes('submit') ? (
              scholarship.currentStep === 'submit' && (
                <button
                  onClick={markSubmitted}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4" /> Mark as Submitted!
                </button>
              )
            ) : null}
          </div>
        )}

        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-5 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="font-bold text-green-800 text-lg mb-1">Application Submitted!</h2>
            <p className="text-green-600 text-sm">
              Submitted on {scholarship.submittedAt
                ? new Date(scholarship.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'Unknown'}
            </p>
          </div>
        )}

        {/* Essays */}
        {scholarship.essayPrompts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowEssays(!showEssays)}
            >
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Essay Prompts ({scholarship.essayPrompts.filter(e => e.done).length}/{scholarship.essayPrompts.length} done)
              </h2>
              {showEssays ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>

            {showEssays && (
              <div className="mt-4 flex flex-col gap-3">
                {scholarship.essayPrompts.map((essay, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${essay.done ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleEssay(i)} className="mt-0.5 flex-shrink-0">
                        {essay.done
                          ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                          : <Circle className="w-5 h-5 text-gray-300" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${essay.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {essay.prompt || 'Essay prompt not filled in.'}
                        </p>
                        {essay.wordLimit && (
                          <span className="text-xs text-gray-400 mt-1 block">Word limit: {essay.wordLimit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {scholarship.notes && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{scholarship.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
