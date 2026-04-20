import React, { useState, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentPage from './components/StudentPage';
import CompaniesPage from './components/CompaniesPage';
import CoursesPage from './components/CoursesPage';
import PostJobPage from './components/PostJobPage';
import ProfilePage from './components/ProfilePage';
import RecruiterDashboard from './components/RecruiterDashboard';
import ResumeBuilder from './components/ResumeBuilder';
import MessagesPage from './components/MessagesPage';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(''), []);

  const handleApply = useCallback((job) => {
    if (!user) {
      setPage('auth');
      showToast('Please login to apply.');
      return;
    }
    if (user.role === 'recruiter') {
      showToast('Recruiters cannot apply for jobs. Please log in as a student.');
      return;
    }
    showToast(`Applied to ${job.title} at ${job.company}!`);
  }, [showToast, user]);

  const handlePostSubmit = useCallback(() => {
    showToast('Opportunity posted successfully!');
    setTimeout(() => setPage('student'), 1200);
  }, [showToast]);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setPage(userData.role === 'recruiter' ? 'post' : 'home');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setPage('home');
  }, []);

  return (
    <>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />

      {page === 'home'      && <LandingPage setPage={setPage} />}
      {page === 'auth'      && <AuthPage onAuthSuccess={handleAuthSuccess} />}
      {page === 'student'   && <StudentPage onApply={handleApply} user={user} />}
      {page === 'companies' && <CompaniesPage setPage={setPage} />}
      {page === 'courses'   && <CoursesPage />}
      
      {/* Protected Routes */}
      {user && page === 'post'      && <PostJobPage onSubmit={handlePostSubmit} />}
      {user && page === 'dashboard' && <RecruiterDashboard user={user} />}
      {user && page === 'resume'    && <ResumeBuilder user={user} />}
      {user && page === 'profile'   && <ProfilePage setPage={setPage} user={user} />}
      {user && page === 'messages'  && <MessagesPage user={user} />}

      <Toast message={toast} onClose={clearToast} />
    </>
  );
}
