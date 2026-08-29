// Centralized price calculation - never trust frontend values
const calculateSellingPrice = (mrp, discountPercent) => {
  if (!mrp || !discountPercent) return mrp || 0;
  return Math.round(mrp * (1 - discountPercent / 100));
};

const calculateDeliveryCharge = (weeklyPurchase, orderTotal) => {
  // Business rule: If weekly purchase >= 120, delivery is 50
  if (weeklyPurchase >= 120) {
    return 50;
  }
  // Otherwise, 70 delivery charge (but order must be >= 100)
  return 70;
};

const isEligibleForDelivery = (orderTotal) => {
  return orderTotal >= 100;
};

export { calculateSellingPrice, calculateDeliveryCharge, isEligibleForDelivery };
