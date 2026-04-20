import React, { useState, useEffect } from 'react';
import styles from './RecruiterDashboard.module.css';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

export default function RecruiterDashboard({ user }) {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opportunities');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        // 1. Fetch jobs posted by this recruiter
        const jobsQuery = query(collection(db, "jobs"), where("postedBy", "==", user.uid));
        const jobsSnap = await getDocs(jobsQuery);

        let loadedJobs = [];

        // 2. For each job, fetch its applications
        for (const jobDoc of jobsSnap.docs) {
          const job = { id: jobDoc.id, ...jobDoc.data() };

          const appsQuery = query(collection(db, "applications"), where("jobId", "==", job.id));
          const appsSnap = await getDocs(appsQuery);

          const applications = appsSnap.docs.map(appDoc => ({
            id: appDoc.id,
            ...appDoc.data()
          }));

          job.applications = applications;
          loadedJobs.push(job);
        }

        setJobsData(loadedJobs);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const appRef = doc(db, "applications", appId);
      await updateDoc(appRef, { status: newStatus });

      // Update local state to reflect change instantly
      setJobsData(prev => prev.map(job => ({
        ...job,
        applications: job.applications.map(app =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      })));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return <div className={styles.page}><h2 style={{ color: '#1e293b', textAlign: 'center' }}>Loading Dashboard...</h2></div>;
  }

  // Flatten applications for the "Applications Received" tab
  const allApplications = jobsData.flatMap(job =>
    job.applications.map(app => ({ ...app, jobTitle: job.title }))
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>Recruiter Dashboard</div>
        <h1 className={styles.title}>Manage <span className={styles.glow}>Opportunities</span></h1>
        <p className={styles.sub}>Review your posted jobs and respond to incoming applications.</p>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={activeTab === 'opportunities' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities Posted ({jobsData.length})
        </button>
        <button
          className={activeTab === 'applications' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('applications')}
        >
          Applications Received ({allApplications.length})
        </button>
      </div>

      {activeTab === 'opportunities' && (
        jobsData.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No jobs posted yet.</h3>
            <p>Once you post an opportunity, it will appear here.</p>
          </div>
        ) : (
          <div className={styles.jobsList}>
            {jobsData.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader} style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                  <div className={styles.jobInfo}>
                    <h3>{job.title}</h3>
                    <p>{job.type} • {job.mode} • {job.location || 'Remote'}</p>
                  </div>
                  <div className={styles.appCount}>
                    {job.applications.length} Applicant{job.applications.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'applications' && (
        allApplications.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No applications received yet.</h3>
            <p>Applications from students will appear here.</p>
          </div>
        ) : (
          <div className={styles.jobsList}>
            <div className={styles.jobCard}>
              <div className={styles.appList}>
                {allApplications.map(app => (
                  <div key={app.id} className={styles.appItem}>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {app.studentEmail ? app.studentEmail.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className={styles.studentDetails}>
                        <h4>{app.studentEmail}</h4>
                        <p>Applied for: <strong>{app.jobTitle}</strong> • {formatDate(app.appliedAt)}</p>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      {app.status === 'accepted' && <span className={`${styles.statusBadge} ${styles.status_accepted}`}>Accepted</span>}
                      {app.status === 'rejected' && <span className={`${styles.statusBadge} ${styles.status_rejected}`}>Rejected</span>}

                      {(!app.status || app.status === 'pending') && (
                        <>
                          <span className={`${styles.statusBadge} ${styles.status_pending}`}>Pending</span>
                          <button className={styles.btnAccept} onClick={() => updateStatus(app.id, 'accepted')}>Accept</button>
                          <button className={styles.btnReject} onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

    </div>
  );
}
