import { Link } from 'react-router-dom';
import {
  GraduationCap, Search, Bell, TrendingUp,
  ArrowRight, Zap, Target, BookOpen
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Search className="w-6 h-6 text-blue-500" />,
    title: 'Smart Search Wizard',
    desc: 'Answer 3 quick questions and get matched to scholarships that fit your exact profile.',
  },
  {
    icon: <Bell className="w-6 h-6 text-purple-500" />,
    title: 'Deadline Auto-Flagging',
    desc: 'Color-coded urgency alerts keep you on top of every deadline before it sneaks up.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
    title: '7-Step Progress Tracker',
    desc: 'From "Found" to "Submitted"—your personalized action plan with milestone checkpoints.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: '10-Minute Sprint Board',
    desc: 'Bite-sized focus sprints turn overwhelming applications into small, winnable tasks.',
  },
  {
    icon: <Target className="w-6 h-6 text-red-500" />,
    title: 'Essay Blueprint',
    desc: 'Break every essay prompt into outline → draft → edit stages with guided prompts.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
    title: 'Save for Later',
    desc: 'Bookmark opportunities and return when you\'re ready—nothing falls through the cracks.',
  },
];

const STEPS = [
  { num: '01', title: 'Find It',   desc: 'Use the wizard to find scholarships matching your field, level, and timeline.' },
  { num: '02', title: 'Track It',  desc: 'Add deadlines, essays, and time commitments to your personal blueprint.' },
  { num: '03', title: 'Sprint It', desc: 'Work in 10-minute focused sprints—outline, draft, edit, done.' },
  { num: '04', title: 'Submit It', desc: 'Check the final requirements, then submit early and move to the next.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="gradient-hero text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Free Scholarship Tracker
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              Stop Losing Track.<br />Start Winning Funding.
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              ScholarTrack turns the chaos of scholarship applications into a clear, step-by-step
              action plan—with urgency alerts, essay blueprints, and 10-minute focus sprints built in.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/find"
                className="border-2 border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl hover:border-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" /> Find Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap justify-around gap-4 text-center">
          {[
            ['$46B+', 'in scholarships awarded annually'],
            ['7 Steps', 'from search to submit'],
            ['10 min', 'focused sprint sessions'],
            ['100%', 'free to use'],
          ].map(([stat, label]) => (
            <div key={stat}>
              <div className="text-2xl font-bold text-yellow-300">{stat}</div>
              <div className="text-sm text-blue-200">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Everything you need to apply with confidence
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          No more scattered notes, missed deadlines, or half-finished essays. ScholarTrack keeps your entire application pipeline organized.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-14 h-14 gradient-hero rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="gradient-hero rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your funding is out there. Let's go find it.
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Start with one scholarship. Add it, track it, sprint through it.
            Then add another. That's the whole system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/add"
              className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Add Your First Scholarship
            </Link>
            <Link
              to="/find"
              className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-gray-600">ScholarTrack</span>
        </div>
        <p>Built for students who mean business.</p>
      </footer>
    </div>
  );
}
