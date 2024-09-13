const express = require('express');
const { createOrder, getAllOrders, getOrders, updateOrderItem, updateOrderStatus, deleteOrderItem, deleteOrder } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/:orderId/items/:itemId', protect, updateOrderItem); 
router.put('/:orderId/status', protect, admin, updateOrderStatus);
router.delete('/:orderId/items/:itemId', protect, deleteOrderItem); 
router.delete('/:orderId', protect, deleteOrder);

module.exports = router;
