import React, { useState } from 'react';
import styles from './AuthPage.module.css';

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
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (form.email && form.password.length >= 6) {
      onSuccess({ email: form.email, role });
    } else {
      setError('Invalid credentials. Password must be at least 6 characters.');
    }
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
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        }
      />
      <Field
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={set}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        }
      />

      <div className={styles.forgotRow}>
        <a href="#forgot" className={styles.forgot} onClick={e => e.preventDefault()}>Forgot password?</a>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} disabled={loading}>
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <>
            Sign In
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </>
        )}
      </button>

      <div className={styles.divider}><span>or continue with</span></div>

      <div className={styles.socialRow}>
        <button type="button" className={styles.socialBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button type="button" className={styles.socialBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="#0A66C2"/></svg>
          LinkedIn
        </button>
      </div>

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button type="button" className={styles.switchLink} onClick={switchMode}>
          Sign up free →
        </button>
      </p>
    </form>
  );
}

// ── Signup Form ─────────────────────────────────────────
function SignupForm({ role, onSuccess, switchMode }) {
  const isRecruiter = role === 'recruiter';
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirm: '',
    college: '', degree: '', gradYear: '',
    company: '', jobTitle: '', companySize: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!agree) { setError('Please accept the Terms & Privacy Policy.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onSuccess({ email: form.email, role, name: form.fullName });
  };

  const emailIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
  const lockIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
  const userIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
  const phoneIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  return (
    <form className={styles.formInner} onSubmit={handleSubmit}>
      <div className={styles.row2}>
        <Field label="Full Name *" name="fullName" placeholder="Your full name" value={form.fullName} onChange={set} icon={userIcon} />
        <Field label="Phone Number" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={set} icon={phoneIcon} />
      </div>

      <Field label="Email Address *" type="email" name="email" placeholder={isRecruiter ? 'hr@company.com' : 'you@college.edu'} value={form.email} onChange={set} icon={emailIcon} />

      {/* Student-specific fields */}
      {!isRecruiter && (
        <div className={styles.row2}>
          <Field label="College / University *" name="college" placeholder="e.g. IIT Delhi" value={form.college} onChange={set}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
          />
          <div className={styles.field}>
            <label className={styles.label}>Graduation Year *</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <select className={`${styles.input} ${styles.inputWithIcon} ${styles.select}`} value={form.gradYear} onChange={e => set('gradYear', e.target.value)} required>
                <option value="">Select year</option>
                {[2025,2026,2027,2028,2029].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
      {!isRecruiter && (
        <div className={styles.field}>
          <label className={styles.label}>Degree / Programme</label>
          <div className={styles.inputWrap}>
            <select className={`${styles.input} ${styles.select}`} value={form.degree} onChange={e => set('degree', e.target.value)}>
              <option value="">Select degree</option>
              {['B.Tech / B.E.','M.Tech / M.E.','BCA','MCA','B.Sc','M.Sc','MBA','BBA','B.Com','B.Des','Other'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Recruiter-specific fields */}
      {isRecruiter && (
        <div className={styles.row2}>
          <Field label="Company Name *" name="company" placeholder="e.g. Acme Innovations" value={form.company} onChange={set}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
          />
          <Field label="Your Job Title *" name="jobTitle" placeholder="e.g. HR Manager" value={form.jobTitle} onChange={set}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          />
        </div>
      )}
      {isRecruiter && (
        <div className={styles.field}>
          <label className={styles.label}>Company Size</label>
          <div className={styles.inputWrap}>
            <select className={`${styles.input} ${styles.select}`} value={form.companySize} onChange={e => set('companySize', e.target.value)}>
              <option value="">Select size</option>
              {['1–10','11–50','51–200','201–500','501–1000','1000+'].map(s => <option key={s}>{s} employees</option>)}
            </select>
          </div>
        </div>
      )}

      <div className={styles.row2}>
        <Field label="Password *" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={set} icon={lockIcon} />
        <Field label="Confirm Password *" type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={set} icon={lockIcon} />
      </div>

      <label className={styles.agreeRow}>
        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className={styles.agreeCheck} />
        <span className={styles.agreeText}>
          I agree to the <a href="#terms" className={styles.link} onClick={e => e.preventDefault()}>Terms of Service</a> and <a href="#privacy" className={styles.link} onClick={e => e.preventDefault()}>Privacy Policy</a>
        </span>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} disabled={loading}>
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <>
            Create Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </>
        )}
      </button>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <button type="button" className={styles.switchLink} onClick={switchMode}>
          Sign in →
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
