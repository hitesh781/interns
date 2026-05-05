import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from './firebase';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import GlobalLoader from './components/GlobalLoader';

// Lazy loaded page components for code splitting
const AuthPage = lazy(() => import('./components/AuthPage'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const StudentPage = lazy(() => import('./components/StudentPage'));
const CompaniesPage = lazy(() => import('./components/CompaniesPage'));
const PostJobPage = lazy(() => import('./components/PostJobPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const RecruiterDashboard = lazy(() => import('./components/RecruiterDashboard'));
const ResumeBuilder = lazy(() => import('./components/ResumeBuilder'));
const MessagesPage = lazy(() => import('./components/MessagesPage'));
const StudentSetupPage = lazy(() => import('./components/StudentSetupPage'));
const RecruiterSetupPage = lazy(() => import('./components/RecruiterSetupPage'));
const JobDetailsPage = lazy(() => import('./components/JobDetailsPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

const auth = getAuth(app);
const db = getFirestore(app);

// Wrapper to enforce setup flows
function RequireSetup({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role === 'student' && !user.hasResume) {
    return <Navigate to="/setup" replace />;
  }

  if (user.role === 'recruiter' && !user.setupComplete) {
    return <Navigate to="/recruiter-setup" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role,
              name: userData.name,
              hasResume: userData.hasResume || false,
              setupComplete: userData.setupComplete || false,
              skills: userData.skills || [],
              college: userData.college || '',
              degree: userData.degree || '',
              organizationName: userData.organizationName || '',
              designation: userData.designation || '',
              industry: userData.industry || ''
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      if (!userData.setupComplete) {
        navigate('/recruiter-setup');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (!userData.hasResume) {
        navigate('/setup');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    auth.signOut();
    setUser(null);
    navigate('/');
  }, [navigate]);

  if (authLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
          
          <Route path="/setup" element={<StudentSetupPage user={user} onComplete={(u) => { setUser(u); navigate('/jobs'); }} />} />
          <Route path="/recruiter-setup" element={<RecruiterSetupPage user={user} onComplete={(u) => { setUser(u); navigate('/dashboard'); }} />} />
          
          <Route path="/companies" element={<CompaniesPage />} />
          
          {/* Protected Routes (Require Onboarding) */}
          <Route path="/jobs" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} /></RequireSetup>} />
          <Route path="/jobs/delhi" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} presetLocation="delhi" /></RequireSetup>} />
          <Route path="/jobs/mumbai" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} presetLocation="mumbai" /></RequireSetup>} />
          <Route path="/jobs/remote" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} presetLocation="remote" /></RequireSetup>} />
          <Route path="/jobs/marketing" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} presetCategory="marketing" /></RequireSetup>} />
          <Route path="/jobs/location/:locationParam" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} /></RequireSetup>} />
          <Route path="/jobs/category/:categoryParam" element={<RequireSetup user={user}><StudentPage onApply={handleApply} user={user} /></RequireSetup>} />
          <Route path="/jobs/:id" element={<RequireSetup user={user}><JobDetailsPage onApply={handleApply} user={user} /></RequireSetup>} />
          
          <Route path="/post-job" element={<RequireSetup user={user}><PostJobPage onSubmit={handlePostSubmit} /></RequireSetup>} />
          <Route path="/dashboard" element={<RequireSetup user={user}><RecruiterDashboard user={user} /></RequireSetup>} />
          <Route path="/resume" element={<RequireSetup user={user}><ResumeBuilder user={user} /></RequireSetup>} />
          <Route path="/profile" element={<RequireSetup user={user}><ProfilePage user={user} /></RequireSetup>} />
          <Route path="/messages" element={<RequireSetup user={user}><MessagesPage user={user} /></RequireSetup>} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Toast message={toast} onClose={clearToast} />
    </>
  );
}

