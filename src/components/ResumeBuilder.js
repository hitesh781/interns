import React, { useState, useRef } from 'react';
import styles from './ResumeBuilder.module.css';
import { useReactToPrint } from 'react-to-print';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API (User needs to set REACT_APP_GEMINI_API_KEY in .env)
// We check if it exists to prevent crashes if they haven't set it yet
const genAI = process.env.REACT_APP_GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY)
  : null;

export default function ResumeBuilder({ user }) {
  const componentRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'My_Resume',
  });

  const [resume, setResume] = useState({
    personal: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      linkedin: '',
      github: '',
    },
    education: [
      { id: 1, degree: 'B.Tech in Computer Science', college: 'XYZ University', year: '2020 - 2024', grade: '8.5 CGPA' }
    ],
    experience: [
      { id: 1, role: 'Software Engineer Intern', company: 'Tech Corp', duration: 'May 2023 - Aug 2023', desc: 'Worked on frontend.' }
    ],
    projects: [
      { id: 1, title: 'E-commerce App', tech: 'React, Node.js', desc: 'Built a full-stack e-commerce application.' }
    ],
    skills: 'JavaScript, React, Node.js, Python, SQL'
  });

  const [enhancing, setEnhancing] = useState(null);

  // Handlers for personal info
  const handlePersonal = (field, value) => {
    setResume(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  // Handlers for list items (edu, exp, proj)
  const addListItem = (type, defaultItem) => {
    setResume(prev => ({ ...prev, [type]: [...prev[type], { id: Date.now(), ...defaultItem }] }));
  };

  const updateListItem = (type, id, field, value) => {
    setResume(prev => ({
      ...prev,
      [type]: prev[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeListItem = (type, id) => {
    setResume(prev => ({ ...prev, [type]: prev[type].filter(item => item.id !== id) }));
  };

  // AI Enhance Feature
  const enhanceDescription = async (type, id, currentDesc, roleOrTitle) => {
    if (!genAI) {
      alert("Please configure REACT_APP_GEMINI_API_KEY in your .env file to use AI features.");
      return;
    }
    if (!currentDesc.trim()) {
      alert("Please write a brief description first so the AI has context.");
      return;
    }

    setEnhancing(id);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Rewrite the following description for a resume to be more professional, action-oriented, and impactful. Focus on achievements and structure it as 2-3 bullet points. The role/project title is "${roleOrTitle}".\n\nOriginal draft:\n${currentDesc}`;
      
      const result = await model.generateContent(prompt);
      const enhancedText = result.response.text();
      
      // Clean up markdown bold markers if any
      const cleanText = enhancedText.replace(/\*\*/g, '').trim();
      updateListItem(type, id, 'desc', cleanText);
    } catch (err) {
      console.error(err);
      alert("Failed to enhance text using AI. Check console for details.");
    } finally {
      setEnhancing(null);
    }
  };

  return (
    <div className={styles.page}>
      
      {/* LEFT: Editor Form */}
      <div className={styles.editor}>
        <h2 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Build Your Resume
        </h2>

        {/* Personal Details */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Personal Details</h3>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input className={styles.input} value={resume.personal.name} onChange={e => handlePersonal('name', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} value={resume.personal.email} onChange={e => handlePersonal('email', e.target.value)} />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input className={styles.input} value={resume.personal.phone} onChange={e => handlePersonal('phone', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>LinkedIn URL</label>
              <input className={styles.input} value={resume.personal.linkedin} onChange={e => handlePersonal('linkedin', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Education</h3>
            <button className={styles.addBtn} onClick={() => addListItem('education', { degree: '', college: '', year: '', grade: '' })}>+ Add</button>
          </div>
          {resume.education.map(edu => (
            <div key={edu.id} className={styles.itemCard}>
              <button className={styles.removeBtn} onClick={() => removeListItem('education', edu.id)}>×</button>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Degree / Program</label>
                  <input className={styles.input} value={edu.degree} onChange={e => updateListItem('education', edu.id, 'degree', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>College / School</label>
                  <input className={styles.input} value={edu.college} onChange={e => updateListItem('education', edu.id, 'college', e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Year (e.g. 2020-2024)</label>
                  <input className={styles.input} value={edu.year} onChange={e => updateListItem('education', edu.id, 'year', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Grade / CGPA</label>
                  <input className={styles.input} value={edu.grade} onChange={e => updateListItem('education', edu.id, 'grade', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Work Experience</h3>
            <button className={styles.addBtn} onClick={() => addListItem('experience', { role: '', company: '', duration: '', desc: '' })}>+ Add</button>
          </div>
          {resume.experience.map(exp => (
            <div key={exp.id} className={styles.itemCard}>
              <button className={styles.removeBtn} onClick={() => removeListItem('experience', exp.id)}>×</button>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Job Title / Role</label>
                  <input className={styles.input} value={exp.role} onChange={e => updateListItem('experience', exp.id, 'role', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Company</label>
                  <input className={styles.input} value={exp.company} onChange={e => updateListItem('experience', exp.id, 'company', e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Duration</label>
                  <input className={styles.input} value={exp.duration} onChange={e => updateListItem('experience', exp.id, 'duration', e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <div className={styles.descWrap}>
                  <textarea 
                    className={styles.textarea} 
                    value={exp.desc} 
                    onChange={e => updateListItem('experience', exp.id, 'desc', e.target.value)} 
                    placeholder="Briefly describe what you did..."
                  />
                  <button 
                    className={styles.aiBtn} 
                    onClick={() => enhanceDescription('experience', exp.id, exp.desc, exp.role)}
                    disabled={enhancing === exp.id}
                  >
                    ✨ {enhancing === exp.id ? 'Enhancing...' : 'Enhance with AI'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Projects</h3>
            <button className={styles.addBtn} onClick={() => addListItem('projects', { title: '', tech: '', desc: '' })}>+ Add</button>
          </div>
          {resume.projects.map(proj => (
            <div key={proj.id} className={styles.itemCard}>
              <button className={styles.removeBtn} onClick={() => removeListItem('projects', proj.id)}>×</button>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Project Title</label>
                  <input className={styles.input} value={proj.title} onChange={e => updateListItem('projects', proj.id, 'title', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Tech Stack</label>
                  <input className={styles.input} value={proj.tech} onChange={e => updateListItem('projects', proj.id, 'tech', e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <div className={styles.descWrap}>
                  <textarea 
                    className={styles.textarea} 
                    value={proj.desc} 
                    onChange={e => updateListItem('projects', proj.id, 'desc', e.target.value)} 
                  />
                  <button 
                    className={styles.aiBtn} 
                    onClick={() => enhanceDescription('projects', proj.id, proj.desc, proj.title)}
                    disabled={enhancing === proj.id}
                  >
                    ✨ {enhancing === proj.id ? 'Enhancing...' : 'Enhance with AI'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Skills</h3>
          </div>
          <div className={styles.field}>
            <textarea 
              className={styles.textarea} 
              value={resume.skills} 
              onChange={e => setResume(prev => ({ ...prev, skills: e.target.value }))} 
              placeholder="e.g. JavaScript, React, Python, Data Analysis (Comma separated)"
            />
          </div>
        </div>

      </div>

      {/* RIGHT: Live Preview */}
      <div className={styles.previewWrap}>
        <div className={styles.previewHeader}>
          <h2 className={styles.previewTitle}>Live Preview</h2>
          <button className={styles.downloadBtn} onClick={handlePrint}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
        </div>
        
        <div className={styles.previewArea}>
          {/* Printable A4 Resume */}
          <div className={styles.a4} ref={componentRef}>
            
            <div className={styles.resHeader}>
              <h1 className={styles.resName}>{resume.personal.name || 'Your Name'}</h1>
              <div className={styles.resContact}>
                {resume.personal.email && <span>{resume.personal.email}</span>}
                {resume.personal.phone && <span>• {resume.personal.phone}</span>}
                {resume.personal.linkedin && <span>• {resume.personal.linkedin}</span>}
              </div>
            </div>

            {resume.education.length > 0 && (
              <div className={styles.resSection}>
                <h3 className={styles.resSectionTitle}>Education</h3>
                {resume.education.map(edu => (
                  <div key={edu.id} className={styles.resItem}>
                    <div className={styles.resItemHeader}>
                      <span className={styles.resItemTitle}>{edu.degree}</span>
                      <span className={styles.resItemDate}>{edu.year}</span>
                    </div>
                    <div className={styles.resItemHeader}>
                      <span className={styles.resItemSub}>{edu.college}</span>
                      {edu.grade && <span className={styles.resItemSub}>Grade: {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resume.experience.length > 0 && (
              <div className={styles.resSection}>
                <h3 className={styles.resSectionTitle}>Experience</h3>
                {resume.experience.map(exp => (
                  <div key={exp.id} className={styles.resItem}>
                    <div className={styles.resItemHeader}>
                      <span className={styles.resItemTitle}>{exp.role}</span>
                      <span className={styles.resItemDate}>{exp.duration}</span>
                    </div>
                    <div className={styles.resItemHeader}>
                      <span className={styles.resItemSub}>{exp.company}</span>
                    </div>
                    {exp.desc && <div className={styles.resDesc}>{exp.desc}</div>}
                  </div>
                ))}
              </div>
            )}

            {resume.projects.length > 0 && (
              <div className={styles.resSection}>
                <h3 className={styles.resSectionTitle}>Projects</h3>
                {resume.projects.map(proj => (
                  <div key={proj.id} className={styles.resItem}>
                    <div className={styles.resItemHeader}>
                      <span className={styles.resItemTitle}>{proj.title} {proj.tech && `| ${proj.tech}`}</span>
                    </div>
                    {proj.desc && <div className={styles.resDesc}>{proj.desc}</div>}
                  </div>
                ))}
              </div>
            )}

            {resume.skills && (
              <div className={styles.resSection}>
                <h3 className={styles.resSectionTitle}>Skills</h3>
                <div className={styles.resSkills}>{resume.skills}</div>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
