import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import app from '../firebase';
import { JOBS } from '../data';
import styles from './JobDetailsPage.module.css';

const db = getFirestore(app);

export default function JobDetailsPage({ onApply, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // First check static jobs (which have numeric IDs in data.js)
        const staticJob = JOBS.find(j => j.id.toString() === id);
        if (staticJob) {
          setJob(staticJob);
          setLoading(false);
          return;
        }

        // Check Firebase
        const jobDoc = await getDoc(doc(db, 'jobs', id));
        if (jobDoc.exists()) {
          const data = jobDoc.data();
          setJob({
            id: jobDoc.id,
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
            desc: data.description || '',
            responsibilities: data.responsibilities || [],
            requiredSkills: data.requiredSkills || [],
            preferredSkills: data.preferredSkills || [],
            aboutCompany: data.aboutCompany || '',
            category: data.category || 'Technology'
          });
        }
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading job details...</div>;

  if (!job) return <div className={styles.notFound}><h2>Job Not Found</h2><button onClick={() => navigate('/jobs')}>Back to Jobs</button></div>;

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>{job.title} Internship in {job.location} | {job.company}</title>
        <meta name="description" content={`Apply for ${job.title} at ${job.company} located in ${job.location}. ${job.desc ? job.desc.substring(0, 150) : ''}`} />
        <link rel="canonical" href={`https://internsbridge.com/jobs/${job.id}`} />
        <meta property="og:title" content={`${job.title} at ${job.company}`} />
        <meta property="og:description" content={`Apply for ${job.title} at ${job.company} located in ${job.location}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://internsbridge.com/jobs/${job.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": job.title,
            "description": `<div><p>Job opportunity for <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p><p>${job.desc || 'Join our team for this amazing opportunity.'}</p>
              ${job.responsibilities?.length > 0 ? `<h3>Responsibilities</h3><ul>${job.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
              ${job.requiredSkills?.length > 0 ? `<h3>Required Skills</h3><ul>${job.requiredSkills.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
              ${job.aboutCompany ? `<h3>About ${job.company}</h3><p>${job.aboutCompany}</p>` : ''}
            </div>`,
            "identifier": {
              "@type": "PropertyValue",
              "name": job.company,
              "value": job.id
            },
            "datePosted": new Date().toISOString(),
            "validThrough": new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            "employmentType": job.type === 'Internship' ? 'INTERN' : job.type === 'Full-time' ? 'FULL_TIME' : 'PART_TIME',
            "hiringOrganization": {
              "@type": "Organization",
              "name": job.company,
              "sameAs": `https://${job.company.replace(/\s+/g, '').toLowerCase()}.com`
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": "IN"
              }
            },
            "baseSalary": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "value": {
                "@type": "QuantitativeValue",
                "value": job.stipend || "Unpaid",
                "unitText": "MONTH"
              }
            }
          })}
        </script>
      </Helmet>

      <div className={styles.breadcrumbs}>
        <span onClick={() => navigate('/jobs')} className={styles.breadcrumbLink}>Jobs</span> &gt;
        {job.category && <span onClick={() => navigate(`/jobs/category/${job.category.toLowerCase()}`)} className={styles.breadcrumbLink}>{job.category}</span>} {job.category && '>'}
        {job.location && <span onClick={() => navigate(`/jobs/location/${job.location.split(',')[0].toLowerCase().trim()}`)} className={styles.breadcrumbLink}>{job.location.split(',')[0]}</span>}
      </div>

      <div className={styles.heroSection}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div className={styles.header}>
          <div className={styles.logoBox} style={{ color: job.color, backgroundColor: `${job.color}15` }}>
            {job.logo}
          </div>
          <div className={styles.titleInfo}>
            <h1>{job.title} Internship – {job.location} ({job.company})</h1>
            <h2>{job.company}</h2>
            <div className={styles.timestamp}>Last updated: April 2026</div>
          </div>
          <div className={styles.actionBox}>
            <button className={styles.applyBtn} onClick={() => onApply(job)}>Apply Now</button>
            <button className={styles.saveBtn}>♡ Save</button>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <section className={styles.descSection}>
            <h3>About the Role</h3>
            <p>{job.desc || 'No description provided.'}</p>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className={styles.descSection}>
              <h3>Responsibilities</h3>
              <ul className={styles.bulletList}>
                {job.responsibilities.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requiredSkills && job.requiredSkills.length > 0 ? (
             <section className={styles.descSection}>
               <h3>Required Skills & Qualifications</h3>
               <ul className={styles.bulletList}>
                 {job.requiredSkills.map((req, i) => (
                   <li key={i}>{req}</li>
                 ))}
               </ul>
             </section>
          ) : (
            <section className={styles.skillsSection}>
              <h3>Skills Tags</h3>
              <div className={styles.tags}>
                {job.tags?.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </section>
          )}

          {job.preferredSkills && job.preferredSkills.length > 0 && (
            <section className={styles.descSection}>
              <h3>Preferred Skills</h3>
              <ul className={styles.bulletList}>
                {job.preferredSkills.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {job.aboutCompany && (
            <section className={styles.descSection}>
              <h3>About {job.company}</h3>
              <p>{job.aboutCompany}</p>
            </section>
          )}
        </div>

        <div className={styles.sideContent}>
          <div className={styles.metaCard}>
            <h3>Job Overview</h3>
            <ul>
              <li><strong>📍 Location:</strong> {job.location}</li>
              <li><strong>💼 Type:</strong> {job.type}</li>
              <li><strong>🏢 Mode:</strong> {job.mode}</li>
              <li><strong>💰 Salary:</strong> {job.stipend}</li>
              <li><strong>🕒 Posted:</strong> {job.posted}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
