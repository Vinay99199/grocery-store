export const validateEmail = (email) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePincode = (pincode) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(pincode);
};
