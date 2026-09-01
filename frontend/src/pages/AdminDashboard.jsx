import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch orders for stats
      const ordersRes = await api.get('/orders');
      const productsRes = await api.get('/products?limit=1000');
      
      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock < 10).length;

      setStats({
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockProducts
      });
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
        Admin Dashboard
      </Typography>

      {stats && (
        <Grid container spacing={3}>
          {/* Revenue Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h5" className="font-bold text-green-600">
                      ₹{stats.totalRevenue.toFixed(0)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon className="text-green-600 text-3xl" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Orders Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h5" className="font-bold text-blue-600">
                      {stats.totalOrders}
                    </Typography>
                    {stats.pendingOrders > 0 && (
                      <Chip
                        label={`${stats.pendingOrders} Pending`}
                        color="warning"
                        size="small"
                        className="mt-2"
                      />
                    )}
                  </Box>
                  <ShoppingCartIcon className="text-blue-600 text-3xl" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Products Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Products
                    </Typography>
                    <Typography variant="h5" className="font-bold text-purple-600">
                      {stats.totalProducts}
                    </Typography>
                    {stats.lowStockProducts > 0 && (
                      <Chip
                        label={`${stats.lowStockProducts} Low Stock`}
                        color="error"
                        size="small"
                        className="mt-2"
                      />
                    )}
                  </Box>
                  <GroupIcon className="text-purple-600 text-3xl" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Deliveries Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Deliveries Today
                    </Typography>
                    <Typography variant="h5" className="font-bold text-orange-600">
                      0
                    </Typography>
                  </Box>
                  <LocalShippingIcon className="text-orange-600 text-3xl" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default AdminDashboard;
