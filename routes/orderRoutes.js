const express = require('express');
const { createOrder, getOrders, updateOrderItem, deleteOrderItem, deleteOrder } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.put('/:orderId/items/:itemId', protect, updateOrderItem); 
router.delete('/:orderId/items/:itemId', protect, deleteOrderItem); 
router.delete('/:orderId', protect, deleteOrder);

module.exports = router;
