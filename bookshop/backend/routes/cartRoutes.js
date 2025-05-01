const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addToCart,
  getCart,
  removeFromCart
} = require('../controllers/cartController');

// Add to cart
router.post('/add', authMiddleware.verifyToken, addToCart);

// Get all cart items for logged-in user
router.get('/', authMiddleware.verifyToken, getCart);

// Remove item from cart by cart ID
router.delete('/:cart_id', authMiddleware.verifyToken, removeFromCart);

module.exports = router;
