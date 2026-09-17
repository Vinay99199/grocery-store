import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
      await wishlist.save();
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    const exists = wishlist.items.some(item => item.product.toString() === productId);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    wishlist.items.push({ product: productId, addedAt: new Date() });
    await wishlist.save();
    await wishlist.populate('items.product', 'name price unit image rating category');

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('items.product', 'name price unit image rating category');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

export const clearWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
      await wishlist.save();
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};
