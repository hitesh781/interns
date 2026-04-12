import React from 'react';
import { COMPANIES } from '../data';
import styles from './CompaniesPage.module.css';

export default function CompaniesPage({ setPage }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.badge}>1,200+ Partners</div>
          <h1 className={styles.title}>Top <span className={styles.glow}>Companies</span> Hiring Now</h1>
          <p className={styles.sub}>Browse companies actively posting opportunities for students and graduates across India.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {COMPANIES.map(co => (
          <div key={co.id} className={styles.card} onClick={() => setPage('student')}>
            <div className={styles.cardTop}>
              <div className={styles.logo} style={{ background: co.color + '18', border: `1px solid ${co.color}35`, color: co.color }}>
                {co.logo}
              </div>
              <div className={styles.openBadge}>{co.openings} open</div>
            </div>
            <h3 className={styles.coName}>{co.name}</h3>
            <p className={styles.industry}>{co.industry} · {co.location}</p>
            <p className={styles.desc}>{co.desc}</p>
            <div className={styles.cardFooter}>
              <span className={styles.size}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:4}}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {co.size} employees
              </span>
              <button className={styles.viewBtn}>View Jobs →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
