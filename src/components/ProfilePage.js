import React from 'react';
import styles from './ProfilePage.module.css';

const ACTIVITY = [
  { dot: 'neon', title: 'Applied — Frontend Intern @ Google India', sub: '2 hours ago · Under Review' },
  { dot: 'green', title: 'Interview Scheduled — UI/UX Intern @ Razorpay', sub: 'Yesterday · Apr 3rd, 2:00 PM' },
  { dot: 'gold', title: 'Saved — Data Analyst @ Zomato', sub: '2 days ago' },
  { dot: 'neon', title: 'Applied — Backend Intern @ Swiggy', sub: '4 days ago · Shortlisted ✓' },
  { dot: 'green', title: 'Offer Received — Summer Intern @ MakeMyTrip', sub: '1 week ago · ₹18,000/month' },
];

const RECS = [
  { title: 'Product Intern', co: "BYJU'S · Bengaluru", pay: '₹20,000/mo' },
  { title: 'React Developer', co: 'Flipkart · Remote', pay: '₹25,000/mo' },
  { title: 'ML Intern', co: 'Google India · Hyderabad', pay: '₹35,000/mo' },
  { title: 'Growth Analyst', co: 'Zomato · Delhi NCR', pay: '₹15,000/mo' },
];

export default function ProfilePage({ setPage }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>My Dashboard</div>
        <h1 className={styles.title}>Command <span className={styles.glow}>Center</span></h1>
        <p className={styles.sub}>Track applications, interviews, and discover new opportunities</p>
      </div>

      <div className={styles.grid}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>A</div>
            <h3 className={styles.name}>Arjun Sharma</h3>
            <p className={styles.edu}>B.Tech CSE · Final Year</p>
            <p className={styles.college}>Delhi Technological University</p>
            <div className={styles.statRow}>
              <div className={styles.stat}><span className={styles.statN}>12</span><span className={styles.statL}>Applied</span></div>
              <div className={styles.stat}><span className={styles.statN}>5</span><span className={styles.statL}>Saved</span></div>
              <div className={styles.stat}><span className={styles.statN}>3</span><span className={styles.statL}>Interviews</span></div>
            </div>
            <div className={styles.profileBtns}>
              <button className={styles.btnOutline}>Edit Profile</button>
              <button className={styles.btnNeon}>Upload Resume</button>
            </div>
          </div>

          <div className={styles.skillCard}>
            <h4 className={styles.cardTitle}>Top Skills</h4>
            <div className={styles.skills}>
              {['React','JavaScript','Python','Figma','SQL','Node.js'].map(s => (
                <span key={s} className={styles.skill}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          <div className={styles.activityCard}>
            <h4 className={styles.cardTitle}>Recent Activity</h4>
            <div className={styles.actList}>
              {ACTIVITY.map((a, i) => (
                <div key={i} className={styles.actItem}>
                  <div className={`${styles.dot} ${styles['dot_' + a.dot]}`} />
                  <div>
                    <div className={styles.actTitle}>{a.title}</div>
                    <div className={styles.actSub}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.recsCard}>
            <h4 className={styles.cardTitle}>Recommended For You</h4>
            <div className={styles.recsGrid}>
              {RECS.map((r, i) => (
                <div key={i} className={styles.recItem} onClick={() => setPage('student')}>
                  <div className={styles.recTitle}>{r.title}</div>
                  <div className={styles.recCo}>{r.co}</div>
                  <div className={styles.recPay}>{r.pay}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
