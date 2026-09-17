import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { calculateDeliveryCharge } from '../utils/deliveryRules.js';
import { createNotification } from '../services/notificationService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, customerNotes, paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    const user = await User.findById(req.user.id);
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product?.name || 'Product'} is out of stock`
        });
      }
    }

    let deliveryCharge = 0;
    try {
      deliveryCharge = calculateDeliveryCharge(cart.totalPrice, user.weeklyPurchaseAmount);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    const totalPrice = cart.totalPrice + deliveryCharge;

    const order = new Order({
      user: req.user.id,
      items: cart.items,
      deliveryAddress: deliveryAddress || user.address,
      customerNotes,
      subtotal: cart.totalPrice,
      deliveryCharge,
      totalPrice,
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    user.weeklyPurchaseAmount += cart.totalPrice;
    user.totalPurchaseAmount += cart.totalPrice;
    await user.save();

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    await createNotification(
      req.user.id,
      'Order Placed',
      `Your order ${order._id} has been placed successfully and is now pending confirmation.`,
      'order'
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date();
      await order.save();
    }

    await createNotification(
      order.user,
      'Order Status Updated',
      `Your order ${order._id} status updated to ${status.replace(/_/g, ' ')}.`,
      'delivery'
    );

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending orders'
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = 'cancelled';
    await order.save();

    await createNotification(
      order.user,
      'Order Cancelled',
      `Your order ${order._id} has been cancelled successfully.`,
      'order'
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
