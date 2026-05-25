import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, Plus, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { FIELD_OF_STUDY_OPTIONS, EDUCATION_LEVELS } from '../types';
import { addScholarship } from '../storage';
import type { Scholarship } from '../types';

interface Opportunity {
  name: string;
  amount: string;
  deadline: string;
  description: string;
  website: string;
  timeHours: number;
  fields: string[];
  levels: string[];
}

const OPPORTUNITY_DB: Opportunity[] = [
  {
    name: 'Gates Scholarship',
    amount: 'Up to full cost of attendance',
    deadline: '2026-09-15',
    description: 'For outstanding minority students with significant financial need.',
    website: 'https://www.thegatesscholarship.org',
    timeHours: 20,
    fields: ['Any / Undecided'],
    levels: ['Undergraduate (Freshman)'],
  },
  {
    name: 'Coca-Cola Scholars Program',
    amount: '$20,000',
    deadline: '2026-10-31',
    description: 'Recognizes exceptional high school seniors for leadership, service, and character.',
    website: 'https://www.coca-colascholarsfoundation.org',
    timeHours: 15,
    fields: ['Any / Undecided'],
    levels: ['Undergraduate (Freshman)'],
  },
  {
    name: 'Regeneron Science Talent Search',
    amount: 'Up to $250,000',
    deadline: '2026-11-12',
    description: 'Nation\'s most prestigious pre-college science competition.',
    website: 'https://www.regeneron.com/science-talent-search',
    timeHours: 40,
    fields: ['Natural Sciences', 'Engineering', 'Computer Science & Tech'],
    levels: ['High School'],
  },
  {
    name: 'UNCF STEM Scholars Program',
    amount: '$5,000/year',
    deadline: '2026-12-01',
    description: 'For African American students pursuing STEM degrees.',
    website: 'https://uncf.org',
    timeHours: 10,
    fields: ['Computer Science & Tech', 'Engineering', 'Natural Sciences'],
    levels: ['Undergraduate (Freshman)', 'Undergraduate (Sophomore)'],
  },
  {
    name: 'Google Generation Scholarship',
    amount: '$10,000',
    deadline: '2026-12-15',
    description: 'Supporting students historically underrepresented in tech.',
    website: 'https://buildyourfuture.withgoogle.com/scholarships',
    timeHours: 8,
    fields: ['Computer Science & Tech'],
    levels: ['Undergraduate (Junior)', 'Undergraduate (Senior)', 'Graduate (Master\'s)'],
  },
  {
    name: 'AMA Foundation Scholarship',
    amount: '$10,000',
    deadline: '2027-01-31',
    description: 'For medical students demonstrating leadership and community service.',
    website: 'https://www.ama-assn.org',
    timeHours: 12,
    fields: ['Health & Medicine'],
    levels: ['Graduate (Master\'s)', 'Graduate (PhD)'],
  },
  {
    name: 'Jack Kent Cooke Foundation Scholarship',
    amount: 'Up to $55,000/year',
    deadline: '2026-11-05',
    description: 'For high-achieving students with significant financial need.',
    website: 'https://www.jkcf.org',
    timeHours: 25,
    fields: ['Any / Undecided'],
    levels: ['Undergraduate (Freshman)', 'Undergraduate (Sophomore)', 'Undergraduate (Junior)'],
  },
  {
    name: 'Ron Brown Scholar Program',
    amount: '$40,000 total',
    deadline: '2026-11-01',
    description: 'For African American students with academic excellence and leadership.',
    website: 'https://www.ronbrown.org',
    timeHours: 15,
    fields: ['Any / Undecided'],
    levels: ['Undergraduate (Freshman)'],
  },
  {
    name: 'National Merit Scholarship',
    amount: '$2,500',
    deadline: '2026-10-17',
    description: 'Based on PSAT/NMSQT performance—take the qualifying test.',
    website: 'https://www.nationalmerit.org',
    timeHours: 5,
    fields: ['Any / Undecided'],
    levels: ['High School'],
  },
  {
    name: 'ABA Law Student Division Scholarship',
    amount: '$5,000',
    deadline: '2027-01-15',
    description: 'For first-year law students demonstrating academic excellence.',
    website: 'https://www.americanbar.org',
    timeHours: 10,
    fields: ['Law & Political Science'],
    levels: ['Graduate (Master\'s)'],
  },
  {
    name: 'AICPA Scholarship for Minority Accounting Students',
    amount: '$5,000',
    deadline: '2027-03-01',
    description: 'Supporting minority students pursuing accounting careers.',
    website: 'https://www.aicpa.org',
    timeHours: 8,
    fields: ['Business & Finance'],
    levels: ['Undergraduate (Junior)', 'Undergraduate (Senior)', 'Graduate (Master\'s)'],
  },
  {
    name: 'P. Buckley Moss Foundation Scholarship',
    amount: '$1,000–$2,500',
    deadline: '2027-03-15',
    description: 'For students with language-based learning disabilities interested in arts.',
    website: 'https://mossfoundation.org',
    timeHours: 6,
    fields: ['Fine Arts & Design', 'Education'],
    levels: ['Undergraduate (Freshman)', 'Undergraduate (Sophomore)'],
  },
];

type Step = 'field' | 'level' | 'deadline' | 'results';

export default function OpportunityFinder() {
  const navigate = useNavigate();
  const [step, setStep]       = useState<Step>('field');
  const [field, setField]     = useState('');
  const [level, setLevel]     = useState('');
  const [urgency, setUrgency] = useState('');
  const [added, setAdded]     = useState<Set<string>>(new Set());

  const STEPS: Step[] = ['field', 'level', 'deadline', 'results'];
  const stepIdx = STEPS.indexOf(step);

  function getResults() {
    let results = OPPORTUNITY_DB;
    if (field && field !== 'Any / Undecided') {
      results = results.filter(o => o.fields.includes(field) || o.fields.includes('Any / Undecided'));
    }
    if (level) {
      results = results.filter(o => o.levels.includes(level));
    }
    if (urgency === 'soon') {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() + 3);
      results = results.filter(o => new Date(o.deadline) <= cutoff);
    }
    return results;
  }

  function handleAddToTracker(opp: Opportunity) {
    const s: Scholarship = {
      id: crypto.randomUUID(),
      name: opp.name,
      amount: opp.amount,
      deadline: opp.deadline,
      fieldOfStudy: field || opp.fields[0],
      educationLevel: level,
      timeCommitmentHours: opp.timeHours,
      essayPrompts: [{ prompt: '', wordLimit: undefined, done: false }],
      website: opp.website,
      notes: opp.description,
      currentStep: 'found',
      completedSteps: [],
      savedAt: new Date().toISOString(),
      status: 'active',
    };
    addScholarship(s);
    setAdded(prev => new Set([...prev, opp.name]));
  }

  const results = step === 'results' ? getResults() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" /> Find Opportunities
          </h1>
          <p className="text-gray-500 text-sm mt-1">Answer 3 quick questions to get matched scholarships.</p>
        </div>

        {/* Step indicator */}
        {step !== 'results' && (
          <div className="flex items-center gap-2 mb-8">
            {(['field', 'level', 'deadline'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  STEPS.indexOf(s) < stepIdx ? 'bg-green-500 text-white' :
                  s === step ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {STEPS.indexOf(s) < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && <div className={`h-0.5 w-10 ${STEPS.indexOf(s) < stepIdx ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step: Field of Study */}
        {step === 'field' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">What are you studying?</h2>
            <p className="text-gray-500 text-sm mb-6">We'll match scholarships to your field of study.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {FIELD_OF_STUDY_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setField(f)}
                  className={`text-sm py-2.5 px-3 rounded-xl border font-medium transition-colors text-left ${
                    field === f
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              disabled={!field}
              onClick={() => setStep('level')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Education Level */}
        {step === 'level' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">What's your education level?</h2>
            <p className="text-gray-500 text-sm mb-6">Scholarships are often specific to your year or program.</p>
            <div className="flex flex-col gap-2 mb-6">
              {EDUCATION_LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`text-sm py-3 px-4 rounded-xl border font-medium transition-colors text-left ${
                    level === l
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('field')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!level}
                onClick={() => setStep('deadline')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Deadline urgency */}
        {step === 'deadline' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">When do you need funding?</h2>
            <p className="text-gray-500 text-sm mb-6">We'll prioritize scholarships based on your timeline.</p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { value: 'soon',    label: 'As soon as possible (within 3 months)', emoji: '🔥' },
                { value: 'medium',  label: 'Within 6 months', emoji: '📅' },
                { value: 'anytime', label: 'No rush—show me everything', emoji: '🌈' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setUrgency(opt.value)}
                  className={`text-sm py-4 px-5 rounded-xl border font-medium transition-colors text-left flex items-center gap-3 ${
                    urgency === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('level')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!urgency}
                onClick={() => setStep('results')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                Find Opportunities <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {results.length} Opportunities Found
              </h2>
              <button
                onClick={() => { setStep('field'); setField(''); setLevel(''); setUrgency(''); setAdded(new Set()); }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> New Search
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700">
              <strong>Your profile:</strong> {field} · {level} · {urgency === 'soon' ? 'ASAP' : urgency === 'medium' ? 'Within 6 months' : 'No rush'}
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
                <p className="mb-3">No exact matches found for your criteria.</p>
                <p className="text-sm">Try broadening your field or education level.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((opp, i) => (
                  <div key={opp.name} className="bg-white rounded-2xl shadow-sm p-5 card-hover">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            #{i + 1} Pick
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{opp.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{opp.description}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="text-sm font-semibold text-green-700">{opp.amount}</span>
                          <span className="text-sm text-gray-500">
                            Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-sm text-gray-500">~{opp.timeHours}h commitment</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {added.has(opp.name) ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium px-4 py-2 bg-green-50 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" /> Added to Tracker
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddToTracker(opp)}
                          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Add to Tracker
                        </button>
                      )}
                      <a
                        href={opp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Learn More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-400">
              Added something? <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">Go to Dashboard →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
