import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'My Scholarships' },
  { to: '/find',      label: 'Find Opportunities' },
  { to: '/sprints',   label: 'Sprint Board' },
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <GraduationCap className="w-7 h-7" />
          <span>ScholarTrack</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(n.to)
                  ? 'text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Scholarship
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          {NAV.map(n => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-2 ${
                pathname.startsWith(n.to) ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/add"
            onClick={() => setOpen(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
          >
            + Add Scholarship
          </Link>
        </div>
      )}
    </header>
  );
}
