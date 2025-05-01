const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../db/db');

// Add to cart
router.post('/add', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.body;
  db.query('INSERT INTO cart (user_id, book_id) VALUES (?, ?)', [userId, bookId], err => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json({ message: 'Book added to cart' });
  });
});

// Get cart items
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT b.id, b.title, b.author, b.price FROM cart c
    JOIN books b ON c.book_id = b.id WHERE c.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error' });
    res.json(results);
  });
});

module.exports = router;
