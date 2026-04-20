import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase';
import styles from './RecruiterSetupPage.module.css';

const db = getFirestore(app);

// ── Input Field Component ──
function Field({ label, type = 'text', placeholder, value, onChange, name, disabled, isTextarea }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {isTextarea ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          disabled={disabled}
          required={!disabled}
        />
      ) : (
        <input
          className={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          disabled={disabled}
          required={!disabled}
        />
      )}
    </div>
  );
}

export default function RecruiterSetupPage({ user, onComplete }) {
  const [form, setForm] = useState({
    designation: '',
    mobile: '',
    isIndependent: false,
    orgName: '',
    orgWebsite: '',
    about: '',
    city: '',
    industry: '',
    employees: '0-1',
    verificationMethod: 'website'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validations
    if (!form.designation || !form.mobile || !form.about || !form.city || !form.industry) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (!form.isIndependent && (!form.orgName || !form.orgWebsite)) {
      setError('Please provide organization name and website, or check independent practitioner.');
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      
      const setupData = {
        setupComplete: true,
        designation: form.designation,
        mobile: form.mobile,
        isIndependent: form.isIndependent,
        organizationName: form.isIndependent ? 'Independent Practitioner' : form.orgName,
        organizationWebsite: form.isIndependent ? '' : form.orgWebsite,
        about: form.about,
        city: form.city,
        industry: form.industry,
        employees: form.employees,
        verificationMethod: form.verificationMethod,
        updatedAt: new Date()
      };

      await updateDoc(userRef, setupData);
      
      // Pass the complete user object back to App with updated status
      onComplete({ ...user, ...setupData });
      
    } catch (err) {
      console.error(err);
      setError('Failed to save details. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.bgOrb1}/>
        <div className={styles.bgOrb2}/>
        <div className={styles.bgGrid}/>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Complete Your Profile</h2>
          <p className={styles.formSub}>
            Please provide your organization and verification details to start posting jobs.
          </p>
        </div>

        <form className={styles.formInner} onSubmit={handleSubmit}>
          
          <div className={styles.row2}>
            <Field
              label="Personal Designation"
              name="designation"
              placeholder="e.g. HR Manager, Founder"
              value={form.designation}
              onChange={set}
            />
            <Field
              label="Mobile Number"
              name="mobile"
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={form.mobile}
              onChange={set}
            />
          </div>

          <label className={styles.checkboxWrap}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={form.isIndependent}
              onChange={(e) => {
                set('isIndependent', e.target.checked);
                if (e.target.checked) {
                  set('orgName', '');
                  set('orgWebsite', '');
                }
              }}
            />
            <span className={styles.checkboxText}>
              I am an independent practitioner (freelancer, architect, lawyer etc.) hiring for myself and I am NOT hiring on behalf of a company.
            </span>
          </label>

          {!form.isIndependent && (
            <div className={styles.row2}>
              <Field
                label="Organization Name"
                name="orgName"
                placeholder="e.g. InternsBridge"
                value={form.orgName}
                onChange={set}
              />
              <Field
                label="Organization Website"
                name="orgWebsite"
                type="url"
                placeholder="http://internsbridge.com"
                value={form.orgWebsite}
                onChange={set}
              />
            </div>
          )}

          <Field
            label="About yourself and what you do"
            name="about"
            placeholder="Tell us a little about your role and the organization..."
            value={form.about}
            onChange={set}
            isTextarea
          />

          <div className={styles.row2}>
            <Field
              label="City"
              name="city"
              placeholder="e.g. Mumbai"
              value={form.city}
              onChange={set}
            />
            
            <div className={styles.field}>
              <label className={styles.label}>Industry</label>
              <select 
                className={`${styles.input} ${styles.select}`}
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                required
              >
                <option value="">Select industry</option>
                <option value="IT/Software">IT / Software</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing / Advertising</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Legal">Legal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>No. of Employees</label>
            <select 
              className={`${styles.input} ${styles.select}`}
              value={form.employees}
              onChange={e => set('employees', e.target.value)}
            >
              <option value="0-1">0-1</option>
              <option value="2-10">2-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          <div className={styles.field} style={{ marginTop: '10px' }}>
            <label className={styles.label}>Account Verification</label>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Using any one of the options below, get your account verified and start posting internships/jobs.
            </p>
            
            <div className={styles.radioGroup}>
              {[
                { id: 'website', label: 'I have an active and functional website', sub: 'Verify using your active & functional website' },
                { id: 'social', label: 'I have an active social media page', sub: 'Connect your organization/founder\'s LinkedIn or other social media profile (with minimum ~1000 followers) of which you are an admin' },
                { id: 'license', label: 'I have a business/practice license', sub: 'Verify using any government issued document' },
                { id: 'none', label: 'I have none of the above', sub: '' }
              ].map(opt => (
                <label 
                  key={opt.id} 
                  className={`${styles.radioCard} ${form.verificationMethod === opt.id ? styles.radioCardActive : ''}`}
                >
                  <input
                    type="radio"
                    name="verificationMethod"
                    className={styles.radioInput}
                    checked={form.verificationMethod === opt.id}
                    onChange={() => set('verificationMethod', opt.id)}
                  />
                  <div>
                    <span className={styles.radioText}>{opt.label}</span>
                    {opt.sub && <span className={styles.radioSub}>{opt.sub}</span>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
            disabled={loading}
          >
            {loading ? "Saving Details..." : "Complete Setup"}
          </button>
          
        </form>
      </div>
    </div>
  );
}
