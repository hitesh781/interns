import React, { useState } from 'react';
import styles from './PostJobPage.module.css';

const PLANS = [
  { key: 'basic', label: 'Basic', price: 'Free', desc: '1 listing · 30 days · Standard placement' },
  { key: 'pro', label: 'Pro', price: '₹999', desc: '3 listings · Featured placement · Analytics' },
  { key: 'enterprise', label: 'Enterprise', price: '₹2,499', desc: 'Unlimited · Top placement · Dedicated support' },
];

const PERKS = ['Certificate', 'Letter of Recommendation', 'Flexible Hours', 'Pre-Placement Offer', 'Meals Provided', 'Stock Options'];

export default function PostJobPage({ onSubmit }) {
  const [plan, setPlan] = useState('pro');
  const [perks, setPerks] = useState(['Certificate', 'Flexible Hours']);

  const togglePerk = (p) => setPerks(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.page}>
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
                <input className={styles.input} type="text" placeholder="e.g. Frontend Developer Intern" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Company Name *</label>
                <input className={styles.input} type="text" placeholder="e.g. Acme Innovations" required />
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Opportunity Type *</label>
                <select className={styles.select}>
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Work Mode *</label>
                <select className={styles.select}>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* LOCATION & DURATION */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>02</span>
              <h2 className={styles.sectionTitle}>Location & Compensation</h2>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <input className={styles.input} type="text" placeholder="e.g. Bengaluru / Remote" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Duration</label>
                <input className={styles.input} type="text" placeholder="e.g. 3 months / Permanent" />
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Stipend / Salary (₹/month)</label>
                <input className={styles.input} type="text" placeholder="e.g. 15,000 – 25,000" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Application Deadline</label>
                <input className={styles.input} type="date" />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>03</span>
              <h2 className={styles.sectionTitle}>Job Description</h2>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>About the Role *</label>
              <textarea className={styles.textarea} placeholder="Describe responsibilities, day-to-day work, what the candidate will learn..." required />
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Required Skills</label>
                <input className={styles.input} type="text" placeholder="React, Python, Figma (comma-separated)" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Preferred Qualifications</label>
                <input className={styles.input} type="text" placeholder="e.g. B.Tech CSE, MBA Finance..." />
              </div>
            </div>
          </div>

          {/* PERKS */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>04</span>
              <h2 className={styles.sectionTitle}>Perks & Benefits</h2>
            </div>
            <div className={styles.perksGrid}>
              {PERKS.map(p => (
                <label key={p} className={`${styles.perkCard} ${perks.includes(p) ? styles.perkActive : ''}`} onClick={() => togglePerk(p)}>
                  <input type="checkbox" checked={perks.includes(p)} onChange={() => {}} className={styles.hidden} />
                  <span className={styles.perkCheck}>{perks.includes(p) ? '✓' : '+'}</span>
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* PLAN */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNum}>05</span>
              <h2 className={styles.sectionTitle}>Choose a Plan</h2>
            </div>
            <div className={styles.plansGrid}>
              {PLANS.map(p => (
                <div
                  key={p.key}
                  className={`${styles.planCard} ${plan === p.key ? styles.planActive : ''}`}
                  onClick={() => setPlan(p.key)}
                >
                  <h4 className={styles.planLabel}>{p.label}</h4>
                  <div className={styles.planPrice}>{p.price}</div>
                  <p className={styles.planDesc}>{p.desc}</p>
                  {plan === p.key && <div className={styles.planCheck}>✓</div>}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
            </svg>
            Post Opportunity
          </button>
        </form>
      </div>
    </div>
  );
}
