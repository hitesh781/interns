import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styles from './StudentPage.module.css';
import { FILTERS, CATEGORIES } from '../data';

const db = getFirestore(app);

function JobCard({ job, onApply, onSave, saved }) {
  const navigate = useNavigate();
  return (
    <div className={`${styles.card} ${job.featured ? styles.featured : ''}`} onClick={() => navigate(`/jobs/${job.id}`)}>
      {job.featured && <span className={styles.featuredBadge}>Promoted</span>}
      <div className={styles.cardTop}>
        <div className={styles.logo} style={{ color: job.color, backgroundColor: `${job.color}15` }}>
          {job.logo}
        </div>
        <div className={styles.info}>
          <h2 className={styles.jobTitle}>{job.title}</h2>
          <p className={styles.company}>{job.company}</p>
        </div>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
          onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
          title={saved ? 'Unsave' : 'Save'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      <div className={styles.metaInfo}>
        <span>📍 {job.location}</span>
        <span>💵 {job.stipend}</span>
        <span>💼 {job.type}</span>
      </div>

      <div className={styles.tags}>
        {job.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
      </div>

      <div className={styles.footer}>
        <span className={styles.posted}>{job.posted}</span>
        <button className={styles.applyBtn} onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default function StudentPage({ onApply, user, presetLocation, presetCategory }) {
  const { locationParam: urlLocation, categoryParam: urlCategory } = useParams();
  const locationParam = presetLocation || urlLocation;
  const categoryParam = presetCategory || urlCategory;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [saved, setSaved] = useState(new Set());
  const [dbJobs, setDbJobs] = useState([]);

  useEffect(() => {
    if (locationParam) setSearchQuery(locationParam);
    if (categoryParam) {
      const cat = CATEGORIES.find(c => c.toLowerCase() === categoryParam.toLowerCase());
      if (cat) setCategories([cat]);
    }
  }, [locationParam, categoryParam]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            company: data.company || 'Unknown',
            logo: data.company ? data.company.charAt(0).toUpperCase() : 'C',
            color: '#1a73e8',
            type: data.type || 'Internship',
            mode: data.mode || 'Remote',
            tags: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
            stipend: data.salary || 'Unpaid',
            location: data.location || 'Remote',
            posted: 'Recently',
            featured: data.plan === 'pro' || data.plan === 'enterprise',
            category: 'Technology',
            desc: data.description || '',
          };
        });
        setDbJobs(jobsList);
      } catch (err) {
        console.error("Error fetching jobs from DB:", err);
      }
    };
    fetchJobs();
  }, []);

  const toggleCat = (c) => setCategories(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  );

  const results = useMemo(() => {
    let list = [...dbJobs];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filter !== 'All') {
      list = list.filter(j =>
        j.type === filter || j.mode === filter || j.tags.includes(filter)
      );
    }
    if (categories.length > 0) {
      list = list.filter(j => categories.includes(j.category));
    }
    return list;
  }, [searchQuery, filter, categories, dbJobs]);

  const toggleSave = (id) => setSaved(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const applyJob = async (job) => {
    if (!user) {
      onApply(job); // Let App.js handle unauthorized state (shows "Please login")
      return;
    }

    if (user.role === 'recruiter') {
      onApply(job); // Let App.js handle recruiter blocking
      return;
    }

    if (!user.hasResume) {
      alert("You need to build your resume before applying!");
      // We could use a callback to navigate, or just return. 
      // They can navigate via navbar.
      return;
    }

    try {
      const q = query(
        collection(db, "applications"),
        where("jobId", "==", job.id.toString()), // Convert job.id to string to avoid mismatch for mock jobs vs DB jobs
        where("studentId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("You already applied!");
        return;
      }

      await addDoc(collection(db, "applications"), {
        jobId: job.id.toString(),
        jobTitle: job.title,
        company: job.company,
        studentId: user.uid,
        studentEmail: user.email,
        studentName: user.name || '',
        studentCollege: user.college || '',
        studentDegree: user.degree || '',
        studentSkills: user.skills || [],
        status: 'pending',
        appliedAt: new Date()
      });

      onApply(job);
    } catch (err) {
      console.error(err);
      alert("Error applying");
    }
  };

  let pageTitle = "Internships & Jobs | InternsBridge";
  let pageDesc = "Find your dream job or internship today on InternsBridge.";
  let pageH1 = "Find your dream job or internship";
  let introText = null;
  
  if (locationParam) {
    const loc = locationParam.charAt(0).toUpperCase() + locationParam.slice(1);
    pageTitle = `Internships in ${loc} | InternsBridge`;
    pageDesc = `Browse top internships and jobs in ${loc}. Apply to top companies today.`;
    pageH1 = `Internships in ${loc}`;
    introText = `Explore the latest internships in ${loc} for freshers and students. Apply to the best remote and on-site opportunities in ${loc}.`;
  } else if (categoryParam) {
    const cat = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    pageTitle = `${cat} Internships & Jobs | InternsBridge`;
    pageDesc = `Find the best ${cat} internships and jobs. Apply now on InternsBridge.`;
    pageH1 = `${cat} Internships`;
    introText = `Explore the latest ${cat} internships for freshers and students. Kickstart your career in ${cat} today.`;
  }

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Helmet>
      <div className={styles.searchHeader}>
        <h1>{pageH1}</h1>
        {(locationParam || categoryParam) && <div className={styles.lastUpdated}>Last updated: April 2026</div>}
        {introText && <p className={styles.seoIntroText} style={{ maxWidth: '600px', margin: '10px auto', color: '#f0f0f0', fontSize: '1rem' }}>{introText}</p>}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by role, company, or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.quickFilters}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterChip} ${filter === f ? styles.activeFilter : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3>Category</h3>
            {CATEGORIES.map(c => (
              <label key={c} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={categories.includes(c)}
                  onChange={() => toggleCat(c)}
                />
                {c}
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h3>Work Mode</h3>
            {['Remote', 'On-site', 'Hybrid'].map(m => (
              <label key={m} className={styles.checkboxLabel}>
                <input type="checkbox" />
                {m}
              </label>
            ))}
          </div>
        </aside>

        <div className={styles.resultsArea}>
          <div className={styles.resultsHeader}>
            <p><strong>{results.length}</strong> opportunities found</p>
          </div>
          
          <div className={styles.jobList}>
            {results.length === 0 ? (
              <div className={styles.noResults}>No matches found. Try clearing filters.</div>
            ) : (
              results.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={applyJob}
                  onSave={toggleSave}
                  saved={saved.has(job.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {(locationParam || categoryParam) && (
        <div className={styles.seoContentWrapper}>
          <div className={styles.seoContentSection}>
            <h2>Why pursue {categoryParam ? `a career in ${categoryParam}` : `internships in ${locationParam}`}?</h2>
            <p>
              Finding the right opportunity is crucial for your career growth. {locationParam ? `The job market in ${locationParam} is thriving with tech startups, established enterprises, and remote-first companies looking for top talent.` : `The ${categoryParam} industry is constantly evolving, offering dynamic roles for freshers and experienced professionals alike.`} By applying through InternsBridge, you gain access to curated opportunities that match your skill set.
            </p>
            
            <div className={styles.seoGrid}>
              <div className={styles.seoCard}>
                <h3>Top Companies Hiring</h3>
                <ul>
                  <li>Google</li>
                  <li>Microsoft</li>
                  <li>Spotify</li>
                  <li>Fast-growing Startups</li>
                </ul>
              </div>
              <div className={styles.seoCard}>
                <h3>Popular Roles</h3>
                <ul>
                  <li>Software Engineering Intern</li>
                  <li>Data Analyst Intern</li>
                  <li>Product Design Intern</li>
                  <li>Marketing Associate</li>
                </ul>
              </div>
              <div className={styles.seoCard}>
                <h3>Tips for Success</h3>
                <ul>
                  <li>Tailor your resume for each application.</li>
                  <li>Highlight personal projects and portfolios.</li>
                  <li>Prepare for behavioral and technical interviews.</li>
                  <li>Apply early and follow up!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
