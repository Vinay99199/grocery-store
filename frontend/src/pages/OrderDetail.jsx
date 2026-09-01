import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Button, Grid, Alert, CircularProgress, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    return steps.indexOf(status);
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

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error">{error || 'Order not found'}</Alert>
        <Button variant="contained" onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Button variant="outlined" onClick={() => navigate('/orders')} className="mb-4">
        ← Back to Orders
      </Button>

      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
        Order #{order._id.substring(0, 8).toUpperCase()}
      </Typography>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Order Status */}
          <Card className="mb-4">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">Order Status</Typography>
                <Chip
                  label={order.status.toUpperCase().replace(/_/g, ' ')}
                  color={getStatusColor(order.status)}
                />
              </Box>
              <Stepper activeStep={getStatusStep(order.status)}>
                <Step completed={getStatusStep(order.status) > 0}>
                  <StepLabel>Pending</StepLabel>
                </Step>
                <Step completed={getStatusStep(order.status) > 1}>
                  <StepLabel>Confirmed</StepLabel>
                </Step>
                <Step completed={getStatusStep(order.status) > 2}>
                  <StepLabel>Preparing</StepLabel>
                </Step>
                <Step completed={getStatusStep(order.status) > 3}>
                  <StepLabel>Out for Delivery</StepLabel>
                </Step>
                <Step completed={getStatusStep(order.status) > 4}>
                  <StepLabel>Delivered</StepLabel>
                </Step>
              </Stepper>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">Order Items</Typography>
              {order.items.map(item => (
                <Box key={item.product._id} className="flex justify-between items-center mb-4 pb-4 border-b last:border-b-0">
                  <Box className="flex-1">
                    <Typography variant="body1" className="font-semibold">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.quantity} x ₹{item.price} = ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-3">Delivery Address</Typography>
              <Typography variant="body2" className="mb-1">
                <strong>{order.deliveryAddress.house}</strong>
              </Typography>
              <Typography variant="body2" className="mb-1">
                {order.deliveryAddress.area}
              </Typography>
              {order.deliveryAddress.landmark && (
                <Typography variant="body2" className="mb-1" color="textSecondary">
                  Near {order.deliveryAddress.landmark}
                </Typography>
              )}
              <Typography variant="body2">
                {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </Typography>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          {order.customerNotes && (
            <Card className="mb-4">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-3">Delivery Instructions</Typography>
                <Typography variant="body2" className="p-3 bg-blue-50 rounded border border-blue-200">
                  {order.customerNotes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <Card className="sticky" sx={{ top: 20 }} className="mb-4">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">Order Summary</Typography>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Typography variant="body2">Order Date:</Typography>
                  <Typography variant="body2">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{order.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Delivery Charge:</Typography>
                  <Typography variant="body2">₹{order.deliveryCharge.toFixed(2)}</Typography>
                </Box>
                <Box className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <Typography>Total Amount:</Typography>
                  <Typography className="text-green-600">₹{order.totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
              <Box className="mt-4 space-y-2">
                <Box>
                  <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                  <Chip
                    label={order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    size="small"
                    color={order.paymentMethod === 'cod' ? 'primary' : 'success'}
                    className="mt-1"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Payment Status</Typography>
                  <Chip
                    label={order.paymentStatus.toUpperCase()}
                    size="small"
                    color={order.paymentStatus === 'completed' ? 'success' : 'warning'}
                    className="mt-1"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {order.status === 'pending' && (
            <Card>
              <CardContent>
                <Button fullWidth variant="outlined" color="error">
                  Cancel Order
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderDetail;
