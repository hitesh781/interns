import React from 'react';
import styles from './LandingPage.module.css';

export default function LandingPage({ setPage }) {
  const [activeChip, setActiveChip] = React.useState('Big brands');
  
  const chips = [
    'Big brands', 'Work from home', 'Part-time', 'MBA', 
    'Engineering', 'Media', 'Design', 'Data Science'
  ];

  const jobsData = {
    'Big brands': [
      { title: 'Accountant', company: 'Zucol Solutions Private Limited', location: 'Jaipur', salary: '₹ 2,70,000 - 5,50,000 /year', logo: '' },
      { title: 'Car Expert', company: 'Cars24 Services Private Limited', location: 'Bangalore', salary: '₹ 3,10,000 - 4,50,000 /year', logo: 'CARS24' },
      { title: 'Sales Associate', company: 'Cars24 Services Private Limited', location: 'Pune', salary: '₹ 3,60,000 - 4,50,000 /year', logo: 'CARS24' },
      { title: 'Content Specialist', company: 'JADES', location: 'Mumbai', salary: '₹ 2,00,000 - 2,16,000 /year', logo: '' }
    ],
    'Work from home': [
      { title: 'Customer Support Executive', company: 'TechNova', location: 'Remote', salary: '₹ 1,50,000 - 3,000,000 /year', logo: 'TN' },
      { title: 'Content Writer', company: 'Blogosphere', location: 'Remote', salary: '₹ 2,00,000 - 4,00,000 /year', logo: '' },
      { title: 'Telesales Representative', company: 'Connect India', location: 'Remote', salary: '₹ 1,80,000 - 2,50,000 /year', logo: 'CI' },
      { title: 'Social Media Manager', company: 'Viral Media', location: 'Remote', salary: '₹ 3,00,000 - 5,00,000 /year', logo: '' }
    ],
    'Part-time': [
      { title: 'Data Entry Operator', company: 'QuickData', location: 'Delhi', salary: '₹ 10,000 - 15,000 /month', logo: '' },
      { title: 'Campus Ambassador', company: 'EduTech Corp', location: 'Various', salary: 'Performance Based', logo: 'EDU' },
      { title: 'Virtual Assistant', company: 'Busy Entrepreneurs', location: 'Remote', salary: '₹ 12,000 /month', logo: '' },
      { title: 'Event Coordinator', company: 'PlanIt', location: 'Mumbai', salary: '₹ 800 /day', logo: '' }
    ],
    'MBA': [
      { title: 'Management Trainee', company: 'Reliance Industries', location: 'Mumbai', salary: '₹ 8,00,000 - 12,00,000 /year', logo: 'RIL' },
      { title: 'Business Analyst', company: 'McKinsey & Co', location: 'Gurgaon', salary: '₹ 15,00,000+ /year', logo: 'McK' },
      { title: 'Marketing Manager', company: 'Hindustan Unilever', location: 'Bangalore', salary: '₹ 10,00,000 - 14,00,000 /year', logo: 'HUL' },
      { title: 'Operations Executive', company: 'Amazon', location: 'Hyderabad', salary: '₹ 7,00,000 - 9,00,000 /year', logo: 'AMZ' }
    ],
    'Engineering': [
      { title: 'Software Developer', company: 'TCS', location: 'Pune', salary: '₹ 3,50,000 - 4,50,000 /year', logo: 'TCS' },
      { title: 'Mechanical Engineer', company: 'L&T', location: 'Chennai', salary: '₹ 4,00,000 - 6,00,000 /year', logo: 'L&T' },
      { title: 'Frontend Developer', company: 'Infosys', location: 'Bangalore', salary: '₹ 3,60,000 - 5,00,000 /year', logo: 'INF' },
      { title: 'QA Tester', company: 'Wipro', location: 'Hyderabad', salary: '₹ 3,50,000 /year', logo: 'WIP' }
    ],
    'Media': [
      { title: 'Video Editor', company: 'CineMinds', location: 'Mumbai', salary: '₹ 3,00,000 - 5,00,000 /year', logo: '' },
      { title: 'Journalist', company: 'Daily News', location: 'Delhi', salary: '₹ 4,00,000 - 6,00,000 /year', logo: 'DN' },
      { title: 'PR Executive', company: 'Ogilvy', location: 'Bangalore', salary: '₹ 3,50,000 - 4,50,000 /year', logo: '' },
      { title: 'Copywriter', company: 'AdWorks', location: 'Pune', salary: '₹ 2,50,000 - 4,00,000 /year', logo: 'AW' }
    ],
    'Design': [
      { title: 'UI/UX Designer', company: 'DesignStudio', location: 'Bangalore', salary: '₹ 5,00,000 - 8,00,000 /year', logo: 'DS' },
      { title: 'Graphic Designer', company: 'Creative Heads', location: 'Remote', salary: '₹ 3,00,000 - 4,50,000 /year', logo: '' },
      { title: 'Product Designer', company: 'InnovateX', location: 'Hyderabad', salary: '₹ 6,00,000 - 9,00,000 /year', logo: 'INX' },
      { title: 'Illustrator', company: 'ArtHub', location: 'Mumbai', salary: '₹ 3,00,000 - 5,00,000 /year', logo: '' }
    ],
    'Data Science': [
      { title: 'Data Analyst', company: 'Fractal Analytics', location: 'Gurgaon', salary: '₹ 6,00,000 - 9,00,000 /year', logo: 'FA' },
      { title: 'Machine Learning Engineer', company: 'MuSigma', location: 'Bangalore', salary: '₹ 8,00,000 - 12,00,000 /year', logo: 'MS' },
      { title: 'Data Scientist', company: 'IBM', location: 'Pune', salary: '₹ 10,00,000+ /year', logo: 'IBM' },
      { title: 'Business Intelligence Analyst', company: 'Accenture', location: 'Mumbai', salary: '₹ 5,00,000 - 7,00,000 /year', logo: 'ACN' }
    ]
  };

  const activeJobs = jobsData[activeChip] || jobsData['Big brands'];

  return (
    <div className={styles.landingContainer}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Make your dream career a reality</h1>
          <p className={styles.subtitle}>Trending internships and jobs from top global companies.</p>
          <div className={styles.searchBox}>
            <input type="text" placeholder="What are you looking for?" />
            <button className={styles.searchBtn} onClick={() => setPage('student')}>Search</button>
          </div>
        </div>
      </header>
      
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>300K+</h3>
          <p>Companies hiring</p>
        </div>
        <div className={styles.statCard}>
          <h3>10K+</h3>
          <p>New openings everyday</p>
        </div>
        <div className={styles.statCard}>
          <h3>21M+</h3>
          <p>Active candidates</p>
        </div>
      </section>

      <section className={styles.lookingForSection}>
        <h2 className={styles.lookingForTitle}>What are you looking for today?</h2>
        <h3 className={styles.fresherJobsTitle}>Fresher Jobs</h3>
        
        <div className={styles.chipContainer}>
          {chips.map(chip => (
            <button 
              key={chip}
              className={`${styles.chip} ${activeChip === chip ? styles.active : ''}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className={styles.jobCardGrid}>
          {activeJobs.map((job, index) => (
            <div key={index} className={styles.jobCard}>
              <div className={styles.jobCardHeader}>
                <div className={styles.hiringTag}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Actively hiring
                </div>
                {job.logo && <div className={styles.companyLogoPlaceholder}>{job.logo}</div>}
              </div>
              <h4 className={styles.jobTitle}>{job.title}</h4>
              <p className={styles.companyName}>{job.company}</p>
              <div className={styles.jobDetails}>
                <div className={styles.detailItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location}
                </div>
                <div className={styles.detailItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M17 12h.01M7 12h.01"/></svg>
                  {job.salary}
                </div>
              </div>
              <div className={styles.jobCardFooter}>
                <span className={styles.jobType}>Job</span>
                <span className={styles.viewDetails} onClick={() => setPage('student')}>View details &gt;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.trendingSection}>
        <h2>Trending Internships & Jobs</h2>
        <div className={styles.cardGrid}>
          <div className={styles.placeholderCard} onClick={() => setPage('student')}>
            <h4>Software Engineering Intern</h4>
            <p>Google • Remote</p>
            <span>View Details &rarr;</span>
          </div>
          <div className={styles.placeholderCard} onClick={() => setPage('student')}>
            <h4>Product Designer</h4>
            <p>Stripe • San Francisco</p>
            <span>View Details &rarr;</span>
          </div>
          <div className={styles.placeholderCard} onClick={() => setPage('student')}>
            <h4>Data Analyst Intern</h4>
            <p>Spotify • Stockholm</p>
            <span>View Details &rarr;</span>
          </div>
        </div>
      </section>
    </div>
  );
}
