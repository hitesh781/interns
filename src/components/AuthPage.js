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

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

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

    if (role === 'recruiter') {
      const email = form.email.toLowerCase();
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

      if (!otpStep) {
        // Generate and "send" OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        setOtpStep(true);
        setLoading(false);
        alert(`[Demo Mode] OTP sent to your email!\n\nYour OTP is: ${otp}\n\n(In production, integrate an email service here)`);
        return;
      }

      if (otpStep && otpCode !== generatedOtp) {
        setError("Invalid OTP. Please try again.");
        setLoading(false);
        return;
      }
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

      // ✅ SUCCESS LOGIN
      onSuccess({
        uid: res.user.uid,
        email: res.user.email,
        role: userData.role,
        name: userData.name,
        hasResume: userData.hasResume || false,
        skills: userData.skills || [],
        college: userData.college || '',
        degree: userData.degree || ''
      });

    } catch (err) {
      console.log(err.code);

      // ✅ proper error messages
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please sign up first.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Login failed. Try again.");
      }
      setOtpStep(false);
      setOtpCode('');
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  if (otpStep) {
    return (
      <form className={styles.formInner} onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Email Verification</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            We've sent a 6-digit OTP to <br/><strong style={{ color: '#fff' }}>{form.email}</strong>
          </p>
        </div>
        
        <Field
          label="Enter OTP"
          type="text"
          name="otp"
          placeholder="000000"
          value={otpCode}
          onChange={(name, val) => setOtpCode(val)}
        />
        
        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner}></span> : "Verify & Sign In"}
        </button>

        <button
          type="button"
          onClick={() => { setOtpStep(false); setOtpCode(''); setError(''); }}
          className={styles.switchLink}
          style={{ display: 'block', margin: '20px auto 0' }}
        >
          ← Back to Login
        </button>
      </form>
    );
  }

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
        {loading ? <span className={styles.spinner}></span> : "Sign In"}
      </button>

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button className={styles.switchLink} type="button" onClick={switchMode}>
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

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

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
        setLoading(false);
        return;
      }

      if (!otpStep) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        setOtpStep(true);
        setLoading(false);
        alert(`[Demo Mode] OTP sent to your email!\n\nYour OTP is: ${otp}\n\n(In production, integrate an email service here)`);
        return;
      }

      if (otpStep && otpCode !== generatedOtp) {
        setError("Invalid OTP. Please try again.");
        setLoading(false);
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
        createdAt: new Date(),
        hasResume: false
      });

      // ✅ Success
      onSuccess({
        uid: res.user.uid,
        email: form.email,
        role,
        name: form.fullName,
        hasResume: false
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
      setOtpStep(false);
      setOtpCode('');
    }

    setLoading(false);
  };

  if (otpStep) {
    return (
      <form className={styles.formInner} onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Email Verification</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            We've sent a 6-digit OTP to <br/><strong style={{ color: '#fff' }}>{form.email}</strong>
          </p>
        </div>
        
        <Field
          label="Enter OTP"
          type="text"
          name="otp"
          placeholder="000000"
          value={otpCode}
          onChange={(name, val) => setOtpCode(val)}
        />
        
        {error && <div className={styles.error}>{error}</div>}

        <button
          type="submit"
          className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner}></span> : "Verify & Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => { setOtpStep(false); setOtpCode(''); setError(''); }}
          className={styles.switchLink}
          style={{ display: 'block', margin: '20px auto 0' }}
        >
          ← Back to Signup
        </button>
      </form>
    );
  }

  return (
    <form className={styles.formInner} onSubmit={handleSubmit}>
      
      <Field
        label="Full Name"
        type="text"
        name="fullName"
        placeholder="John Doe"
        value={form.fullName}
        onChange={set}
      />

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
        placeholder="Create a password (min 6 chars)"
        value={form.password}
        onChange={set}
      />

      <Field
        label="Confirm Password"
        type="password"
        name="confirm"
        placeholder="Confirm your password"
        value={form.confirm}
        onChange={set}
      />

      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.agreeRow}>
        <input
          type="checkbox"
          className={styles.agreeCheck}
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <span className={styles.agreeText}>
          I agree to the <span className={styles.link}>Terms & Conditions</span>
        </span>
      </label>

      <button
        type="submit"
        className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
        disabled={loading}
      >
        {loading ? <span className={styles.spinner}></span> : "Create Account"}
      </button>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <button className={styles.switchLink} type="button" onClick={switchMode}>
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
      <div className={styles.successIcon}>✓</div>
      <h2 className={styles.successTitle}>Welcome aboard!</h2>
      <p className={styles.successSub}>
        {user.role === 'student'
          ? `You're all set, ${user.name || 'student'}! Start exploring internships and jobs.`
          : `Welcome, ${user.name || 'recruiter'}! Post your first opportunity and reach thousands of students.`
        }
      </p>
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
        <SuccessScreen user={user} onContinue={() => onAuthSuccess && onAuthSuccess(user)} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.formCard}>
        {/* Header */}
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            {role === 'student' ? 'Candidate sign up' : 'Employer sign up'}
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
  );
}

