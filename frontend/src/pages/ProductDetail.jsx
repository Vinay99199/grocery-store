import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, TextField, Rating, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // This will be integrated with cart state
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      unit: product.unit,
      image: product.image
    };
    // Store in localStorage temporarily (will integrate with cart later)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setSuccess('Product added to cart!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/products/${id}/review`, review);
      if (response.data.success) {
        setSuccess('Review added successfully!');
        setReview({ rating: 5, comment: '' });
        fetchProduct();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h6" color="error">Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              height: 400,
              backgroundColor: '#f0f0f0',
              backgroundImage: product.image
                ? `url(${product.image})`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px'
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" className="font-bold mb-2">
            {product.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" className="mb-4">
            Category: {product.category.name}
          </Typography>

          <Box className="mb-4">
            <Rating value={product.rating} readOnly />
            <Typography variant="body2" color="textSecondary">
              {product.reviews.length} reviews
            </Typography>
          </Box>

          <Typography variant="h5" className="text-green-600 font-bold mb-2">
            ₹{product.price}/{product.unit}
          </Typography>

          <Typography variant="body1" className="mb-4">
            {product.description}
          </Typography>

          <Typography variant="body2" className="mb-4">
            Stock: {product.stock > 0 ? `${product.stock} ${product.unit}` : 'Out of Stock'}
          </Typography>

          {product.stock > 0 && (
            <Box className="flex gap-4 mb-6">
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                inputProps={{ min: 1 }}
                variant="outlined"
                size="small"
                className="w-32"
              />
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
          )}

          {/* Reviews Section */}
          <Box className="mt-8 border-t pt-6">
            <Typography variant="h6" className="font-bold mb-4">Customer Reviews</Typography>

            {isAuthenticated && (
              <Box className="mb-6 p-4 border rounded-lg">
                <Typography variant="body2" className="font-semibold mb-2">Add Your Review</Typography>
                <Rating
                  value={review.rating}
                  onChange={(e, newValue) => setReview(prev => ({ ...prev, rating: newValue }))}
                  className="mb-2"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Comment"
                  value={review.comment}
                  onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                  variant="outlined"
                  size="small"
                  className="mb-2"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddReview}
                >
                  Submit Review
                </Button>
              </Box>
            )}

            {product.reviews.map((review, idx) => (
              <Box key={idx} className="mb-4 p-4 border rounded-lg">
                <Box className="flex justify-between mb-2">
                  <Typography variant="body2" className="font-semibold">
                    {review.user?.name || 'Anonymous'}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetail;
