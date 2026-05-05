import React, { useState } from 'react';
import styles from './PostJobPage.module.css';
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);
const auth = getAuth();

const PLANS = [
  { key: 'basic', label: 'Basic', price: 'Free', desc: '1 listing · 30 days · Standard placement' },
  { key: 'pro', label: 'Pro', price: '₹999', desc: '3 listings · Featured placement · Analytics' },
  { key: 'enterprise', label: 'Enterprise', price: '₹2,499', desc: 'Unlimited · Top placement · Dedicated support' },
];

const PERKS = ['Certificate', 'Letter of Recommendation', 'Flexible Hours', 'Pre-Placement Offer', 'Meals Provided', 'Stock Options'];

export default function PostJobPage({ onSubmit }) {
  const [plan, setPlan] = useState('pro');
  const [perks, setPerks] = useState(['Certificate', 'Flexible Hours']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastStatus, setToastStatus] = useState(null); // 'success', 'error', null

  const togglePerk = (p) => setPerks(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    setIsSubmitting(true);
    setToastStatus(null);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, "jobs"), {
        ...data,
        perks,
        plan,
        postedBy: user.uid,
        recruiterEmail: user.email,
        createdAt: new Date()
      });

      setToastStatus('success');
      setTimeout(() => setToastStatus(null), 3000);

      // Clear the form visually
      e.target.reset();
      
      if (onSubmit) {
        setTimeout(onSubmit, 1500); // Wait a bit before redirecting/closing
      }

    } catch (err) {
      console.error(err);
      setToastStatus('error');
      setTimeout(() => setToastStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      
      {/* Toast Notifications */}
      {toastStatus === 'success' && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          ✅ Opportunity posted successfully!
        </div>
      )}
      {toastStatus === 'error' && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          ❌ Failed to post opportunity. Please try again.
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.badge}>For Companies</div>
        <h1 className={styles.title}>Post an <span className={styles.glow}>Opportunity</span></h1>
        <p className={styles.sub}>Reach 50,000+ active students and fresh graduates across India</p>
      </div>

      <div className={styles.formWrap}>
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>01</span>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Job / Internship Title *</label>
                <input name="title" className={styles.input} type="text" placeholder="e.g. Frontend Developer Intern" required disabled={isSubmitting} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Company Name *</label>
                <input name="company" className={styles.input} type="text" placeholder="e.g. Acme Innovations" required disabled={isSubmitting} />
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Opportunity Type *</label>
                <select name="type" className={styles.select} disabled={isSubmitting}>
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Work Mode *</label>
                <select name="mode" className={styles.select} disabled={isSubmitting}>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* ORGANIZATION DETAILS */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02</span>
              <h2 className={styles.sectionTitle}>Organization Details</h2>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Company Website</label>
                <input name="companyWebsite" className={styles.input} type="url" placeholder="https://www.example.com" disabled={isSubmitting} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Industry</label>
                <input name="industry" className={styles.input} type="text" placeholder="e.g. EdTech, FinTech, E-commerce" disabled={isSubmitting} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>About the Company</label>
              <textarea name="aboutCompany" className={styles.textarea} style={{ minHeight: '80px' }} placeholder="Briefly describe what your organization does..." disabled={isSubmitting} />
            </div>
          </div>

          {/* LOCATION & DURATION */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03</span>
              <h2 className={styles.sectionTitle}>Location & Compensation</h2>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <input name="location" className={styles.input} type="text" placeholder="e.g. Bengaluru / Remote" disabled={isSubmitting} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Duration</label>
                <input name="duration" className={styles.input} type="text" placeholder="e.g. 3 months / Permanent" disabled={isSubmitting} />
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Stipend / Salary (₹/month)</label>
                <input name="salary" className={styles.input} type="text" placeholder="e.g. 15,000 – 25,000" disabled={isSubmitting} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Application Deadline</label>
                <input name="deadline" className={styles.input} type="date" disabled={isSubmitting} />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04</span>
              <h2 className={styles.sectionTitle}>Job Description</h2>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>About the Role *</label>
              <textarea name="description" className={styles.textarea} placeholder="Describe responsibilities, day-to-day work, what the candidate will learn..." required disabled={isSubmitting} />
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Required Skills</label>
                <input name="skills" className={styles.input} type="text" placeholder="React, Python, Figma (comma-separated)" disabled={isSubmitting} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Preferred Qualifications</label>
                <input name="qualifications" className={styles.input} type="text" placeholder="e.g. B.Tech CSE, MBA Finance..." disabled={isSubmitting} />
              </div>
            </div>
          </div>

          {/* PERKS */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05</span>
              <h2 className={styles.sectionTitle}>Perks & Benefits</h2>
            </div>
            <div className={styles.perksGrid}>
              {PERKS.map(p => (
                <label key={p} className={`${styles.perkCard} ${perks.includes(p) ? styles.perkActive : ''} ${isSubmitting ? styles.disabled : ''}`} onClick={() => !isSubmitting && togglePerk(p)}>
                  <input type="checkbox" checked={perks.includes(p)} onChange={() => {}} className={styles.hidden} disabled={isSubmitting} />
                  <span className={styles.perkCheck}>{perks.includes(p) ? '✓' : '+'}</span>
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* PLAN */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>06</span>
              <h2 className={styles.sectionTitle}>Choose a Plan</h2>
            </div>
            <div className={styles.plansGrid}>
              {PLANS.map(p => (
                <div
                  key={p.key}
                  className={`${styles.planCard} ${plan === p.key ? styles.planActive : ''} ${isSubmitting ? styles.disabled : ''}`}
                  onClick={() => !isSubmitting && setPlan(p.key)}
                >
                  <h4 className={styles.planLabel}>{p.label}</h4>
                  <div className={styles.planPrice}>{p.price}</div>
                  <p className={styles.planDesc}>{p.desc}</p>
                  {plan === p.key && <div className={styles.planCheck}>✓</div>}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting} style={{ background: isSubmitting ? '#94a3b8' : '', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
            {isSubmitting ? (
              <>
                <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Posting...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
                </svg>
                Post Opportunity
              </>
            )}
          </button>
        </form>
      </div>
      {/* Required for spinner animation if not defined elsewhere */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
