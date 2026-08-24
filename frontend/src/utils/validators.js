export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required';
  }
  return null;
};

export const email = (value) => {
  if (!value) return null;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const minLength = (min) => (value) => {
  if (!value) return null;
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return null;
};

export const maxLength = (max) => (value) => {
  if (!value) return null;
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return null;
};

export const url = (value) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

export const phoneNumber = (value) => {
  if (!value) return null;
  const regex = /^\+?[\d\s\-()]{7,20}$/;
  if (!regex.test(value)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const numeric = (value) => {
  if (!value && value !== 0) return null;
  if (isNaN(Number(value))) {
    return 'Must be a number';
  }
  return null;
};

export const minLengthArray = (min) => (value) => {
  if (!value || !Array.isArray(value)) return null;
  if (value.length < min) {
    return `Must select at least ${min} item(s)`;
  }
  return null;
};

export const composeValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};
