const express = require('express');
const router = express.Router();
const { getAll, getById, update, delete: deleteUser } = require('../controllers/userController');
const { auth, admin } = require('../middleware/auth');

router.use(auth, admin);

router.get('/users', getAll);
router.get('/users/:id', getById);
router.put('/users/:id', update);
router.delete('/users/:id', deleteUser);

module.exports = router;
