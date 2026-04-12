import React, { useState, useMemo } from 'react';
import { JOBS, FILTERS, CATEGORIES } from '../data';
import styles from './StudentPage.module.css';

function JobCard({ job, onApply, onSave, saved }) {
  return (
    <div className={`${styles.card} ${job.featured ? styles.featured : ''}`}>
      {job.featured && <span className={styles.featuredBadge}>⚡ FEATURED</span>}
      <div className={styles.cardTop}>
        <div className={styles.logo} style={{ background: job.color + '22', border: `1px solid ${job.color}44`, color: job.color }}>
          {job.logo}
        </div>
        <div className={styles.info}>
          <h2 className={styles.jobTitle}>{job.title}</h2>
          <p className={styles.company}>{job.company} · {job.location}</p>
        </div>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
          onClick={() => onSave(job.id)}
          title={saved ? 'Unsave' : 'Save'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      <p className={styles.desc}>{job.desc}</p>

      <div className={styles.tags}>
        <span className={`${styles.tag} ${styles.typeTag}`}>{job.type}</span>
        <span className={`${styles.tag} ${styles.modeTag}`}>{job.mode}</span>
        {job.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.stipend}>{job.stipend}</span>
          <span className={styles.posted}>{job.posted}</span>
        </div>
        <button className={styles.applyBtn} onClick={() => onApply(job)}>
          Apply Now →
        </button>
      </div>
    </div>
  );
}

export default function StudentPage({ onApply }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [saved, setSaved] = useState(new Set());

  const toggleCat = (c) => setCategories(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  );

  const results = useMemo(() => {
    let list = JOBS;
    if (query) {
      const q = query.toLowerCase();
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
  }, [query, filter, categories]);

  const toggleSave = (id) => setSaved(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className={styles.page}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.grid} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>⚡ 50,000+ Students Already Placed</div>
          <h1 className={styles.heroTitle}>
            Launch Your<br/><span className={styles.glow}>Future Career</span>
          </h1>
          <p className={styles.heroSub}>Connect with 1,200+ companies actively hiring students & fresh graduates across India.</p>
          <div className={styles.statsRow}>
            {[['8,400+','Active Listings'],['1,200+','Partner Companies'],['50k+','Students Placed'],['96%','Satisfaction']].map(([n,l]) => (
              <div key={l} className={styles.statItem}>
                <span className={styles.statNum}>{n}</span>
                <span className={styles.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by role, skill, or company..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.chip} ${filter === f ? styles.chipActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className={styles.main}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <h3 className={styles.sideLabel}>Category</h3>
            {CATEGORIES.map(c => (
              <label key={c} className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={categories.includes(c)}
                  onChange={() => toggleCat(c)}
                  className={styles.check}
                />
                {c}
              </label>
            ))}
          </div>
          <div className={styles.sideSection}>
            <h3 className={styles.sideLabel}>Work Mode</h3>
            {['Remote','On-site','Hybrid'].map(m => (
              <label key={m} className={styles.checkRow}>
                <input type="checkbox" className={styles.check} />
                {m}
              </label>
            ))}
          </div>
          <div className={styles.sideSection}>
            <h3 className={styles.sideLabel}>Stipend Range</h3>
            <div className={styles.rangeRow}>
              <input className={styles.rangeInput} type="text" placeholder="Min" defaultValue="₹5,000" />
              <span style={{color:'var(--text-muted)'}}>–</span>
              <input className={styles.rangeInput} type="text" placeholder="Max" defaultValue="₹50,000" />
            </div>
          </div>
          <div className={styles.sideSection}>
            <h3 className={styles.sideLabel}>Duration</h3>
            {['1–3 months','3–6 months','6+ months','Permanent'].map(d => (
              <label key={d} className={styles.checkRow}>
                <input type="checkbox" className={styles.check} />
                {d}
              </label>
            ))}
          </div>
          <button className={styles.filterBtn}>Apply Filters</button>
        </aside>

        {/* LISTINGS */}
        <div>
          <div className={styles.listHeader}>
            <span className={styles.count}>Showing <strong>{results.length}</strong> opportunities</span>
            <select className={styles.sort}>
              <option>Most Recent</option>
              <option>Highest Stipend</option>
              <option>Best Match</option>
            </select>
          </div>
          <div className={styles.list}>
            {results.length === 0
              ? <div className={styles.empty}>No results found. Try adjusting your filters.</div>
              : results.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={onApply}
                    onSave={toggleSave}
                    saved={saved.has(job.id)}
                  />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
