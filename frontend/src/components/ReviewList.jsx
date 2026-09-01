import React from 'react';
import { Box, Typography, Rating, Avatar, Grid, Chip } from '@mui/material';

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" className="text-center py-4">
        No reviews yet. Be the first to review this product!
      </Typography>
    );
  }

  return (
    <Box>
      {reviews.map((review, idx) => (
        <Box key={idx} className="mb-4 pb-4 border-b last:border-b-0">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {review.user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Box className="flex justify-between items-start mb-2">
                <Box>
                  <Typography variant="body2" className="font-semibold">
                    {review.user?.name || 'Anonymous'}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Typography variant="body2" className="mb-2">
                {review.comment}
              </Typography>
              <Box className="flex gap-1 flex-wrap">
                <Chip
                  label={`${review.rating} ⭐`}
                  size="small"
                  variant="outlined"
                  color={review.rating >= 4 ? 'success' : 'default'}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default ReviewList;
