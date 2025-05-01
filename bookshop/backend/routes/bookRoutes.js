const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
    const books = result.data.items.map(item => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      price: (Math.random() * 30 + 10).toFixed(2),
      description: item.volumeInfo.description || 'No description',
      stock: Math.floor(Math.random() * 10 + 1)
    }));
    res.json(books);
  } catch {
    res.status(500).json({ error: 'Book fetch failed' });
  }
});

module.exports = router;
