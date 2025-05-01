const db = require('../db/db');

exports.addToCart = (req, res) => {
  const { book_id, quantity } = req.body;
  const user_id = req.user.id;

  db.query('INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?', 
    [user_id, book_id, quantity, quantity], 
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Book added to cart' });
    }
  );
};

exports.getCart = (req, res) => {
  const user_id = req.user.id;
  const query = `
    SELECT c.id, b.title, b.author, b.price, c.quantity
    FROM cart c
    JOIN books b ON c.book_id = b.id
    WHERE c.user_id = ?
  `;
  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.removeFromCart = (req, res) => {
  const { cart_id } = req.params;
  db.query('DELETE FROM cart WHERE id = ?', [cart_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Item removed' });
  });
};
