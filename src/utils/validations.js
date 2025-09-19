import * as Yup from 'yup';

export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    // .min(8, 'Password must be 8 characters long')
    // .matches(/[0-9]/, 'Password requires a number')
    // .matches(/[a-z]/, 'Password requires a lowercase letter')
    // .matches(/[A-Z]/, 'Password requires an uppercase letter')
    // .matches(/[^\w]/, 'Password requires a symbol')
    .required('Password is required'),
});

export const emailValidation = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
});

export const signupValidation = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Repeat Password is required'),
});

export const passwordValidation = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const changePasswordValidation = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const kitchenProfileValidation = Yup.object().shape({
  // kitchenName: Yup.string().required('Kitchen Name is required'),
  // pickupLocation: Yup.string().required('Pickup Location is required'),
  // pickupTime: Yup.string().required('Pickup Time is required'),
  // aboutCook: Yup.string().max(500, 'Message too long'),
  kitchenName: Yup.string()
    .min(2, 'Kitchen name must be at least 2 characters')
    .max(50, 'Kitchen name cannot exceed 50 characters')
    .required('Kitchen name is required'),

  pickupLocation: Yup.string()
    .min(5, 'Pickup location must be at least 5 characters')
    .max(100, 'Pickup location cannot exceed 100 characters')
    .required('Pickup location is required'),

  pickupTime: Yup.number()
    .min(1, 'Pickup time must be at least 1 minute')
    .max(180, 'Pickup time cannot exceed 180 minutes')
    .required('Average pickup time is required'),

  // Add validation for 'From the Cook' field
  aboutCook: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message cannot exceed 500 characters')
    .required('Message from cook is required'),
});
