import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, ChevronRight, ChevronDown, Plus, ArrowRight,
  Trash2, TrendingUp, Zap, Search,
  ExternalLink, CheckCircle2, Star
} from 'lucide-react';
import {
  NICHE_CATEGORIES,
  type NicheCategory,
  type PipelineEntry,
  loadPipeline,
  savePipeline,
  computeComposite,
} from '../data/nicheSources';

// ─── Sub-component: Category Card ────────────────────────────────────────────
function CategoryCard({
  cat,
  onAddToPipeline,
}: {
  cat: NicheCategory;
  onAddToPipeline: (cat: NicheCategory) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const competitionColor = {
    'very low': 'text-green-600 bg-green-50 border-green-200',
    'low':      'text-blue-600 bg-blue-50 border-blue-200',
    'medium':   'text-yellow-600 bg-yellow-50 border-yellow-200',
  }[cat.competition];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl flex-shrink-0 mt-0.5">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-snug">{cat.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5 italic">"{cat.tagline}"</p>
            </div>
          </div>
          <button
            onClick={() => onAddToPipeline(cat)}
            title="Add to pipeline"
            className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${competitionColor}`}>
            {cat.competition} competition
          </span>
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
            {cat.avgAmount}
          </span>
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
            ~{cat.effortHours}h effort
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-3 font-medium"
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          {expanded ? 'Hide research guide' : 'Show research guide'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Why it works</p>
            <p className="text-sm text-gray-700">{cat.why}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">How to find them</p>
            <ol className="space-y-1.5">
              {cat.howToFind.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              <Search className="w-3 h-3 inline mr-1" />
              Copy-paste search prompts
            </p>
            <div className="space-y-1.5">
              {cat.searchPrompts.map((p, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono select-all cursor-text"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Real examples</p>
            <ul className="space-y-1">
              {cat.examples.map((ex, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-component: Add to Pipeline Modal ────────────────────────────────────
function AddToPipelineModal({
  cat,
  onSave,
  onClose,
}: {
  cat: NicheCategory;
  onSave: (entry: PipelineEntry) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    sourceName: cat.title,
    estimatedAmount: cat.avgAmount,
    deadline: '',
    website: '',
    notes: '',
    fitScore: 7,
    effortScore: cat.effortHours <= 4 ? 3 : cat.effortHours <= 8 ? 5 : 7,
    urgencyScore: 5,
  });

  function handleSave() {
    const composite = computeComposite(form.fitScore, form.effortScore, form.urgencyScore);
    const entry: PipelineEntry = {
      id: crypto.randomUUID(),
      categoryId: cat.id,
      ...form,
      compositeScore: composite,
      stage: 'discover',
      addedAt: new Date().toISOString(),
    };
    onSave(entry);
  }

  const scoreLabel = (val: number, labels: [string, string, string]) =>
    val <= 3 ? labels[0] : val <= 6 ? labels[1] : labels[2];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-lg">Add to Pipeline</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Source name</label>
              <input
                value={form.sourceName}
                onChange={e => setForm(f => ({ ...f, sourceName: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Est. amount</label>
                <input
                  value={form.estimatedAmount}
                  onChange={e => setForm(f => ({ ...f, estimatedAmount: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Website / link</label>
              <input
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="https://…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Scoring sliders */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Rate this opportunity</p>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Fit for me</span>
                  <span className="font-bold text-blue-600">
                    {form.fitScore}/10 — {scoreLabel(form.fitScore, ['poor fit', 'decent fit', 'great fit'])}
                  </span>
                </div>
                <input type="range" min={1} max={10} value={form.fitScore}
                  onChange={e => setForm(f => ({ ...f, fitScore: +e.target.value }))}
                  className="w-full accent-blue-600" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Urgency</span>
                  <span className="font-bold text-blue-600">
                    {form.urgencyScore}/10 — {scoreLabel(form.urgencyScore, ['not urgent', 'moderate', 'very urgent'])}
                  </span>
                </div>
                <input type="range" min={1} max={10} value={form.urgencyScore}
                  onChange={e => setForm(f => ({ ...f, urgencyScore: +e.target.value }))}
                  className="w-full accent-blue-600" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Effort required</span>
                  <span className="font-bold text-blue-600">
                    {form.effortScore}/10 — {scoreLabel(form.effortScore, ['low effort', 'moderate', 'high effort'])}
                  </span>
                </div>
                <input type="range" min={1} max={10} value={form.effortScore}
                  onChange={e => setForm(f => ({ ...f, effortScore: +e.target.value }))}
                  className="w-full accent-blue-600" />
              </div>

              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {computeComposite(form.fitScore, form.effortScore, form.urgencyScore)}/10
                </div>
                <div className="text-xs text-gray-500">Composite Priority Score</div>
                <div className="text-xs text-gray-400 mt-0.5">Fit 40% · Urgency 40% · Ease 20%</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Where you found it, contact info, requirements…"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              Add to Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Pipeline Card ────────────────────────────────────────────
function PipelineCard({
  entry,
  onMove,
  onDelete,
}: {
  entry: PipelineEntry;
  onMove: (id: string, stage: PipelineEntry['stage']) => void;
  onDelete: (id: string) => void;
}) {
  const cat = NICHE_CATEGORIES.find(c => c.id === entry.categoryId);
  const scoreColor =
    entry.compositeScore >= 7 ? 'text-green-700 bg-green-100' :
    entry.compositeScore >= 5 ? 'text-yellow-700 bg-yellow-100' :
                                'text-gray-600 bg-gray-100';

  const stageFlow: PipelineEntry['stage'][] = ['discover', 'prioritize', 'apply'];
  const currentIdx = stageFlow.indexOf(entry.stage);
  const nextStage  = stageFlow[currentIdx + 1];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-lg flex-shrink-0">{cat?.icon ?? '📋'}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-snug">{entry.sourceName}</p>
            {entry.estimatedAmount && (
              <p className="text-xs text-green-700 font-medium">{entry.estimatedAmount}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
            ★ {entry.compositeScore}/10
          </span>
          <button onClick={() => onDelete(entry.id)} className="text-gray-300 hover:text-red-400 ml-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {entry.deadline && (
        <p className="text-xs text-gray-500 mb-2">
          Deadline: {new Date(entry.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      {entry.notes && (
        <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">{entry.notes}</p>
      )}

      <div className="flex gap-2">
        {entry.website && (
          <a href={entry.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {nextStage && (
          <button
            onClick={() => onMove(entry.id, nextStage)}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Move to {nextStage.charAt(0).toUpperCase() + nextStage.slice(1)} <ArrowRight className="w-3 h-3" />
          </button>
        )}
        {entry.stage === 'apply' && (
          <Link
            to="/add"
            className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 text-xs font-semibold py-1.5 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Zap className="w-3 h-3" /> Start Application
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FundingPipeline() {
  const [pipeline, setPipeline] = useState<PipelineEntry[]>([]);
  const [addModal, setAddModal] = useState<NicheCategory | null>(null);
  const [activeView, setActiveView] = useState<'discover' | 'pipeline' | 'ranker'>('discover');
  const [actionPromptDone, setActionPromptDone] = useState(false);

  useEffect(() => {
    setPipeline(loadPipeline());
  }, []);

  function handleAddEntry(entry: PipelineEntry) {
    const updated = [...pipeline, entry];
    setPipeline(updated);
    savePipeline(updated);
    setAddModal(null);
  }

  function handleMove(id: string, stage: PipelineEntry['stage']) {
    const updated = pipeline.map(e => e.id === id ? { ...e, stage } : e);
    setPipeline(updated);
    savePipeline(updated);
  }

  function handleDelete(id: string) {
    const updated = pipeline.filter(e => e.id !== id);
    setPipeline(updated);
    savePipeline(updated);
  }

  const stageColumns: { id: PipelineEntry['stage']; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'discover',   label: 'Discover',   icon: <Search className="w-4 h-4" />,   color: 'bg-purple-50 border-purple-200' },
    { id: 'prioritize', label: 'Prioritize', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-blue-50 border-blue-200' },
    { id: 'apply',      label: 'Apply',      icon: <Zap className="w-4 h-4" />,       color: 'bg-green-50 border-green-200' },
  ];

  const rankerEntries = [...pipeline].sort((a, b) => b.compositeScore - a.compositeScore);

  const dailyPrompts = [
    "What's one local foundation within 50 miles you've never researched?",
    "Does anyone in your family belong to a union or work for a company with an education grant?",
    "Have you asked your faith community if they fund students?",
    "What professional association covers your dream career—do they have a scholarship?",
    "Have you called your target school's alumni association and asked for local awards?",
    "What civic club (Rotary, Lions, Kiwanis) meets in your town? Have you applied?",
    "What's the smallest, most local scholarship you could apply for this week?",
  ];
  const todayPrompt = dailyPrompts[new Date().getDay()];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" /> Funding Pipeline
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Niche and underused funding sources most students never find—researched, ranked, and ready to apply.
          </p>
        </div>

        {/* Daily action prompt */}
        <div className={`rounded-2xl p-5 mb-6 border-2 transition-all ${
          actionPromptDone ? 'bg-green-50 border-green-200' : 'gradient-hero text-white border-transparent'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${actionPromptDone ? 'text-green-600' : 'text-blue-200'}`}>
                Today's Action Prompt
              </p>
              <p className={`font-semibold text-sm ${actionPromptDone ? 'text-green-800 line-through' : 'text-white'}`}>
                {todayPrompt}
              </p>
              {!actionPromptDone && (
                <p className="text-blue-100 text-xs mt-1">
                  One overlooked source. One action. Right now.
                </p>
              )}
            </div>
            {!actionPromptDone && (
              <button
                onClick={() => setActionPromptDone(true)}
                className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                Done ✓
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        {pipeline.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {stageColumns.map(col => {
              const count = pipeline.filter(e => e.stage === col.id).length;
              return (
                <div key={col.id} className={`rounded-xl border p-3 text-center ${col.color}`}>
                  <div className="text-xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    {col.icon} {col.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'discover' as const,  label: '🔍 Discover Sources' },
            { id: 'pipeline' as const,  label: '📋 My Pipeline' },
            { id: 'ranker'  as const,   label: '⭐ Priority Ranker' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── DISCOVER VIEW ──────────────────────────────────────────────────── */}
        {activeView === 'discover' && (
          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-blue-800">
              <strong>The hidden truth:</strong> The scholarships with the least competition are never on Fastweb.
              They live in your hometown, your industry, your family's employer, your faith community.
              Explore each category, grab the research prompts, and add anything promising to your pipeline.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NICHE_CATEGORIES.map(cat => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  onAddToPipeline={() => setAddModal(cat)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── PIPELINE VIEW ──────────────────────────────────────────────────── */}
        {activeView === 'pipeline' && (
          <div>
            {pipeline.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Target className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                <p className="font-semibold text-gray-600 mb-1">Your pipeline is empty</p>
                <p className="text-sm text-gray-400 mb-5">
                  Go to Discover, find a niche source that fits, and hit + to add it here.
                </p>
                <button
                  onClick={() => setActiveView('discover')}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Explore Sources
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stageColumns.map(col => {
                  const entries = pipeline.filter(e => e.stage === col.id)
                    .sort((a, b) => b.compositeScore - a.compositeScore);
                  return (
                    <div key={col.id}>
                      <div className={`rounded-xl border ${col.color} px-4 py-2.5 mb-3 flex items-center gap-2`}>
                        {col.icon}
                        <span className="font-bold text-sm text-gray-700">{col.label}</span>
                        <span className="ml-auto text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-full">
                          {entries.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {entries.map(entry => (
                          <PipelineCard
                            key={entry.id}
                            entry={entry}
                            onMove={handleMove}
                            onDelete={handleDelete}
                          />
                        ))}
                        {entries.length === 0 && (
                          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center text-xs text-gray-400">
                            {col.id === 'discover' ? 'Add sources from Discover →' :
                             col.id === 'prioritize' ? 'Move your best picks here' :
                             'Ready to apply? Move here'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── RANKER VIEW ────────────────────────────────────────────────────── */}
        {activeView === 'ranker' && (
          <div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" /> Priority Ranking Matrix
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Scored by Fit (40%) + Urgency (40%) + Ease (20%). Focus your energy at the top.
                  </p>
                </div>
              </div>

              {rankerEntries.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <p className="mb-3">No entries yet.</p>
                  <button onClick={() => setActiveView('discover')} className="text-blue-600 hover:underline text-sm">
                    Discover sources first →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {rankerEntries.map((entry, idx) => {
                    const cat = NICHE_CATEGORIES.find(c => c.id === entry.categoryId);
                    const scoreColor =
                      entry.compositeScore >= 7 ? 'bg-green-500' :
                      entry.compositeScore >= 5 ? 'bg-yellow-400' : 'bg-gray-300';
                    return (
                      <div key={entry.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-xl flex-shrink-0">{cat?.icon ?? '📋'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{entry.sourceName}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                            <span>{entry.estimatedAmount}</span>
                            {entry.deadline && (
                              <span>Due {new Date(entry.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            )}
                            <span className="capitalize">{entry.stage}</span>
                          </div>
                          <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                            <span>Fit {entry.fitScore}/10</span>
                            <span>Urgency {entry.urgencyScore}/10</span>
                            <span>Effort {entry.effortScore}/10</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full ${scoreColor} flex items-center justify-center text-white font-bold text-sm`}>
                            {entry.compositeScore}
                          </div>
                          <span className="text-xs text-gray-400">score</span>
                        </div>
                        {entry.stage !== 'apply' && (
                          <button
                            onClick={() => handleMove(entry.id, entry.stage === 'discover' ? 'prioritize' : 'apply')}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 flex-shrink-0"
                          >
                            Advance <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {rankerEntries.length > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-sm text-yellow-800">
                <strong>Next step:</strong> Take your top 3 entries and move them to <em>Apply</em>. Then go to{' '}
                <Link to="/add" className="underline font-semibold">Add Scholarship</Link> and formally track each one.
                One application at a time.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add modal */}
      {addModal && (
        <AddToPipelineModal
          cat={addModal}
          onSave={handleAddEntry}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  );
}
