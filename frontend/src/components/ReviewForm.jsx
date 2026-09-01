import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Rating, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import api from '../services/api';

function ReviewForm({ productId, onReviewAdded, userHasPurchased }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenDialog = () => {
    if (!userHasPurchased) {
      setError('You can only review products you have purchased');
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRating(5);
    setComment('');
    setError('');
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment
      });
      if (response.data.success) {
        setSuccess('Review added successfully!');
        handleCloseDialog();
        onReviewAdded();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error" className="mb-2">{error}</Alert>}
      {success && <Alert severity="success" className="mb-2">{success}</Alert>}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        disabled={!userHasPurchased}
      >
        {userHasPurchased ? 'Write a Review' : 'Purchase to Review'}
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <Box>
            <Typography variant="body2" className="font-semibold mb-2">Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            placeholder="Share your experience with this product"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained" color="success" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReviewForm;
