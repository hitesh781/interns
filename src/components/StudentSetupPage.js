import React, { useState } from 'react';
import styles from './StudentSetupPage.module.css';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase';

const db = getFirestore(app);

export default function StudentSetupPage({ user, onComplete }) {
  const [form, setForm] = useState({
    college: '',
    degree: '',
    year: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.college || !form.degree || !form.skills) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        college: form.college,
        degree: form.degree,
        gradYear: form.year,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s),
        hasResume: true
      });
      
      // Pass the updated user data back up
      onComplete({
        ...user,
        college: form.college,
        degree: form.degree,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s),
        hasResume: true
      });
    } catch (err) {
      console.error("Error saving resume details:", err);
      alert("Failed to save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>📄</div>
        <h2 className={styles.title}>Let's build your profile</h2>
        <p className={styles.sub}>
          Recruiters need to see your skills and education before you can apply for jobs.
        </p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>College / University *</label>
            <input 
              className={styles.input} 
              type="text" 
              name="college"
              placeholder="e.g. Stanford University"
              value={form.college}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Degree *</label>
            <input 
              className={styles.input} 
              type="text" 
              name="degree"
              placeholder="e.g. B.S. Computer Science"
              value={form.degree}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Graduation Year</label>
            <input 
              className={styles.input} 
              type="text" 
              name="year"
              placeholder="e.g. 2025"
              value={form.year}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Top Skills (Comma Separated) *</label>
            <textarea 
              className={styles.textarea} 
              name="skills"
              placeholder="e.g. JavaScript, React, Python, UI Design"
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
