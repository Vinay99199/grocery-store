import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, TextField, Grid, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      }
    } catch (error) {
      setError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const response = await api.put('/cart/update', {
        productId,
        quantity: newQuantity
      });
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        const response = await api.delete('/cart');
        if (response.data.success) {
          setCart(response.data.data);
        }
      } catch (error) {
        setError('Failed to clear cart');
      }
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
        Shopping Cart
      </Typography>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {!cart || cart.items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Typography variant="h6" color="textSecondary" className="mb-4">
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cart.items.map(item => (
              <Card key={item.product._id} className="mb-4">
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 100,
                          backgroundColor: '#f0f0f0',
                          backgroundImage: item.product.image
                            ? `url(${item.product.image})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '4px'
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" className="font-semibold">
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ₹{item.price}/{item.product.unit}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product._id, Math.max(1, parseInt(e.target.value)))}
                        inputProps={{ min: 1 }}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2} className="text-right">
                      <Typography variant="h6" className="text-green-600 font-bold mb-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleRemoveItem(item.product._id)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="sticky" sx={{ top: 20 }}>
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">
                  Order Summary
                </Typography>
                <Box className="mb-4">
                  <Box className="flex justify-between mb-2">
                    <Typography>Subtotal:</Typography>
                    <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
                  </Box>
                  <Box className="flex justify-between mb-2">
                    <Typography>Delivery:</Typography>
                    <Typography>Calculated at checkout</Typography>
                  </Box>
                  <Box className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <Typography>Total:</Typography>
                    <Typography>₹{cart.totalPrice.toFixed(2)}</Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  className="mb-2"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Cart;
