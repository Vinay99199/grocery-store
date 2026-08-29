// Delivery charge rules
const DELIVERY_CHARGE_RULES = {
  FREE_DELIVERY_MIN: 500, // Free delivery for orders above 500
  BASE_CHARGE: 50,
  WEEKLY_LIMIT: 5000 // Weekly purchase limit
};

export const calculateDeliveryCharge = (totalPrice, weeklyPurchaseAmount) => {
  // Check weekly purchase limit
  if (weeklyPurchaseAmount + totalPrice > DELIVERY_CHARGE_RULES.WEEKLY_LIMIT) {
    throw new Error(`Weekly purchase limit of ₹${DELIVERY_CHARGE_RULES.WEEKLY_LIMIT} exceeded`);
  }

  // Free delivery for orders above minimum
  if (totalPrice >= DELIVERY_CHARGE_RULES.FREE_DELIVERY_MIN) {
    return 0;
  }

  // Base charge for orders below minimum
  return DELIVERY_CHARGE_RULES.BASE_CHARGE;
};

export default DELIVERY_CHARGE_RULES;
