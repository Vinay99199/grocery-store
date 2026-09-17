import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Chip, CircularProgress, Divider } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/admin-summary');
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h5">No analytics data available.</Typography>
      </Container>
    );
  }

  const { summary, monthlySales, topProducts, orderStatusBreakdown, recentOrders } = analytics;
  const maxRevenue = Math.max(...monthlySales.map(item => item.revenue), 1);

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
        Analytics & Reports
      </Typography>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography color="textSecondary">Revenue</Typography>
                  <Typography variant="h5" className="font-bold text-green-600">
                    {formatCurrency(summary.totalRevenue)}
                  </Typography>
                </Box>
                <MonetizationOnIcon className="text-green-600 text-3xl" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography color="textSecondary">Orders</Typography>
                  <Typography variant="h5" className="font-bold text-blue-600">
                    {summary.totalOrders}
                  </Typography>
                </Box>
                <ShoppingCartIcon className="text-blue-600 text-3xl" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography color="textSecondary">Customers</Typography>
                  <Typography variant="h5" className="font-bold text-purple-600">
                    {summary.totalCustomers}
                  </Typography>
                </Box>
                <PeopleIcon className="text-purple-600 text-3xl" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography color="textSecondary">Low Stock</Typography>
                  <Typography variant="h5" className="font-bold text-orange-600">
                    {summary.lowStockProducts}
                  </Typography>
                </Box>
                <Inventory2Icon className="text-orange-600 text-3xl" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">Revenue Overview (Last 6 Months)</Typography>
              <Box className="flex items-end gap-3 h-56 mt-4">
                {monthlySales.map((item) => (
                  <Box key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <Box
                      className="w-full rounded-t-md bg-gradient-to-t from-green-500 to-green-300"
                      sx={{ height: `${Math.max((item.revenue / maxRevenue) * 180, 18)}px`, minHeight: '18px' }}
                    />
                    <Typography variant="caption" color="textSecondary">{item.month}</Typography>
                    <Typography variant="caption" className="font-semibold">
                      ₹{Math.round(item.revenue / 1000)}k
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">Order Status</Typography>
              <Box className="space-y-3">
                {Object.entries(orderStatusBreakdown).map(([key, value]) => (
                  <Box key={key}>
                    <Box className="flex justify-between items-center mb-1">
                      <Typography variant="body2" className="capitalize">{key.replace(/_/g, ' ')}</Typography>
                      <Typography variant="body2" className="font-semibold">{value}</Typography>
                    </Box>
                    <Box className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <Box
                        className="h-full rounded-full bg-blue-500"
                        sx={{ width: `${Math.min((value / Math.max(summary.totalOrders, 1)) * 100, 100)}%` }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-1">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">Top Selling Products</Typography>
              <Box className="space-y-3">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <Box key={product.id}>
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2" className="font-medium">
                          {index + 1}. {product.name}
                        </Typography>
                        <Typography variant="body2" className="text-green-600 font-semibold">
                          {formatCurrency(product.sales)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {product.units} units sold
                      </Typography>
                      {index < topProducts.length - 1 && <Divider className="my-2" />}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">No sales data yet.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">Recent Orders</Typography>
              <Box className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <Box key={order._id} className="border rounded-lg p-3">
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2" className="font-semibold">#{String(order._id).slice(-6)}</Typography>
                        <Chip
                          label={order.status.replace(/_/g, ' ')}
                          color={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary">{order.customer}</Typography>
                      <Typography variant="body2" className="mt-1 font-medium">{formatCurrency(order.totalPrice)}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">No recent orders.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
