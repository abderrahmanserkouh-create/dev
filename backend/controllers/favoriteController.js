const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
  try {
    const items = await Favorite.findByUser(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const result = await Favorite.toggle(req.user.id, req.params.productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const favorited = await Favorite.isFavorited(req.user.id, req.params.productId);
    res.json({ favorited });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
