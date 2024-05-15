const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
