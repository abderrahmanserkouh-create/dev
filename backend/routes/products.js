const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories, createCategory, updateCategory, deleteCategory, getAllProductsAdmin } = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');

router.get('/products', getProducts);
router.get('/products/admin/all', auth, admin, getAllProductsAdmin);
router.get('/products/:id', getProduct);
router.post('/products', auth, admin, createProduct);
router.put('/products/:id', auth, admin, updateProduct);
router.delete('/products/:id', auth, admin, deleteProduct);

router.get('/categories', getCategories);
router.post('/categories', auth, admin, createCategory);
router.put('/categories/:id', auth, admin, updateCategory);
router.delete('/categories/:id', auth, admin, deleteCategory);

module.exports = router;
