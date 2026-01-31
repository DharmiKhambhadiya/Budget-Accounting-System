export default {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicing_user',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this',
  jwtExpire: process.env.JWT_EXPIRE || '7d',

  // Bcrypt
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,

  // Validation
  loginIdMinLength: 6,
  loginIdMaxLength: 12,
  passwordMinLength: 8,

  // Email
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  appName: process.env.APP_NAME || 'Budget App',
  appUrl: process.env.APP_URL || 'http://localhost:3000'
};
