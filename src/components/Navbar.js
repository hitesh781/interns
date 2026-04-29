import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "../firebase";

const db = getFirestore(app);

const TABS = [
  { key: 'student', path: '/jobs', label: 'Internships & Jobs' },
  { key: 'companies', path: '/companies', label: 'Companies' },
  { key: 'messages', path: '/messages', label: 'Messages' },
  { key: 'resume', path: '/resume', label: 'AI Resume' },
  { key: 'dashboard', path: '/dashboard', label: 'Dashboard' },
];

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [replyModal, setReplyModal] = useState({ isOpen: false, recipient: null, text: '' });

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"), 
      where("recipientEmail", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notifId) => {
    try {
      await updateDoc(doc(db, "notifications", notifId), { read: true });
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyModal.text.trim()) return;

    try {
      await addDoc(collection(db, "notifications"), {
        recipientEmail: replyModal.recipient,
        senderEmail: user.email,
        message: replyModal.text,
        read: false,
        createdAt: new Date()
      });
      alert(`Reply sent to ${replyModal.recipient}!`);
      setReplyModal({ isOpen: false, recipient: null, text: '' });
      setShowNotifications(false); // Optionally close dropdown
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply.");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <div className={styles.internshalaLogo}>
            <svg width="70" height="45" viewBox="0 0 70 45" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.planeIcon}>
              <path d="M5 35 Q 15 35, 25 25" stroke="#A0A0A0" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              <path d="M25 25 L65 5 L45 35 L38 27 L33 34 L30 26 Z" fill="#00A5EC" />
              <path d="M65 5 L38 27 L30 26 Z" fill="#52C4F4" />
              <path d="M38 27 L33 34 L30 26 Z" fill="#007FB5" />
            </svg>
            <span className={styles.logoBlue}>INTERNS</span>
            <span className={styles.logoGrey}>BRIDGE</span>
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.filter(t => {
            if (t.key === 'dashboard') return user?.role === 'recruiter';
            if (t.key === 'resume') return user?.role === 'student';
            return true;
          }).map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${location.pathname === t.path ? styles.active : ''}`}
              onClick={() => navigate(t.path)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.right}>
          {!user ? (
            <div className={styles.authButtons}>
              <button className={styles.loginBtn} onClick={() => navigate('/auth')}>Login</button>
              <button className={styles.registerBtn} onClick={() => navigate('/auth')}>Register</button>
            </div>
          ) : (
            <div className={styles.userRow}>
              
              {/* Notifications Bell */}
              <div className={styles.notificationWrapper}>
                <button 
                  className={styles.bellBtn} 
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className={styles.notificationDropdown}>
                    <div className={styles.notifHeader}>
                      <h4>Notifications</h4>
                      {unreadCount > 0 && (
                        <button 
                          className={styles.markAllRead}
                          onClick={() => notifications.filter(n => !n.read).forEach(n => markAsRead(n.id))}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className={styles.notifList}>
                      {notifications.length === 0 ? (
                        <div className={styles.emptyNotif}>No new notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`${styles.notifItem} ${n.read ? styles.read : ''}`} onClick={() => markAsRead(n.id)}>
                            <div className={styles.notifIcon}>💬</div>
                            <div className={styles.notifContent}>
                              <p><strong>{n.senderEmail}</strong> sent you a message:</p>
                              <p className={styles.notifMessage}>"{n.message}"</p>
                              <button 
                                className={styles.replyBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReplyModal({ isOpen: true, recipient: n.senderEmail, text: '' });
                                }}
                              >
                                Reply
                              </button>
                            </div>
                            {!n.read && <div className={styles.unreadDot}></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.userChip} onClick={() => navigate('/profile')}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name || user.email?.split('@')[0]}</span>
                  <span className={styles.userRole}>{user.role === 'recruiter' ? '🏢 Recruiter' : '🎓 Student'}</span>
                </div>
              </div>
              
              <button className={styles.logoutBtn} onClick={onLogout} title="Log out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
              {user?.role === 'recruiter' && (
                <button className={styles.postBtn} onClick={() => navigate('/post-job')}>
                  Post Job
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className={styles.modalOverlay} onClick={() => setReplyModal({ ...replyModal, isOpen: false })}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Reply to {replyModal.recipient}</h3>
              <button className={styles.closeBtn} onClick={() => setReplyModal({ ...replyModal, isOpen: false })}>×</button>
            </div>
            <form onSubmit={handleSendReply} className={styles.modalForm}>
              <textarea 
                autoFocus
                className={styles.modalTextarea} 
                placeholder="Type your reply here..."
                value={replyModal.text}
                onChange={e => setReplyModal({ ...replyModal, text: e.target.value })}
                required
              />
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setReplyModal({ ...replyModal, isOpen: false })}>Cancel</button>
                <button type="submit" className={styles.btnSend}>Send Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
