const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.checkout = async (req, res) => {
  try {
    const items = await Cart.findByUser(req.user.id);
    if (items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm không tồn tại.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm trong kho.` });
      }
    }

    const total = items.reduce((sum, item) => sum + (item.sale_price || item.price) * item.quantity, 0);
    const orderItems = items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.sale_price || i.price }));
    const orderId = await Order.create(req.user.id, total, orderItems);
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        await Product.updateStock(item.product_id, product.stock - item.quantity);
      }
    }
    res.status(201).json({ id: orderId, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const items = await Order.getItems(req.params.id);
    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    await Order.updateStatus(req.params.id, req.body.status);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
