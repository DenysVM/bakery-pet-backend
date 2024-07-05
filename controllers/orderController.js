const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { user, items, address, phone, total } = req.body;

    if (!user || !items || !address || !phone || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({
      user,
      items,
      address,
      phone,
      total,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error });
  }
};

const updateOrderItem = async (req, res) => {
  const { orderId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    item.quantity = quantity;
    order.total = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order item', error });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

const deleteOrderItem = async (req, res) => {
  const { orderId, itemId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.items = order.items.filter(item => item._id.toString() !== itemId);
    
    if (order.items.length === 0) {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ message: 'Order deleted successfully' });
    }

    await order.save();
    res.status(200).json({ message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order item', error });
  }
};

module.exports = { createOrder, getOrders, updateOrderItem, deleteOrderItem, deleteOrder };
