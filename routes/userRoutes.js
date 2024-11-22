const express = require('express');
const { getAllUsers, getUserById, updateUserProfile, deleteUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, admin, getAllUsers);

router.get('/:id', protect, getUserById);

router.put('/:id', protect, updateUserProfile);

router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
