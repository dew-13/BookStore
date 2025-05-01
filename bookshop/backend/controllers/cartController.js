const db = require('../db/db');

// Add book to cart (with quantity handling)
exports.addToCart = (req, res) => {
  const { book_id, quantity } = req.body;
  const user_id = req.user.id;

  db.query(
    `INSERT INTO cart (user_id, book_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
    [user_id, book_id, quantity, quantity],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Book added to cart' });
    }
  );
};

// Get all items in the cart
exports.getCart = (req, res) => {
  const user_id = req.user.id;

  const query = `
    SELECT c.id AS cart_id, b.id AS book_id, b.title, b.author, b.price, c.quantity
    FROM cart c
    JOIN books b ON c.book_id = b.id
    WHERE c.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// Remove specific item from cart by cart_id
exports.removeFromCart = (req, res) => {
  const { cart_id } = req.params;

  db.query('DELETE FROM cart WHERE id = ?', [cart_id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Item removed from cart' });
  });
};
