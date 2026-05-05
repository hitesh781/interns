import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import app from '../firebase';
import styles from './LandingPage.module.css';

const db = getFirestore(app);

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeChip, setActiveChip] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const chips = ['All', 'Internship', 'Full-time', 'Part-time', 'Remote'];

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            company: data.company || 'Unknown',
            location: data.location || 'Remote',
            salary: data.salary || 'Unpaid',
            logo: data.company ? data.company.charAt(0).toUpperCase() : 'C',
            type: data.type || 'Internship',
            mode: data.mode || 'Remote'
          };
        });
        setJobs(fetched);
      } catch (err) {
        console.error("Error fetching landing jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  const activeJobs = jobs.filter(job => {
    if (activeChip === 'All') return true;
    if (activeChip === 'Internship' && job.type === 'Internship') return true;
    if (activeChip === 'Full-time' && job.type === 'Full-time') return true;
    if (activeChip === 'Part-time' && job.type === 'Part-time') return true;
    if (activeChip === 'Remote' && job.mode === 'Remote') return true;
    return false;
  }).slice(0, 8); // show max 8

  return (
    <div className={styles.landingContainer}>
      <Helmet>
        <link rel="canonical" href="https://internsbridge.com/" />
      </Helmet>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Make your dream career a reality</h1>
          <p className={styles.subtitle}>Trending internships and jobs from top global companies.</p>
          <div className={styles.searchBox}>
            <input type="text" placeholder="What are you looking for?" />
            <button className={styles.searchBtn} onClick={() => navigate('/jobs')}>Search</button>
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

      <section className={styles.lookingForSection}>
        <h2 className={styles.lookingForTitle}>What are you looking for today?</h2>
        <h3 className={styles.fresherJobsTitle}>Latest Opportunities</h3>
        
        <div className={styles.chipContainer}>
          {chips.map(chip => (
            <button 
              key={chip}
              className={`${styles.chip} ${activeChip === chip ? styles.active : ''}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className={styles.jobCardGrid}>
          {loading ? (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '2rem'}}>Loading opportunities...</div>
          ) : activeJobs.length === 0 ? (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '2rem'}}>No jobs found in this category right now.</div>
          ) : (
            activeJobs.map((job) => (
              <div key={job.id} className={styles.jobCard} onClick={() => navigate(`/jobs/${job.id}`)} style={{cursor: 'pointer'}}>
                <div className={styles.jobCardHeader}>
                  <div className={styles.hiringTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    Actively hiring
                  </div>
                  {job.logo && <div className={styles.companyLogoPlaceholder}>{job.logo}</div>}
                </div>
                <h4 className={styles.jobTitle}>{job.title}</h4>
                <p className={styles.companyName}>{job.company}</p>
                <div className={styles.jobDetails}>
                  <div className={styles.detailItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.location}
                  </div>
                  <div className={styles.detailItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M17 12h.01M7 12h.01"/></svg>
                    {job.salary}
                  </div>
                </div>
                <div className={styles.jobCardFooter}>
                  <span className={styles.jobType}>{job.type}</span>
                  <span className={styles.viewDetails}>View details &gt;</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.trendingSection}>
        <h2>Trending Internships & Jobs</h2>
        <div className={styles.cardGrid}>
          {loading ? (
             <p>Loading...</p>
          ) : jobs.slice(0, 3).map(job => (
            <div key={job.id} className={styles.placeholderCard} onClick={() => navigate(`/jobs/${job.id}`)}>
              <h4>{job.title}</h4>
              <p>{job.company} • {job.location}</p>
              <span>View Details &rarr;</span>
            </div>
          ))}
          {jobs.length === 0 && !loading && (
             <p style={{color: '#999'}}>More jobs coming soon!</p>
          )}
        </div>
      </section>
    </div>
  );
}
