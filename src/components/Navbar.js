import React from 'react';
import styles from './Navbar.module.css';

const TABS = [
  { key: 'student', label: 'Find Jobs' },
  { key: 'companies', label: 'Companies' },
  { key: 'post', label: 'Post Job' },
];

export default function Navbar({ page, setPage, user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => setPage('student')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
            stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="4" y1="22" x2="4" y2="15" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Interns<span className={styles.accent}>Bridge</span>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${page === t.key ? styles.active : ''}`}
            onClick={() => setPage(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.right}>
        {user && (
          <div className={styles.userRow}>
            <div className={styles.userChip} onClick={() => setPage('profile')}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name || user.email?.split('@')[0]}</span>
                <span className={styles.userRole}>{user.role === 'recruiter' ? '🏢 Recruiter' : '🎓 Student'}</span>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={onLogout} title="Log out">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        )}
        <button className={styles.btnNeon} onClick={() => setPage('post')}>
          Post Opportunity
        </button>
      </div>
    </nav>
  );
}
