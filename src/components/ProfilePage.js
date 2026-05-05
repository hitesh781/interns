import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';

export default function ProfilePage({ user }) {
  const navigate = useNavigate();

  // If user is not passed properly or still loading
  if (!user) return null;

  const isRecruiter = user.role === 'recruiter';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>{isRecruiter ? 'Recruiter Profile' : 'Student Profile'}</div>
        <h1 className={styles.title}>My <span className={styles.glow}>Command Center</span></h1>
        <p className={styles.sub}>
          {isRecruiter 
            ? 'Manage your organization profile and opportunities.' 
            : 'Track applications, interviews, and discover new opportunities.'}
        </p>
      </div>

      <div className={styles.grid}>
        {/* LEFT COLUMN: Profile Info */}
        <div className={styles.leftCol}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className={styles.name}>{user.name || 'User'}</h3>
            <p className={styles.email}>{user.email}</p>
            
            {isRecruiter ? (
              <>
                <p className={styles.edu}>{user.designation || 'Recruiter'}</p>
                <p className={styles.college}>{user.organizationName || 'Independent'}</p>
                {user.industry && <p style={{fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px'}}>{user.industry}</p>}
                <div className={styles.profileBtns}>
                  <button className={styles.btnOutline} onClick={() => navigate('/recruiter-setup')}>Edit Company Profile</button>
                  <button className={styles.btnNeon} onClick={() => navigate('/dashboard')}>View Dashboard</button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.edu}>{user.degree || 'Student'}</p>
                <p className={styles.college}>{user.college || 'University not specified'}</p>
                <div className={styles.statRow}>
                  <div className={styles.stat}><span className={styles.statN}>0</span><span className={styles.statL}>Applied</span></div>
                  <div className={styles.stat}><span className={styles.statN}>0</span><span className={styles.statL}>Saved</span></div>
                  <div className={styles.stat}><span className={styles.statN}>0</span><span className={styles.statL}>Interviews</span></div>
                </div>
                <div className={styles.profileBtns}>
                  <button className={styles.btnOutline} onClick={() => navigate('/setup')}>Edit Profile</button>
                  <button className={styles.btnNeon} onClick={() => navigate('/resume')}>Build Resume</button>
                </div>
              </>
            )}
          </div>

          {!isRecruiter && user.skills && user.skills.length > 0 && (
            <div className={styles.skillCard}>
              <h4 className={styles.cardTitle}>Top Skills</h4>
              <div className={styles.skills}>
                {user.skills.map(s => (
                  <span key={s} className={styles.skill}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Activity & Content */}
        <div className={styles.rightCol}>
          {!isRecruiter ? (
            <>
              <div className={styles.activityCard}>
                <h4 className={styles.cardTitle}>Recent Activity</h4>
                <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                  No recent activity found. Start applying for jobs to see them here!
                </div>
              </div>

              <div className={styles.recsCard}>
                <h4 className={styles.cardTitle}>Recommended For You</h4>
                <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                  We are gathering recommendations based on your skills. Check back soon.
                </div>
                <button 
                  style={{marginTop: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'}}
                  onClick={() => navigate('/jobs')}
                >
                  Browse all jobs
                </button>
              </div>
            </>
          ) : (
            <div className={styles.activityCard}>
              <h4 className={styles.cardTitle}>Quick Actions</h4>
              <div className={styles.actList}>
                <div className={styles.actItem} onClick={() => navigate('/post-job')} style={{cursor: 'pointer'}}>
                  <div className={`${styles.dot} ${styles.dot_neon}`} />
                  <div>
                    <div className={styles.actTitle}>Post a new Opportunity</div>
                    <div className={styles.actSub}>Hire interns and full-time employees</div>
                  </div>
                </div>
                <div className={styles.actItem} onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
                  <div className={`${styles.dot} ${styles.dot_gold}`} />
                  <div>
                    <div className={styles.actTitle}>Review Applications</div>
                    <div className={styles.actSub}>See candidates who applied to your postings</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
