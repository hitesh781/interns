import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 70px)', // Adjusting for typical navbar height
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '16px', fontWeight: 'bold' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#e5e5e5' }}>Page Not Found</h2>
      <p style={{ color: '#a3a3a3', marginBottom: '32px', maxWidth: '400px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/"
        style={{
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
      >
        Return to Home
      </Link>
    </div>
  );
}
