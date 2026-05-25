import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Bookmark } from 'lucide-react';
import type { Scholarship, EssayPrompt } from '../types';
import { FIELD_OF_STUDY_OPTIONS, EDUCATION_LEVELS } from '../types';
import { addScholarship } from '../storage';

export default function AddScholarship() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    amount: '',
    deadline: '',
    fieldOfStudy: '',
    educationLevel: '',
    timeCommitmentHours: 3,
    website: '',
    notes: '',
  });
  const [essays, setEssays] = useState<EssayPrompt[]>([{ prompt: '', wordLimit: undefined, done: false }]);
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function addEssay() {
    setEssays(e => [...e, { prompt: '', wordLimit: undefined, done: false }]);
  }

  function removeEssay(i: number) {
    setEssays(e => e.filter((_, idx) => idx !== i));
  }

  function setEssay(i: number, key: keyof EssayPrompt, value: string | number | boolean) {
    setEssays(e => e.map((item, idx) => idx === i ? { ...item, [key]: value } : item));
  }

  function submit(status: 'active' | 'saved') {
    if (!form.name || !form.deadline) return;
    setSaving(true);
    const scholarship: Scholarship = {
      id: crypto.randomUUID(),
      ...form,
      essayPrompts: essays.filter(e => e.prompt.trim()),
      currentStep: 'found',
      completedSteps: [],
      savedAt: new Date().toISOString(),
      status,
    };
    addScholarship(scholarship);
    navigate(status === 'active' ? `/scholarship/${scholarship.id}` : '/dashboard');
  }

  const isValid = form.name.trim() && form.deadline;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Scholarship</h1>
          <p className="text-gray-500 text-sm">Fill in what you know—you can always update it later.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Scholarship Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scholarship Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Gates Scholarship, State STEM Award…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Award Amount</label>
              <input
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="e.g. $5,000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              <select
                value={form.fieldOfStudy}
                onChange={e => set('fieldOfStudy', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select field…</option>
                {FIELD_OF_STUDY_OPTIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select
                value={form.educationLevel}
                onChange={e => set('educationLevel', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level…</option>
                {EDUCATION_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Commitment (hours)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.timeCommitmentHours}
                onChange={e => set('timeCommitmentHours', parseInt(e.target.value) || 1)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website / Link</label>
              <input
                value={form.website}
                onChange={e => set('website', e.target.value)}
                placeholder="https://…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Eligibility requirements, tips, anything else…"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Essay prompts */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Essay Requirements</h2>
            <button onClick={addEssay} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Plus className="w-4 h-4" /> Add Essay
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {essays.map((essay, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Essay {i + 1}</span>
                  {essays.length > 1 && (
                    <button onClick={() => removeEssay(i)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <textarea
                  value={essay.prompt}
                  onChange={e => setEssay(i, 'prompt', e.target.value)}
                  placeholder="Paste the essay prompt here…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white mb-2"
                />
                <input
                  type="number"
                  placeholder="Word limit (optional)"
                  value={essay.wordLimit ?? ''}
                  onChange={e => setEssay(i, 'wordLimit', parseInt(e.target.value) || 0)}
                  className="w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            disabled={!isValid || saving}
            onClick={() => submit('active')}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" /> Start Tracking
          </button>
          <button
            disabled={!isValid || saving}
            onClick={() => submit('saved')}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 py-3 px-5 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-40 transition-colors"
          >
            <Bookmark className="w-4 h-4" /> Save for Later
          </button>
        </div>
      </div>
    </div>
  );
}
