const { pool } = require('../database/db');

const Cart = {
  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT c.*, p.name, p.price, p.sale_price, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [userId]
    );
    return rows;
  },
  async addItem(userId, productId, quantity) {
    const [existing] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existing.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
      return existing[0].id;
    }
    const [result] = await pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
    return result.insertId;
  },
  async updateQuantity(id, quantity, userId) {
    await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, userId]);
  },
  async removeItem(id, userId) {
    await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, userId]);
  },
  async clear(userId) {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);
  }
};

module.exports = Cart;
