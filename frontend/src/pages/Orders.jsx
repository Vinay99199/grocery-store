import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid, Alert, CircularProgress, Chip, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'info',
      out_for_delivery: 'info',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    return steps.indexOf(status);
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
        My Orders
      </Typography>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Typography variant="h6" color="textSecondary" className="mb-4">
              You haven't placed any orders yet
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box className="space-y-6">
          {orders.map(order => (
            <Card key={order._id} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className="mb-4">
                      <Typography variant="body2" color="textSecondary">Order ID</Typography>
                      <Typography variant="h6" className="font-mono">{order._id.substring(0, 8)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Date</Typography>
                      <Typography variant="body2">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} className="text-right">
                    <Box className="mb-4">
                      <Typography variant="body2" color="textSecondary">Total Amount</Typography>
                      <Typography variant="h6" className="text-green-600 font-bold">
                        ₹{order.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                      <Chip
                        label={order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                        size="small"
                        color={order.paymentMethod === 'cod' ? 'primary' : 'success'}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Order Status Timeline */}
                <Box className="my-6">
                  <Typography variant="body2" className="font-semibold mb-3">Order Status</Typography>
                  <Stepper activeStep={getStatusStep(order.status)} alternativeLabel>
                    <Step>
                      <StepLabel>Pending</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Confirmed</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Preparing</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Out for Delivery</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Delivered</StepLabel>
                    </Step>
                  </Stepper>
                </Box>

                {/* Order Items */}
                <Box className="my-4 p-4 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-semibold mb-2">Items ({order.items.length})</Typography>
                  {order.items.map(item => (
                    <Box key={item.product._id} className="flex justify-between text-sm mb-1">
                      <Typography>{item.product.name} x {item.quantity}</Typography>
                      <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Delivery Address */}
                <Box className="my-4 p-4 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-semibold mb-2">Delivery Address</Typography>
                  <Typography variant="body2">
                    {order.deliveryAddress.house}, {order.deliveryAddress.area}
                  </Typography>
                  {order.deliveryAddress.landmark && (
                    <Typography variant="body2" color="textSecondary">
                      Near {order.deliveryAddress.landmark}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                  </Typography>
                </Box>

                {/* Customer Notes */}
                {order.customerNotes && (
                  <Box className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Typography variant="body2" className="font-semibold mb-2">Delivery Instructions</Typography>
                    <Typography variant="body2">{order.customerNotes}</Typography>
                  </Box>
                )}

                {/* Order Summary */}
                <Box className="my-4 pt-4 border-t">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">Delivery Charge:</Typography>
                      <Typography variant="body2" className="font-bold mt-2">Total:</Typography>
                    </Grid>
                    <Grid item xs={6} className="text-right">
                      <Typography variant="body2">₹{order.subtotal.toFixed(2)}</Typography>
                      <Typography variant="body2">₹{order.deliveryCharge.toFixed(2)}</Typography>
                      <Typography variant="body2" className="font-bold mt-2">₹{order.totalPrice.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Actions */}
                <Box className="flex gap-2 mt-4">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    View Details
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      Cancel Order
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Orders;
