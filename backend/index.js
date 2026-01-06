const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = 'majesticpride_secret';

app.use(cors());
app.use(bodyParser.json());

// SQLite DB setup
const db = new sqlite3.Database('./newsletter.db', (err) => {
  if (err) console.error('DB error:', err);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    livestream TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

// API Routes

// GET all news (sorted by created_at DESC - latest first)
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST new news item (with server-side validation)
app.post('/api/news', (req, res) => {
  const { title, content, image, livestream } = req.body;

  // Server-side validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
  }
  if (!image || typeof image !== 'string' || image.trim().length === 0) {
    return res.status(400).json({ error: 'Image URL is required and must be a non-empty string' });
  }
  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Title must be 200 characters or less' });
  }
  if (content.trim().length > 2000) {
    return res.status(400).json({ error: 'Content must be 2000 characters or less' });
  }

  const sql = 'INSERT INTO news (title, content, image, livestream) VALUES (?, ?, ?, ?)';
  db.run(sql, [title.trim(), content.trim(), image.trim(), livestream || ''], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create news' });
    }
    res.status(201).json({
      id: this.lastID,
      title: title.trim(),
      content: content.trim(),
      image: image.trim(),
      livestream: livestream || '',
      created_at: new Date().toISOString()
    });
  });
});

// DELETE news item by id
app.delete('/api/news/:id', (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Valid news ID is required' });
  }

  db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete news' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  });
});

// UPDATE news item by id
app.put('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;

  // Validation
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Valid news ID is required' });
  }
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
  }
  if (!image || typeof image !== 'string' || image.trim().length === 0) {
    return res.status(400).json({ error: 'Image URL is required and must be a non-empty string' });
  }
  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Title must be 200 characters or less' });
  }
  if (content.trim().length > 2000) {
    return res.status(400).json({ error: 'Content must be 2000 characters or less' });
  }

  const sql = 'UPDATE news SET title = ?, content = ?, image = ? WHERE id = ?';
  db.run(sql, [title.trim(), content.trim(), image.trim(), id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update news' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    // Fetch updated news item
    db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch updated news' });
      }
      res.json(row);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
