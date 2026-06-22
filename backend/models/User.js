const { pool } = require('../database/db');

const User = {
  ALLOWED_FIELDS: ['name', 'email', 'phone', 'address', 'role', 'status'],

  async findAll() {
    const [rows] = await pool.query('SELECT id, name, email, phone, address, role, status, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, phone, address, role, status, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async create(name, email, password, phone, address) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, phone || null, address || null, 'customer']
    );
    return result.insertId;
  },

  async update(id, data) {
    const clean = {};
    for (const key of this.ALLOWED_FIELDS) {
      if (data[key] !== undefined) clean[key] = data[key];
    }
    if (Object.keys(clean).length > 0) {
      await pool.query('UPDATE users SET ? WHERE id = ?', [clean, id]);
    }
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = User;
