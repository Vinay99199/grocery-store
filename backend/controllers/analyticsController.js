import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [orders, products, customers] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Product.find({ isActive: true }).populate('category', 'name'),
      User.find({ isActive: true, role: 'customer' })
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock < 10).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySales = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthLabel = monthNames[monthIndex];

      const monthValue = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year;
      }).reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      return {
        month: monthLabel,
        revenue: monthValue
      };
    });

    const productMap = new Map();
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id?.toString?.() || item.product?.toString?.();
        if (!productId) return;

        const current = productMap.get(productId) || { name: item.product?.name || 'Unknown', sales: 0, units: 0 };
        current.sales += item.price * item.quantity;
        current.units += item.quantity;
        productMap.set(productId, current);
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const orderStatusBreakdown = {
      pending: orders.filter(order => order.status === 'pending').length,
      confirmed: orders.filter(order => order.status === 'confirmed').length,
      preparing: orders.filter(order => order.status === 'preparing').length,
      out_for_delivery: orders.filter(order => order.status === 'out_for_delivery').length,
      delivered: deliveredOrders,
      cancelled: orders.filter(order => order.status === 'cancelled').length
    };

    const recentOrders = orders.slice(0, 5).map(order => ({
      _id: order._id,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      customer: order.user?.name || 'Customer'
    }));

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          deliveredOrders,
          pendingOrders,
          lowStockProducts,
          avgOrderValue
        },
        monthlySales,
        topProducts,
        orderStatusBreakdown,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
