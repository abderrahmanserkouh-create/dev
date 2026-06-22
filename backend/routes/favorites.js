const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite, checkFavorite } = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getFavorites);
router.post('/:productId', auth, toggleFavorite);
router.get('/:productId/check', auth, checkFavorite);

module.exports = router;
