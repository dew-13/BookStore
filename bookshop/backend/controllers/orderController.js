const db = require('../db/db');

exports.checkout = (req, res) => {
  const user_id = req.user.id;
  db.query('SELECT * FROM cart WHERE user_id = ?', [user_id], (err, cartItems) => {
    if (err || cartItems.length === 0) return res.status(400).json({ error: 'Cart empty' });

    const total = cartItems.reduce((sum, item) => sum + item.quantity * 20, 0); // Simplified pricing
    db.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [user_id, total], (err, orderResult) => {
      if (err) return res.status(500).json({ error: err });

      db.query('DELETE FROM cart WHERE user_id = ?', [user_id], () => {
        res.json({ message: 'Order placed', orderId: orderResult.insertId, total });
      });
    });
  });
};
