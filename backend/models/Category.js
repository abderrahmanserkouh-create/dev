const { pool } = require('../database/db');

const Category = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    return rows;
  },
  async findAllActive() {
    const [rows] = await pool.query('SELECT * FROM categories WHERE status = ? ORDER BY name', ['active']);
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },
  ALLOWED_FIELDS: ['name', 'image', 'status'],

  sanitize(data) {
    const clean = {};
    for (const key of this.ALLOWED_FIELDS) {
      if (data[key] !== undefined) clean[key] = data[key];
    }
    return clean;
  },

  async create(name, image) {
    const [result] = await pool.query('INSERT INTO categories (name, image, status) VALUES (?, ?, ?)', [name, image, 'active']);
    return result.insertId;
  },
  async update(id, data) {
    await pool.query('UPDATE categories SET ? WHERE id = ?', [this.sanitize(data), id]);
  },
  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  }
};

module.exports = Category;
