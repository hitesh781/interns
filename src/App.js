import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentPage from './components/StudentPage';
import CompaniesPage from './components/CompaniesPage';
import PostJobPage from './components/PostJobPage';
import ProfilePage from './components/ProfilePage';
import RecruiterDashboard from './components/RecruiterDashboard';
import ResumeBuilder from './components/ResumeBuilder';
import MessagesPage from './components/MessagesPage';
import StudentSetupPage from './components/StudentSetupPage';
import JobDetailsPage from './components/JobDetailsPage';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const showToast = useCallback((msg) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(''), []);

  const handleApply = useCallback((job) => {
    if (!user) {
      navigate('/auth');
      showToast('Please login to apply.');
      return;
    }
    if (user.role === 'recruiter') {
      showToast('Recruiters cannot apply for jobs. Please log in as a student.');
      return;
    }
    showToast(`Applied to ${job.title} at ${job.company}!`);
  }, [showToast, user, navigate]);

  const handlePostSubmit = useCallback(() => {
    showToast('Opportunity posted successfully!');
    setTimeout(() => navigate('/jobs'), 1200);
  }, [showToast, navigate]);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    if (userData.role === 'recruiter') {
      navigate('/post-job');
    } else {
      if (!userData.hasResume) {
        navigate('/setup');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setUser(null);
    navigate('/');
  }, [navigate]);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/jobs" element={<StudentPage onApply={handleApply} user={user} />} />
        <Route path="/jobs/delhi" element={<StudentPage onApply={handleApply} user={user} presetLocation="delhi" />} />
        <Route path="/jobs/mumbai" element={<StudentPage onApply={handleApply} user={user} presetLocation="mumbai" />} />
        <Route path="/jobs/remote" element={<StudentPage onApply={handleApply} user={user} presetLocation="remote" />} />
        <Route path="/jobs/marketing" element={<StudentPage onApply={handleApply} user={user} presetCategory="marketing" />} />
        <Route path="/jobs/location/:locationParam" element={<StudentPage onApply={handleApply} user={user} />} />
        <Route path="/jobs/category/:categoryParam" element={<StudentPage onApply={handleApply} user={user} />} />
        <Route path="/jobs/:id" element={<JobDetailsPage onApply={handleApply} user={user} />} />
        <Route path="/setup" element={<StudentSetupPage user={user} onComplete={(u) => { setUser(u); navigate('/jobs'); }} />} />
        <Route path="/companies" element={<CompaniesPage />} />
        
        {/* Protected Routes */}
        <Route path="/post-job" element={user ? <PostJobPage onSubmit={handlePostSubmit} /> : <Navigate to="/auth" />} />
        <Route path="/dashboard" element={user ? <RecruiterDashboard user={user} /> : <Navigate to="/auth" />} />
        <Route path="/resume" element={user ? <ResumeBuilder user={user} /> : <Navigate to="/auth" />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/auth" />} />
        <Route path="/messages" element={user ? <MessagesPage user={user} /> : <Navigate to="/auth" />} />
      </Routes>

      <Toast message={toast} onClose={clearToast} />
    </>
  );
}
