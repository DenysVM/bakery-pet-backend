const express = require('express');
const { registerUser, authUser, verifyEmail } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});
router.get('/verify-email', verifyEmail);

router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Welcome to the admin panel' });
});

module.exports = router;
