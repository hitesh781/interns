import React from 'react';
import styles from './LandingPage.module.css';

export default function LandingPage({ setPage }) {
  return (
    <div className={styles.landingContainer}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Make your dream career a reality</h1>
          <p className={styles.subtitle}>Trending internships and jobs from top global companies.</p>
          <div className={styles.searchBox}>
            <input type="text" placeholder="What are you looking for?" />
            <button className={styles.searchBtn} onClick={() => setPage('student')}>Search</button>
          </div>
        </div>
      </header>
      
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>300K+</h3>
          <p>Companies hiring</p>
        </div>
        <div className={styles.statCard}>
          <h3>10K+</h3>
          <p>New openings everyday</p>
        </div>
        <div className={styles.statCard}>
          <h3>21M+</h3>
          <p>Active candidates</p>
        </div>
      </section>

      <section className={styles.trendingSection}>
        <h2>Trending Internships & Jobs</h2>
        <div className={styles.cardGrid}>
          <div className={styles.placeholderCard} onClick={() => setPage('student')}>
            <h4>Software Engineering Intern</h4>
            <p>Google • Remote</p>
            <span>View Details &rarr;</span>
          </div>
          <div className={styles.placeholderCard} onClick={() => setPage('student')}>
            <h4>Product Designer</h4>
            <p>Stripe • San Francisco</p>
            <span>View Details &rarr;</span>
          </div>
          <div className={styles.placeholderCard} onClick={() => setPage('student')}>
            <h4>Data Analyst Intern</h4>
            <p>Spotify • Stockholm</p>
            <span>View Details &rarr;</span>
          </div>
        </div>
      </section>
    </div>
  );
}
