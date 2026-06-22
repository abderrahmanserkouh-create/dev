const { pool } = require('../database/db');

const Product = {
  async findAll() {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = ? ORDER BY p.created_at DESC', ['active']);
    return rows;
  },
  async findAllAdmin() {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC');
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [id]);
    return rows[0];
  },
  async findByCategory(categoryId) {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.status = ?', [categoryId, 'active']);
    return rows;
  },
  async search(query) {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE (p.name LIKE ? OR p.description LIKE ?) AND p.status = ?', [`%${query}%`, `%${query}%`, 'active']);
    return rows;
  },
  ALLOWED_FIELDS: ['name', 'description', 'price', 'sale_price', 'image', 'category_id', 'stock', 'sku', 'status'],

  sanitize(data) {
    const clean = {};
    for (const key of this.ALLOWED_FIELDS) {
      if (data[key] !== undefined) clean[key] = data[key];
    }
    return clean;
  },

  async create(product) {
    const [result] = await pool.query('INSERT INTO products SET ?', [this.sanitize(product)]);
    return result.insertId;
  },
  async update(id, product) {
    await pool.query('UPDATE products SET ? WHERE id = ?', [this.sanitize(product), id]);
  },
  async delete(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },

  async findBySku(sku) {
    const [rows] = await pool.query('SELECT * FROM products WHERE sku = ?', [sku]);
    return rows[0];
  },

  async updateStock(id, stock) {
    await pool.query('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
  },

  async countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM products WHERE status = ?', ['active']);
    return rows[0].total;
  },

  async countByCategory(categoryId) {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM products WHERE category_id = ? AND status = ?', [categoryId, 'active']);
    return rows[0].total;
  },

  async countSearch(query) {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM products WHERE (name LIKE ? OR description LIKE ?) AND status = ?', [`%${query}%`, `%${query}%`, 'active']);
    return rows[0].total;
  },

  async findAllPaginated(page, limit) {
    const offset = (page - 1) * limit;
    const total = await this.countAll();
    const totalPages = Math.ceil(total / limit);
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?', ['active', limit, offset]);
    return { rows, total, page, limit, totalPages };
  },

  async findByCategoryPaginated(categoryId, page, limit) {
    const offset = (page - 1) * limit;
    const total = await this.countByCategory(categoryId);
    const totalPages = Math.ceil(total / limit);
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.status = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?', [categoryId, 'active', limit, offset]);
    return { rows, total, page, limit, totalPages };
  },

  async searchPaginated(query, page, limit) {
    const offset = (page - 1) * limit;
    const total = await this.countSearch(query);
    const totalPages = Math.ceil(total / limit);
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE (p.name LIKE ? OR p.description LIKE ?) AND p.status = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?', [`%${query}%`, `%${query}%`, 'active', limit, offset]);
    return { rows, total, page, limit, totalPages };
  }
};

module.exports = Product;
