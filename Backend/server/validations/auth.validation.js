import Joi from 'joi';

// User login validation schema (no role)
export const loginSchema = Joi.object({
  loginId: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Login ID is required',
      'any.required': 'Login ID is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// Admin register validation schema (with role)
export const adminRegisterSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  loginId: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(12)
    .required()
    .messages({
      'string.empty': 'Login ID is required',
      'string.alphanum': 'Login ID must contain only letters and numbers',
      'string.min': 'Login ID must be at least 6 characters',
      'string.max': 'Login ID must not exceed 12 characters',
      'any.required': 'Login ID is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
      'any.required': 'Password is required'
    }),
  
  role: Joi.string()
    .valid('admin')
    .required()
    .messages({
      'any.only': 'Role must be admin',
      'any.required': 'Role is required'
    })
});

// Admin login validation schema (with role)
export const adminLoginSchema = Joi.object({
  loginId: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Login ID is required',
      'any.required': 'Login ID is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
  
  role: Joi.string()
    .valid('admin')
    .required()
    .messages({
      'any.only': 'Role must be admin',
      'any.required': 'Role is required'
    })
});

// Admin create user validation schema (no role - always user)
export const adminCreateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  loginId: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(12)
    .required()
    .messages({
      'string.empty': 'Login ID is required',
      'string.alphanum': 'Login ID must contain only letters and numbers',
      'string.min': 'Login ID must be at least 6 characters',
      'string.max': 'Login ID must not exceed 12 characters',
      'any.required': 'Login ID is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
      'any.required': 'Password is required'
    })
});
