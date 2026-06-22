const { pool } = require('../database/db');

const Favorite = {
  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT f.*, p.name, p.price, p.sale_price, p.image FROM favorites f JOIN products p ON f.product_id = p.id WHERE f.user_id = ?',
      [userId]
    );
    return rows;
  },
  async toggle(userId, productId) {
    const [existing] = await pool.query('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existing.length > 0) {
      await pool.query('DELETE FROM favorites WHERE id = ?', [existing[0].id]);
      return { action: 'removed' };
    }
    await pool.query('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    return { action: 'added' };
  },
  async isFavorited(userId, productId) {
    const [rows] = await pool.query('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
    return rows.length > 0;
  }
};

module.exports = Favorite;
