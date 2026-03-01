const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, verifyRole('admin'), getAllUsers);
router.put('/:id', verifyToken, verifyRole('admin'), updateUser);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteUser);

module.exports = router;