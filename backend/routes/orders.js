const express = require('express');
const router = express.Router();
const { checkout, getOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

router.post('/', auth, checkout);
router.get('/', auth, getOrders);
router.get('/all', auth, admin, getAllOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, admin, updateOrderStatus);

module.exports = router;
