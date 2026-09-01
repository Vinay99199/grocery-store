import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user has purchased this product
    const order = await Order.findOne({
      user: req.user.id,
      'items.product': productId,
      status: 'delivered'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(r => r.user.toString() === req.user.id);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date()
    });

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();
    await product.populate('reviews.user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product.reviews
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = product.reviews.find(r => r.user.toString() === req.user.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();
    await product.populate('reviews.user', 'name email');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewIndex = product.reviews.findIndex(r => r.user.toString() === req.user.id);
    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    product.reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = (totalRating / product.reviews.length).toFixed(1);
    } else {
      product.rating = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};
