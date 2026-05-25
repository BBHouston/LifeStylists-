import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, BookmarkCheck, Send, Inbox } from 'lucide-react';
import type { Scholarship } from '../types';
import { FIELD_OF_STUDY_OPTIONS } from '../types';
import { loadScholarships, deleteScholarship, getUrgency } from '../storage';
import ScholarshipCard from '../components/ScholarshipCard';

type StatusFilter = 'active' | 'submitted' | 'saved' | 'all';

export default function Dashboard() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [status, setStatus]   = useState<StatusFilter>('all');
  const [field, setField]     = useState('');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    setScholarships(loadScholarships());
  }, []);

  function handleDelete(id: string) {
    deleteScholarship(id);
    setScholarships(prev => prev.filter(s => s.id !== id));
  }

  const filtered = scholarships
    .filter(s => status === 'all' || s.status === status)
    .filter(s => !field || s.fieldOfStudy === field)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const counts = {
    active:    scholarships.filter(s => s.status === 'active').length,
    saved:     scholarships.filter(s => s.status === 'saved').length,
    submitted: scholarships.filter(s => s.status === 'submitted').length,
    critical:  scholarships.filter(s => s.status === 'active' && getUrgency(s.deadline) === 'critical').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Scholarships</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track every opportunity from search to submission</p>
          </div>
          <Link
            to="/add"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Scholarship
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active',     value: counts.active,    icon: <Inbox className="w-5 h-5 text-blue-500" />,   bg: 'bg-blue-50' },
            { label: 'Saved',      value: counts.saved,     icon: <BookmarkCheck className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
            { label: 'Submitted',  value: counts.submitted, icon: <Send className="w-5 h-5 text-green-500" />,   bg: 'bg-green-50' },
            { label: 'Urgent',     value: counts.critical,  icon: <span className="text-red-500 font-bold text-base">!</span>, bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search scholarships…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="saved">Saved for Later</option>
            <option value="submitted">Submitted</option>
          </select>
          <select
            value={field}
            onChange={e => setField(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Fields</option>
            {FIELD_OF_STUDY_OPTIONS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'active', 'saved', 'submitted'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                status === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500 mb-2">No scholarships yet</p>
            <p className="text-sm mb-6">Add your first scholarship or use the finder to discover opportunities.</p>
            <div className="flex justify-center gap-3">
              <Link to="/add" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                + Add Scholarship
              </Link>
              <Link to="/find" className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Find Opportunities
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(s => (
              <ScholarshipCard key={s.id} scholarship={s} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 21H3a12.083 12.083 0 012.84-10.422L12 14z" />
    </svg>
  );
}
