import React, { useState, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import StudentPage from './components/StudentPage';
import CompaniesPage from './components/CompaniesPage';
import PostJobPage from './components/PostJobPage';
import ProfilePage from './components/ProfilePage';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('student');
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(''), []);

  const handleApply = useCallback((job) => {
    showToast(`Applied to ${job.title} at ${job.company}!`);
  }, [showToast]);

  const handlePostSubmit = useCallback(() => {
    showToast('Opportunity posted successfully!');
    setTimeout(() => setPage('student'), 1200);
  }, [showToast]);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setPage(userData.role === 'recruiter' ? 'post' : 'student');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setPage('student');
  }, []);

  if (!user) {
    return (
      <>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        <SpeedInsights />
      </>
    );
  }

  return (
    <>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />

      {page === 'student'   && <StudentPage onApply={handleApply} />}
      {page === 'companies' && <CompaniesPage setPage={setPage} />}
      {page === 'post'      && <PostJobPage onSubmit={handlePostSubmit} />}
      {page === 'profile'   && <ProfilePage setPage={setPage} user={user} />}

      <Toast message={toast} onClose={clearToast} />
      <SpeedInsights />
    </>
  );
}
