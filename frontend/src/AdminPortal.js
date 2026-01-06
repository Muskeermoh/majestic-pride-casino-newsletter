import React, { useState, useEffect } from 'react';
import './AdminPortal.css';

function AdminPortal() {
  const [form, setForm] = useState({ title: '', image: '', content: '' });
  const [news, setNews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch news from backend when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNews();
    }
  }, [isLoggedIn]);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/news');
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
  };

  // Hardcoded login for demo
  const handleLogin = (e) => {
    e.preventDefault();
    if (form.title === 'admin' && form.image === 'admin') {
      setIsLoggedIn(true);
      setForm({ title: '', image: '', content: '' });
      setError('');
    } else {
      setError('Invalid credentials. Use admin/admin');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image || !form.content) {
      setError('All fields are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (editingId) {
        // Update existing news
        const response = await fetch(`http://localhost:4000/api/news/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            content: form.content,
            image: form.image
          })
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update news');
        }
        
        const updatedNews = await response.json();
        setNews(news.map(item => item.id === editingId ? updatedNews : item));
        setEditingId(null);
      } else {
        // Add new news
        const response = await fetch('http://localhost:4000/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            content: form.content,
            image: form.image,
            livestream: ''
          })
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to add news');
        }
        
        const newNews = await response.json();
        setNews([newNews, ...news]);
      }
      setForm({ title: '', image: '', content: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      image: item.image,
      content: item.content
    });
    setEditingId(item.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm({ title: '', image: '', content: '' });
    setEditingId(null);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/news/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to delete news');
      }
      
      setNews(news.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="text"
            name="title"
            placeholder="Username"
            value={form.title}
            onChange={handleChange}
            autoComplete="username"
          />
          <input
            type="password"
            name="image"
            placeholder="Password"
            value={form.image}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
          {error && <div className="admin-error">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-portal-box">
      <h2>{editingId ? 'Edit News' : 'Add News'}</h2>
      <form onSubmit={handleAddNews} className="admin-news-form">
        <input
          type="text"
          name="title"
          placeholder="News Heading"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="News Content"
          value={form.content}
          onChange={handleChange}
          rows={4}
        />
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update News' : 'Add News')}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-news-list">
        {news.map((item) => (
          <div key={item.id} className="admin-news-item">
            <img src={item.image} alt={item.title} />
            <div className="admin-news-content">
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <div className="admin-news-actions">
                <button onClick={() => handleEdit(item)} className="edit-btn">✏️ Edit</button>
                <button onClick={() => handleDelete(item.id)} className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPortal;
