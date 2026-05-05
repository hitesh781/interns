import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import app from '../firebase';
import styles from './CompaniesPage.module.css';

const db = getFirestore(app);

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'recruiter'));
        const snapshot = await getDocs(q);
        
        const fetchedCompanies = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          // Only show companies that have completed their setup
          if (data.setupComplete && data.organizationName && data.organizationName !== 'Independent Practitioner') {
            fetchedCompanies.push({
              id: doc.id,
              name: data.organizationName,
              logo: data.organizationName.charAt(0).toUpperCase(),
              color: '#1a73e8', // Default blue, could be dynamic
              industry: data.industry || 'Various',
              location: data.city || 'India',
              desc: data.about || `We are actively hiring for new talent. Join ${data.organizationName} today.`,
              size: data.employees || 'Unknown',
              openings: 'Multiple' // Since we don't aggregate job counts easily, we show "Multiple"
            });
          }
        });

        // Optional: Remove duplicates if multiple recruiters belong to the same company
        const unique = Array.from(new Map(fetchedCompanies.map(c => [c.name, c])).values());
        setCompanies(unique);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.badge}>{companies.length}+ Partners</div>
          <h1 className={styles.title}>Top <span className={styles.glow}>Companies</span> Hiring Now</h1>
          <p className={styles.sub}>Browse companies actively posting opportunities for students and graduates across India.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#888' }}>Loading partner companies...</p>
        ) : companies.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#888' }}>No partner companies have registered yet.</p>
        ) : (
          companies.map(co => (
            <div key={co.id} className={styles.card} onClick={() => navigate(`/jobs?search=${encodeURIComponent(co.name)}`)}>
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
          ))
        )}
      </div>
    </div>
  );
}
