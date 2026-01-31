import Joi from 'joi';

// Update profile validation schema
export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  loginId: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(12)
    .optional()
    .messages({
      'string.alphanum': 'Login ID must contain only letters and numbers',
      'string.min': 'Login ID must be at least 6 characters',
      'string.max': 'Login ID must not exceed 12 characters'
    })
});

// Update password validation schema
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required'
    }),
  
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one special character',
      'any.required': 'New password is required'
    })
});
