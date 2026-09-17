import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function WishlistButton({ productId, onWishlistUpdate }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      await api.post('/wishlist/add', { productId });
      if (onWishlistUpdate) onWishlistUpdate();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      onClick={handleAddToWishlist}
      disabled={loading}
      sx={{ mt: 1 }}
    >
      {loading ? 'Saving...' : 'Add to Wishlist'}
    </Button>
  );
}

export default WishlistButton;
