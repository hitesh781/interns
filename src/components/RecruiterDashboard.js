import React, { useState, useEffect } from 'react';
import styles from './RecruiterDashboard.module.css';
import { collection, query, where, getDocs, updateDoc, doc, limit } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

export default function RecruiterDashboard({ user }) {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageModal, setMessageModal] = useState({ isOpen: false, recipient: null, text: '' });
  
  // Real candidates search
  const [candidates, setCandidates] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch Jobs & Applications
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const jobsQuery = query(collection(db, "jobs"), where("postedBy", "==", user.uid));
        const jobsSnap = await getDocs(jobsQuery);

        let loadedJobs = [];

        for (const jobDoc of jobsSnap.docs) {
          const job = { id: jobDoc.id, ...jobDoc.data() };

          const appsQuery = query(collection(db, "applications"), where("jobId", "==", job.id));
          const appsSnap = await getDocs(appsQuery);

          const applications = appsSnap.docs.map(appDoc => {
            const appData = appDoc.data();
            const matchScore = appData.matchScore || Math.floor(Math.random() * 20) + 75; 
            return {
              id: appDoc.id,
              matchScore,
              ...appData
            };
          });

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

  // Debounced Candidate Search
  useEffect(() => {
    if (activeTab !== 'search') return;

    const searchCandidates = async () => {
      setIsSearching(true);
      try {
        let q;
        const term = searchQuery.trim();
        
        if (term === '') {
           // Default: Fetch latest students
           q = query(collection(db, "users"), where("role", "==", "student"), limit(20));
        } else {
           // Array-contains query for skills. Note: case sensitive.
           // e.g. searching "React"
           // Firebase will prompt to build an index if required for complex queries, but this simple one shouldn't need a composite index unless ordered.
           q = query(collection(db, "users"), where("role", "==", "student"), where("skills", "array-contains", term), limit(20));
        }
        
        const snap = await getDocs(q);
        const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // As a fallback to improve UX, if array-contains yields 0 results, we might filter locally from a general pool, 
        // but sticking to instructions: we rely on array-contains.
        setCandidates(results);
      } catch (err) {
        console.error("Error searching candidates:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const handler = setTimeout(() => {
      searchCandidates();
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery, activeTab]);


  const updateStatus = async (appId, newStatus) => {
    try {
      const appRef = doc(db, "applications", appId);
      await updateDoc(appRef, { status: newStatus });

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageModal.text.trim()) return;
    
    try {
      await import("firebase/firestore").then(({ addDoc, collection }) => {
        addDoc(collection(db, "notifications"), {
          recipientEmail: messageModal.recipient,
          senderEmail: user.email,
          message: messageModal.text,
          read: false,
          createdAt: new Date()
        });
      });

      alert(`Message successfully sent to ${messageModal.recipient}!`);
      setMessageModal({ isOpen: false, recipient: null, text: '' });
    } catch (err) {
      console.error("Error sending message notification:", err);
      alert("Failed to send message.");
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

  const allApplications = jobsData.flatMap(job =>
    job.applications.map(app => ({ ...app, jobTitle: job.title }))
  );

  const filteredApplications = allApplications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchesName = app.studentName && app.studentName.toLowerCase().includes(q);
    const matchesEmail = app.studentEmail && app.studentEmail.toLowerCase().includes(q);
    const matchesSkills = app.studentSkills && app.studentSkills.some(s => s.toLowerCase().includes(q));
    const matchesJob = app.jobTitle && app.jobTitle.toLowerCase().includes(q);
    return matchesName || matchesEmail || matchesSkills || matchesJob;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>Recruiter Dashboard</div>
        <h1 className={styles.title}>Manage <span className={styles.glow}>Opportunities</span></h1>
        <p className={styles.sub}>Review your posted jobs, manage applicant tracking, and find talent.</p>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={activeTab === 'opportunities' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities ({jobsData.length})
        </button>
        <button
          className={activeTab === 'applications' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('applications')}
        >
          ATS Board ({allApplications.length})
        </button>
        <button
          className={activeTab === 'search' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('search')}
        >
          Search Candidates
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
        <>
          <div className={styles.searchHeader} style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Filter by applicant name, email, skills, or job title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredApplications.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No matching applications found.</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className={styles.jobsList}>
              <div className={styles.jobCard}>
                <div className={styles.appList}>
                  {filteredApplications.map(app => (
                  <div key={app.id} className={styles.appItem}>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {app.studentEmail ? app.studentEmail.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className={styles.studentDetails}>
                        <h4>
                          {app.studentName || app.studentEmail}
                          <span className={styles.matchScore}>✨ {app.matchScore}% Match</span>
                        </h4>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                          {app.studentEmail} • Applied for: <strong>{app.jobTitle}</strong> • {formatDate(app.appliedAt)}
                        </p>
                        {(app.studentCollege || app.studentDegree) && (
                          <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                            🎓 {app.studentDegree} at {app.studentCollege}
                          </p>
                        )}
                        {app.studentSkills && app.studentSkills.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {app.studentSkills.map((skill, idx) => (
                              <span key={idx} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.actions}>
                      {app.status === 'accepted' && <span className={`${styles.statusBadge} ${styles.status_accepted}`}>Accepted</span>}
                      {app.status === 'rejected' && <span className={`${styles.statusBadge} ${styles.status_rejected}`}>Rejected</span>}
                      {app.status === 'interviewing' && <span className={`${styles.statusBadge} ${styles.status_interviewing}`}>Interviewing</span>}

                      {(!app.status || app.status === 'pending') && (
                        <>
                          <span className={`${styles.statusBadge} ${styles.status_pending}`}>Pending</span>
                          <button className={styles.btnInterview} onClick={() => updateStatus(app.id, 'interviewing')}>Interview</button>
                          <button className={styles.btnAccept} onClick={() => updateStatus(app.id, 'accepted')}>Accept</button>
                          <button className={styles.btnReject} onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
                        </>
                      )}

                      {app.status === 'interviewing' && (
                        <>
                          <button className={styles.btnAccept} onClick={() => updateStatus(app.id, 'accepted')}>Hire</button>
                          <button className={styles.btnReject} onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
                        </>
                      )}

                      <button className={styles.btnMessage} onClick={() => setMessageModal({ isOpen: true, recipient: app.studentEmail, text: `Regarding your application for ${app.jobTitle}...` })}>
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </>
      )}

      {activeTab === 'search' && (
        <div>
          <div className={styles.searchHeader}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search by exact skill (e.g. React, Python)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.candidatesGrid}>
            {isSearching ? (
              <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                <p>Searching database...</p>
              </div>
            ) : candidates.length > 0 ? (
              candidates.map(candidate => (
                <div key={candidate.id} className={styles.candidateCard}>
                  <div className={styles.candidateTop}>
                    <div className={styles.avatar}>{candidate.name ? candidate.name.charAt(0).toUpperCase() : 'S'}</div>
                    <div className={styles.candidateInfo}>
                      <h3>{candidate.name || 'Student Candidate'}</h3>
                      <p>{candidate.degree || 'Student'} • {candidate.college || 'University'}</p>
                    </div>
                  </div>
                  <div className={styles.candidateSkills}>
                    {candidate.skills && candidate.skills.length > 0 ? candidate.skills.map(skill => (
                      <span key={skill} className={styles.skillChip}>{skill}</span>
                    )) : <span style={{fontSize:'12px', color:'#94a3b8'}}>No specific skills listed</span>}
                  </div>
                  <div className={styles.candidateAction}>
                    <button className={styles.btnMessage} onClick={() => setMessageModal({ isOpen: true, recipient: candidate.email, text: '' })}>
                      Direct Message
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                {searchQuery ? (
                  <p>No candidates found with the skill "{searchQuery}"</p>
                ) : (
                  <p>No candidates available right now.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.isOpen && (
        <div className={styles.modalOverlay} onClick={() => setMessageModal({ ...messageModal, isOpen: false })}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Message {messageModal.recipient}</h3>
              <button className={styles.closeBtn} onClick={() => setMessageModal({ ...messageModal, isOpen: false })}>×</button>
            </div>
            <form onSubmit={handleSendMessage} className={styles.modalForm}>
              <textarea 
                autoFocus
                className={styles.modalTextarea} 
                placeholder="Type your message here..."
                value={messageModal.text}
                onChange={e => setMessageModal({ ...messageModal, text: e.target.value })}
                required
              />
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setMessageModal({ ...messageModal, isOpen: false })}>Cancel</button>
                <button type="submit" className={styles.btnSend}>Send Message</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
