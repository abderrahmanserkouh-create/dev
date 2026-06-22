const { pool } = require('../database/db');

const Order = {
  async create(userId, total, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [orderResult] = await connection.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, total]);
      const orderId = orderResult.insertId;
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }
      await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },
  async getItems(orderId) {
    const [rows] = await pool.query(
      'SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [orderId]
    );
    return rows;
  },
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  },
  async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  async countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM orders');
    return rows[0].total;
  },

  async findAllPaginated(page, limit) {
    const offset = (page - 1) * limit;
    const total = await this.countAll();
    const totalPages = Math.ceil(total / limit);
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    return { rows, total, page, limit, totalPages };
  }
};

module.exports = Order;
