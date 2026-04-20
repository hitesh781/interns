import React, { useState, useEffect } from 'react';
import styles from './RecruiterDashboard.module.css';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

// Mock candidates for Candidate Search & Filtering
const MOCK_CANDIDATES = [
  { id: 1, name: 'Rahul Sharma', title: 'Frontend Developer', location: 'Bengaluru', skills: ['React', 'JavaScript', 'CSS'], matchScore: 95 },
  { id: 2, name: 'Priya Patel', title: 'Data Analyst', location: 'Remote', skills: ['Python', 'SQL', 'Tableau'], matchScore: 88 },
  { id: 3, name: 'Amit Kumar', title: 'Backend Engineer', location: 'Pune', skills: ['Node.js', 'MongoDB', 'AWS'], matchScore: 92 },
  { id: 4, name: 'Neha Gupta', title: 'UI/UX Designer', location: 'Mumbai', skills: ['Figma', 'Prototyping', 'User Research'], matchScore: 85 },
];

export default function RecruiterDashboard({ user }) {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageModal, setMessageModal] = useState({ isOpen: false, recipient: null, text: '' });

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
      // For real users, we use email. For mock candidates, it might just be the name or mock email.
      // We assume messageModal.recipient is an email or maps to a user identifier.
      // We will write the notification to Firestore.
      await import("firebase/firestore").then(({ addDoc, collection }) => {
        addDoc(collection(db, "notifications"), {
          recipientEmail: messageModal.recipient, // Target student email
          senderEmail: user.email,               // Recruiter email
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

  const filteredCandidates = MOCK_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                        <h4>
                          {app.studentEmail}
                          <span className={styles.matchScore}>✨ {app.matchScore}% Match</span>
                        </h4>
                        <p>Applied for: <strong>{app.jobTitle}</strong> • {formatDate(app.appliedAt)}</p>
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
        )
      )}

      {activeTab === 'search' && (
        <div>
          <div className={styles.searchHeader}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search by skills (e.g. React, Python) or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.candidatesGrid}>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <div key={candidate.id} className={styles.candidateCard}>
                  <div className={styles.candidateTop}>
                    <div className={styles.avatar}>{candidate.name.charAt(0)}</div>
                    <div className={styles.candidateInfo}>
                      <h3>{candidate.name}</h3>
                      <p>{candidate.title} • {candidate.location}</p>
                    </div>
                  </div>
                  <div className={styles.candidateSkills}>
                    {candidate.skills.map(skill => (
                      <span key={skill} className={styles.skillChip}>{skill}</span>
                    ))}
                  </div>
                  <div className={styles.candidateAction}>
                    <button className={styles.btnMessage} onClick={() => setMessageModal({ isOpen: true, recipient: candidate.name, text: '' })}>
                      Direct Message
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                <p>No candidates found matching "{searchQuery}"</p>
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
