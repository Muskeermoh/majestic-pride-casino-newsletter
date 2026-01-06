
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './NewsList.css';


const DUMMY_NEWS = [
  {
    id: 1,
    title: 'Grand Poker Night Announced!',
    content: 'Join us for a thrilling poker night with big prizes and live entertainment. Experience the best of casino gaming at Majestic Pride!',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    livestream: 'https://www.youtube.com/embed/5qap5aO4i9A',
    created_at: '2026-01-10 20:00:00',
  },
  {
    id: 2,
    title: 'Exclusive VIP High-Roller Night',
    content: 'An invitation-only evening for our VIP members with special tables, private drinks, and enhanced jackpots.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-09 19:00:00',
  },
  {
    id: 3,
    title: 'Progressive Jackpot Hits Seven Figures',
    content: 'The progressive jackpot climbed to a record amount this week — see how the lucky winner claimed the prize.',
    image: 'https://images.unsplash.com/photo-1541661538392-6b6f3d6f5b6b?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-08 14:30:00',
  },
  {
    id: 4,
    title: 'Roulette Tournament — Sign Up Now',
    content: 'Compete in our weekly roulette tournament for cash prizes and leaderboard glory.',
    image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-07 12:00:00',
  },
  {
    id: 5,
    title: 'New Blackjack Tables Launched',
    content: 'We expanded our Blackjack area with new tables and experienced dealers. Come test your strategy.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-06 16:45:00',
  },
  {
    id: 6,
    title: 'Culinary Nights — Tastes of Goa',
    content: 'Enjoy special themed menus by guest chefs every Friday night at our award-winning restaurant.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-05 18:00:00',
  },
  {
    id: 7,
    title: 'Live Music Weekend',
    content: 'Enjoy live music performances every weekend at our casino. Great games, great music, and great company!',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-04 20:00:00',
  },
  {
    id: 8,
    title: 'Member Loyalty Rewards Update',
    content: 'We updated our loyalty tiers with better benefits — check your account for upgraded rewards.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-03 09:15:00',
  },
  {
    id: 9,
    title: 'Charity Casino Night Recap',
    content: 'Thank you to everyone who attended our charity night — together we raised funds for local causes.',
    image: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-02 11:00:00',
  },
  {
    id: 10,
    title: 'Safety & Hospitality Improvements',
    content: 'We have upgraded our safety protocols and hospitality services to ensure a comfortable experience for all guests.',
    image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80',
    livestream: '',
    created_at: '2026-01-01 08:00:00',
  },
];

function NewsList() {
  const [news, setNews] = useState(DUMMY_NEWS);
  const [showLive, setShowLive] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const mainLive = news.find((n) => n.livestream);
  const liveBoxRef = React.useRef(null);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/news');
        if (response.ok) {
          const data = await response.json();
          // If backend has news, use it; otherwise keep dummy data
          if (data.length > 0) {
            // Add livestream to first news item if it doesn't have one
            const newsWithLive = data.map((item, index) => {
              if (index === 0 && !item.livestream) {
                return { ...item, livestream: 'https://www.youtube.com/embed/5qap5aO4i9A' };
              }
              return item;
            });
            setNews(newsWithLive);
          }
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        // Keep using dummy data if backend is not available
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (!liveBoxRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setMinimized(!entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(liveBoxRef.current);
    return () => observer.disconnect();
  }, [liveBoxRef]);

  return (
    <div className="news-grid-container">
      {mainLive && showLive && (
        <>
          <div
            ref={liveBoxRef}
            className={`live-tv-box live-tv-large${minimized ? ' live-tv-hidden' : ''}`}
          >
            <button className="live-tv-close" onClick={() => setShowLive(false)}>&times;</button>
            <iframe
              src={mainLive.livestream}
              title="Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{width:'100%',height:'100%',borderRadius:18}}
            ></iframe>
          </div>
          {minimized && ReactDOM.createPortal(
            <div className="live-tv-portal live-tv-box live-tv-fixed live-tv-mini" aria-hidden={false}>
              <button className="live-tv-close" onClick={() => setShowLive(false)}>&times;</button>
              <iframe
                src={mainLive.livestream}
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{width:'100%',height:'100%',borderRadius:12}}
              ></iframe>
            </div>,
            document.body
          )}
        </>
      )}
      <div className="news-grid">
        {news.map((item, index) => (
          <div key={item.id} className="news-card" style={{ ['--delay']: `${index * 80}ms` }}>
            <img src={item.image} alt={item.title} className="news-image" />
            <div className="news-content">
              <h2 className="news-title">{item.title}</h2>
              <p className="news-date">{new Date(item.created_at).toLocaleString()}</p>
              <p className="news-text news-text-truncated">{item.content}</p>
              <button className="read-more-btn" onClick={() => setSelectedNews(item)}>
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <footer className="newsletter-footer">
        <div className="footer-content">
          <div className="social-icons">
            <span className="social-icon">📘</span>
            <span className="social-icon">📷</span>
            <span className="social-icon">🐦</span>
            <span className="social-icon">▶️</span>
          </div>
          <p className="footer-date">&copy; {new Date().getFullYear()} Majestic Pride Casino</p>
        </div>
      </footer>
      
      {selectedNews && (
        <div className="news-modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNews(null)}>&times;</button>
            <img src={selectedNews.image} alt={selectedNews.title} className="modal-image" />
            <div className="modal-content">
              <h2 className="modal-title">{selectedNews.title}</h2>
              <p className="modal-date">{new Date(selectedNews.created_at).toLocaleString()}</p>
              <p className="modal-text">{selectedNews.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsList;
