const Product = require('../models/Product');
const Category = require('../models/Category');
const { pool } = require('../database/db');

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const { category, search } = req.query;

    let result;
    if (category) result = await Product.findByCategoryPaginated(category, page, limit);
    else if (search) result = await Product.searchPaginated(search, page, limit);
    else result = await Product.findAllPaginated(page, limit);

    res.json({
      products: result.rows,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllProductsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM products');
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    const rows = await Product.findAllAdmin();

    const paginatedRows = rows.slice(offset, offset + limit);

    res.json({
      products: paginatedRows,
      total,
      page,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, sale_price, image, category_id, stock, sku } = req.body;
    const id = await Product.create({ name, description, price, sale_price, image, category_id, stock, sku });
    res.status(201).json({ id, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await Product.update(req.params.id, req.body);
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAllActive();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const id = await Category.create(name, image);
    res.status(201).json({ id, message: 'Category created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    await Category.update(req.params.id, req.body);
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.delete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
