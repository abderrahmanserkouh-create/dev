const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    await Cart.addItem(req.user.id, product_id, quantity || 1);
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    await Cart.updateQuantity(req.params.id, quantity, req.user.id);
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await Cart.removeItem(req.params.id, req.user.id);
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
