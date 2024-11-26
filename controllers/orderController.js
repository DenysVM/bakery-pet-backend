const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  const {
    user,
    userFirstName,
    userLastName,
    items,
    address,
    phone,
    total,
    orderNumber,
  } = req.body;

  try {
    const newOrder = await Order.create({
      user,
      userFirstName,
      userLastName,
      items,
      address,
      phone,
      total,
      orderNumber,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

const getOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    if (userId) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const orders = await Order.find({ user: userId }).populate('user', 'firstName lastName email');
      return res.status(200).json(orders);
    }

    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderNumber, _id } = req.params;
  const orderId = orderNumber || _id; 
  const { status } = req.body;

  try {
    const order = orderNumber
      ? await Order.findOne({ orderNumber }) 
      : await Order.findById(_id); 

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status; 
    await order.save(); 

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error });
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

const addItemToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const existingItem = order.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {

      existingItem.quantity += quantity;
    } else {

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const newItem = {
        productId: product._id,
        quantity: quantity,
        price: product.price,
      };

      order.items.push(newItem);
    }

    order.total = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error adding item to order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createOrder, getAllOrders, getOrders, getOrderById, updateOrderStatus, addItemToOrder, updateOrderItem, deleteOrderItem, deleteOrder };
