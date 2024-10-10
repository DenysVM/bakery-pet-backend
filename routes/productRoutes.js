// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.post('/', protect, admin, productController.createProduct);

// Alternative route 
// router.post('/upload', protect, admin, productController.createProductWithImage);

router.put('/:id', protect, admin, productController.updateProduct);

router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
