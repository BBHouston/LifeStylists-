import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AddScholarship from './pages/AddScholarship';
import ScholarshipDetail from './pages/ScholarshipDetail';
import OpportunityFinder from './pages/OpportunityFinder';
import SprintBoard from './pages/SprintBoard';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={<Layout><Dashboard /></Layout>}
        />
        <Route
          path="/add"
          element={<Layout><AddScholarship /></Layout>}
        />
        <Route
          path="/scholarship/:id"
          element={<Layout><ScholarshipDetail /></Layout>}
        />
        <Route
          path="/find"
          element={<Layout><OpportunityFinder /></Layout>}
        />
        <Route
          path="/sprints"
          element={<Layout><SprintBoard /></Layout>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
