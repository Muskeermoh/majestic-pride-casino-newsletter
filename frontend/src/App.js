

import React, { useState } from 'react';
import NewsList from './NewsList';
import AdminPortal from './AdminPortal';

function App() {
  const [view, setView] = useState('news');
  return (
    <div className="App">
      <h1>Majestic Pride Casino Newsletter</h1>
      <div style={{textAlign:'center', marginBottom:32, position:'relative', zIndex:1}}>
        <button
          style={{
            background: view === 'news' ? 'linear-gradient(135deg, #8b2e2e 0%, #a63838 100%)' : 'linear-gradient(135deg, rgba(255,250,245,0.95) 0%, rgba(255,243,234,0.9) 100%)',
            color: view === 'news' ? '#fff' : '#7b2b2b',
            border: view === 'news' ? '2px solid #a63838' : '2px solid #e6c8a0',
            borderRadius: 12,
            padding: '14px 32px',
            fontWeight: '600',
            marginRight: 16,
            cursor: 'pointer',
            fontSize: '1.05rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: view === 'news' ? '0 6px 20px rgba(139,46,46,0.35), 0 2px 8px rgba(139,46,46,0.2)' : '0 2px 8px rgba(139,46,46,0.08)',
            letterSpacing: '0.8px',
            transform: view === 'news' ? 'translateY(-2px) scale(1.02)' : 'none',
            fontFamily: 'Poppins, sans-serif',
          }}
          onClick={() => setView('news')}
          onMouseOver={(e) => {
            if (view !== 'news') {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,247,239,1) 0%, rgba(255,240,230,1) 100%)';
              e.currentTarget.style.borderColor = '#d69a57';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,46,46,0.12)';
            }
          }}
          onMouseOut={(e) => {
            if (view !== 'news') {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,250,245,0.95) 0%, rgba(255,243,234,0.9) 100%)';
              e.currentTarget.style.borderColor = '#e6c8a0';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,46,46,0.08)';
            }
          }}
        >
          📰 Newsletter
        </button>
        <button
          style={{
            background: view === 'admin' ? 'linear-gradient(135deg, #8b2e2e 0%, #a63838 100%)' : 'linear-gradient(135deg, rgba(255,250,245,0.95) 0%, rgba(255,243,234,0.9) 100%)',
            color: view === 'admin' ? '#fff' : '#7b2b2b',
            border: view === 'admin' ? '2px solid #a63838' : '2px solid #e6c8a0',
            borderRadius: 12,
            padding: '14px 32px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1.05rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: view === 'admin' ? '0 6px 20px rgba(139,46,46,0.35), 0 2px 8px rgba(139,46,46,0.2)' : '0 2px 8px rgba(139,46,46,0.08)',
            letterSpacing: '0.8px',
            transform: view === 'admin' ? 'translateY(-2px) scale(1.02)' : 'none',
            fontFamily: 'Poppins, sans-serif',
          }}
          onClick={() => setView('admin')}
          onMouseOver={(e) => {
            if (view !== 'admin') {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,247,239,1) 0%, rgba(255,240,230,1) 100%)';
              e.currentTarget.style.borderColor = '#d69a57';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,46,46,0.12)';
            }
          }}
          onMouseOut={(e) => {
            if (view !== 'admin') {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,250,245,0.95) 0%, rgba(255,243,234,0.9) 100%)';
              e.currentTarget.style.borderColor = '#e6c8a0';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,46,46,0.08)';
            }
          }}
        >
          🔐 Admin Portal
        </button>
      </div>
      {view === 'news' ? <NewsList /> : <AdminPortal />}
    </div>
  );
}

export default App;
