import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, TextField, Grid, Alert, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    deliveryAddress: {
      house: '',
      area: '',
      landmark: '',
      city: '',
      pincode: ''
    },
    customerNotes: '',
    paymentMethod: 'cod'
  });

  const steps = ['Review Cart', 'Delivery Address', 'Order Summary', 'Payment'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        setCart(response.data.data);
        if (user?.address) {
          setFormData(prev => ({
            ...prev,
            deliveryAddress: user.address
          }));
        }
      }
    } catch (error) {
      setError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value
      }
    }));
  };

  const handleNotesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      customerNotes: e.target.value
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: e.target.value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.deliveryAddress.house || !formData.deliveryAddress.area || !formData.deliveryAddress.city || !formData.deliveryAddress.pincode) {
      setError('Please fill in all delivery address fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/orders', formData);
      if (response.data.success) {
        setSuccess('Order placed successfully!');
        setTimeout(() => navigate(`/orders/${response.data.data._id}`), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="warning" className="mb-4">Your cart is empty</Alert>
        <Button variant="contained" color="success" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800">
        Checkout
      </Typography>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}

      <Stepper activeStep={activeStep} className="mb-8">
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">Order Items</Typography>
                {cart.items.map(item => (
                  <Box key={item.product._id} className="flex justify-between mb-2 pb-2 border-b">
                    <Typography>{item.product.name} x {item.quantity}</Typography>
                    <Typography>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">Delivery Address</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="House/Flat No."
                      value={formData.deliveryAddress.house}
                      onChange={(e) => handleAddressChange('house', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Area/Locality"
                      value={formData.deliveryAddress.area}
                      onChange={(e) => handleAddressChange('area', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Landmark (Optional)"
                      value={formData.deliveryAddress.landmark}
                      onChange={(e) => handleAddressChange('landmark', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.deliveryAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      value={formData.deliveryAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">Additional Notes</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Special instructions for delivery (Optional)"
                  value={formData.customerNotes}
                  onChange={handleNotesChange}
                  variant="outlined"
                  placeholder="e.g., Ring bell twice, leave at door, etc."
                />
              </CardContent>
            </Card>
          )}

          {activeStep === 3 && (
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">Payment Method</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handlePaymentMethodChange({ target: { value: 'cod' } })}>
                      <Box className="flex items-center">
                        <input type="radio" checked={formData.paymentMethod === 'cod'} onChange={() => {}} />
                        <Typography className="ml-2 font-semibold">Cash on Delivery (COD)</Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" className="ml-6">
                        Pay when your order arrives
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handlePaymentMethodChange({ target: { value: 'online' } })}>
                      <Box className="flex items-center">
                        <input type="radio" checked={formData.paymentMethod === 'online'} onChange={() => {}} />
                        <Typography className="ml-2 font-semibold">Online Payment</Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" className="ml-6">
                        Secure online payment
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="sticky" sx={{ top: 20 }}>
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4">Order Summary</Typography>
              <Box className="mb-4">
                <Box className="flex justify-between mb-2">
                  <Typography>Subtotal:</Typography>
                  <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between mb-2">
                  <Typography>Delivery Charge:</Typography>
                  <Typography>Calculated at final step</Typography>
                </Box>
                <Box className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <Typography>Total:</Typography>
                  <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
              <Box className="flex gap-2">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => setActiveStep(activeStep + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Checkout;
