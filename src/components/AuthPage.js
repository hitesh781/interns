import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import app from "../firebase";


const auth = getAuth(app);
const db = getFirestore(app);


// ── Icons ──────────────────────────────────────────────
const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Role Selector ───────────────────────────────────────
function RoleSelector({ role, setRole }) {
  return (
    <div className={styles.roleWrap}>
      <button
        type="button"
        className={`${styles.roleBtn} ${role === 'student' ? styles.roleActive : ''}`}
        onClick={() => setRole('student')}
      >
        <span className={styles.roleIcon}>🎓</span>
        <span className={styles.roleLabel}>Student</span>
        <span className={styles.roleSub}>Find internships & jobs</span>
      </button>
      <button
        type="button"
        className={`${styles.roleBtn} ${role === 'recruiter' ? styles.roleActive : ''}`}
        onClick={() => setRole('recruiter')}
      >
        <span className={styles.roleIcon}>🏢</span>
        <span className={styles.roleLabel}>Recruiter</span>
        <span className={styles.roleSub}>Post & manage openings</span>
      </button>
    </div>
  );
}


// ── Input Field ─────────────────────────────────────────
function Field({ label, type = 'text', placeholder, icon, value, onChange, name }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input
          className={`${styles.input} ${icon ? styles.inputWithIcon : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          required
          autoComplete="off"
        />
        {isPassword && (
          <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)}>
            <EyeIcon open={show} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Login Form ──────────────────────────────────────────
function LoginForm({ role, onSuccess, switchMode }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ✅ validation
    if (!form.email || !form.password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(
  auth,
  form.email,
  form.password
);

// 🔥 FETCH USER DATA FROM FIRESTORE
const userDoc = await getDoc(doc(db, "users", res.user.uid));

if (!userDoc.exists()) {
  setError("User data not found.");
  setLoading(false);
  return;
}

const userData = userDoc.data();

// ❌ ROLE MISMATCH CHECK
if (userData.role !== role) {
  setError(`You are registered as ${userData.role}`);
  setLoading(false);
  return;
}

// ❌ BLOCK PERSONAL EMAIL FOR RECRUITER
if (userData.role === "recruiter") {
  const email = res.user.email.toLowerCase();

  if (
    email.includes("@gmail.com") ||
    email.includes("@yahoo.com") ||
    email.includes("@outlook.com") ||
    email.includes("@hotmail.com")
  ) {
    setError("Recruiters must use company email.");
    setLoading(false);
    return;
  }
}

// ✅ SUCCESS LOGIN
onSuccess({
  email: res.user.email,
  role: userData.role
      });

    } catch (err) {
      console.log(err.code);

      // ✅ proper error messages
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Login failed. Try again.");
      }

      setLoading(false);
      return; // 🚨 STOP execution
    }

    setLoading(false);
  };

  return (
    <form className={styles.formInner} onSubmit={handleSubmit}>
      <Field
        label="Email Address"
        type="email"
        name="email"
        placeholder={role === 'student' ? 'student@college.edu' : 'hr@company.com'}
        value={form.email}
        onChange={set}
      />

      <Field
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={set}
      />

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="submit"
        className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign In"}
      </button>

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button type="button" onClick={switchMode}>
          Sign up
        </button>
      </p>
    </form>
  );
}

// ── Signup Form ─────────────────────────────────────────
function SignupForm({ role, onSuccess, switchMode }) {

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    college: '',
    degree: '',
    gradYear: '',
    company: '',
    jobTitle: '',
    companySize: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ validation
    if (!form.fullName || !form.email || !form.password) {
      setError("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agree) {
      setError('Please accept Terms & Conditions.');
      return;
    }

    setLoading(true);
    // 🚨 Restrict recruiter email
if (role === "recruiter") {
  const email = form.email.toLowerCase();

  if (
    email.includes("@gmail.com") ||
    email.includes("@yahoo.com") ||
    email.includes("@outlook.com") ||
    email.includes("@hotmail.com")
  ) {
    setError("Please use your company email (no personal email allowed).");
    return;
  }
}

    try {
      // 🔐 Firebase Signup
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 💾 Save user in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        email: form.email,
        role,
        name: form.fullName,
        college: form.college || "",
        company: form.company || "",
        phone: form.phone || "",
        createdAt: new Date()
      });

      // ✅ Success
      onSuccess({
        email: form.email,
        role,
        name: form.fullName
      });

    } catch (err) {
      console.log(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Please login.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Signup failed. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <form className={styles.formInner} onSubmit={handleSubmit}>
      
      <input
        type="text"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) => set('fullName', e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => set('password', e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={form.confirm}
        onChange={(e) => set('confirm', e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        Accept Terms & Conditions
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p>
        Already have an account?{" "}
        <button type="button" onClick={switchMode}>
          Login
        </button>
      </p>

    </form>
  );

}

// ── Success Screen ──────────────────────────────────────
function SuccessScreen({ user, onContinue }) {
  return (
    <div className={styles.successWrap}>
      <div className={styles.successOrb} />
      <div className={styles.successIcon}>✓</div>
      <h2 className={styles.successTitle}>Welcome aboard!</h2>
      <p className={styles.successSub}>
        {user.role === 'student'
          ? `You're all set, ${user.name || 'student'}! Start exploring internships and jobs.`
          : `Welcome, ${user.name || 'recruiter'}! Post your first opportunity and reach thousands of students.`
        }
      </p>
      <div className={styles.successBadge}>{user.email}</div>
      <button className={styles.continueBtn} onClick={onContinue}>
        {user.role === 'student' ? 'Browse Opportunities' : 'Post a Job'} →
      </button>
    </div>
  );
}

// ── Main Auth Page ──────────────────────────────────────
export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');   // 'login' | 'signup'
  const [role, setRole] = useState('student'); // 'student' | 'recruiter'
  const [user, setUser] = useState(null);

  const handleSuccess = (userData) => setUser(userData);

  if (user) {
    return (
      <div className={styles.page}>
        <div className={styles.bg}><div className={styles.bgOrb1}/><div className={styles.bgOrb2}/><div className={styles.bgGrid}/></div>
        <SuccessScreen user={user} onContinue={() => onAuthSuccess && onAuthSuccess(user)} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Animated Background */}
      <div className={styles.bg}>
        <div className={styles.bgOrb1}/>
        <div className={styles.bgOrb2}/>
        <div className={styles.bgOrb3}/>
        <div className={styles.bgGrid}/>
      </div>

      {/* Split Layout */}
      <div className={styles.split}>
        {/* LEFT PANEL */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.brandRow}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="4" y1="22" x2="4" y2="15" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className={styles.brand}>Interns<span className={styles.brandAccent}>Bridge</span></span>
            </div>

            <h1 className={styles.leftTitle}>
              {mode === 'login' ? (
                <>Your <span className={styles.neon}>career</span><br/>awaits.</>
              ) : (
                <>Join the <span className={styles.neon}>future</span><br/>of hiring.</>
              )}
            </h1>

            <p className={styles.leftSub}>
              {role === 'student'
                ? 'Discover internships & jobs at 1,200+ top companies across India.'
                : 'Post opportunities and connect with 50,000+ talented students instantly.'}
            </p>

            <div className={styles.leftStats}>
              {role === 'student' ? (
                <>
                  <div className={styles.lStat}><span className={styles.lNum}>8,400+</span><span className={styles.lLabel}>Active Jobs</span></div>
                  <div className={styles.lStat}><span className={styles.lNum}>1,200+</span><span className={styles.lLabel}>Companies</span></div>
                  <div className={styles.lStat}><span className={styles.lNum}>50k+</span><span className={styles.lLabel}>Placed</span></div>
                </>
              ) : (
                <>
                  <div className={styles.lStat}><span className={styles.lNum}>50k+</span><span className={styles.lLabel}>Students</span></div>
                  <div className={styles.lStat}><span className={styles.lNum}>48h</span><span className={styles.lLabel}>Avg. Response</span></div>
                  <div className={styles.lStat}><span className={styles.lNum}>96%</span><span className={styles.lLabel}>Satisfaction</span></div>
                </>
              )}
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testAvatar}>{role === 'student' ? 'P' : 'R'}</div>
              <div>
                <p className={styles.testQuote}>
                  {role === 'student'
                    ? '"Got my dream internship at Google within 2 weeks!"'
                    : '"Hired 12 interns in a month — incredibly efficient."'}
                </p>
                <p className={styles.testName}>
                  {role === 'student' ? 'Priya S., IIT Bombay' : 'Rahul M., HR Lead @ Flipkart'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.rightPanel}>
          <div className={styles.formCard}>
            {/* Header */}
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className={styles.formSub}>
                {mode === 'login' ? 'Welcome back! Please sign in.' : 'Fill in the details below to get started.'}
              </p>
            </div>

            {/* Role Selector */}
            <RoleSelector role={role} setRole={setRole} />

            {/* Mode Toggle */}
            <div className={styles.modeToggle}>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'login' ? styles.modeActive : ''}`}
                onClick={() => setMode('login')}
              >Sign In</button>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'signup' ? styles.modeActive : ''}`}
                onClick={() => setMode('signup')}
              >Sign Up</button>
            </div>

            {/* Form */}
            {mode === 'login'
              ? <LoginForm role={role} onSuccess={handleSuccess} switchMode={() => setMode('signup')} />
              : <SignupForm role={role} onSuccess={handleSuccess} switchMode={() => setMode('login')} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

