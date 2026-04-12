import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toast}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {message}
    </div>
  );
}
