import React from 'react';
import styles from './CoursesPage.module.css';
import { COURSES } from '../data';

export default function CoursesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Certification Courses</h1>
        <p>Upskill yourself with placement-guaranteed courses</p>
      </header>

      <div className={styles.courseGrid}>
        {COURSES.map(course => (
          <div key={course.id} className={styles.courseCard}>
            {course.badge && <span className={styles.badge}>{course.badge}</span>}
            <div className={styles.courseImg}>{course.img}</div>
            <div className={styles.courseContent}>
              <h3>{course.title}</h3>
              <p className={styles.provider}>{course.provider}</p>
              <div className={styles.meta}>
                <span>⏱ {course.duration}</span>
                <span>⭐ {course.rating}</span>
              </div>
              <div className={styles.footer}>
                <span className={styles.price}>{course.price}</span>
                <button className={styles.enrollBtn}>Enroll Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
