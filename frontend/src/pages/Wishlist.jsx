import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function WishlistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      fetchWishlist();
    } catch (error) {
      setError('Failed to remove product from wishlist');
    }
  };

  const handleClear = async () => {
    try {
      await api.delete('/wishlist/clear');
      fetchWishlist();
    } catch (error) {
      setError('Failed to clear wishlist');
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
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800">
          My Wishlist
        </Typography>
        {wishlist.items.length > 0 && (
          <Button variant="outlined" color="error" onClick={handleClear}>
            Clear Wishlist
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {wishlist.items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Typography variant="h6" color="textSecondary" className="mb-4">
              Your wishlist is empty
            </Typography>
            <Button variant="contained" color="success" onClick={() => navigate('/shop')}>
              Explore Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {wishlist.items.map(({ product }) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card className="h-full">
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundColor: '#f3f4f6',
                    backgroundImage: product.image
                      ? `url(${product.image})`
                      : 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-2">
                    {product.category?.name || 'Grocery'}
                  </Typography>
                  <Typography variant="h6" className="text-green-600 font-bold mb-3">
                    ₹{product.price}/{product.unit}
                  </Typography>
                  <Box className="flex gap-2">
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => navigate(`/shop`)}
                    >
                      View Product
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemove(product._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default WishlistPage;
