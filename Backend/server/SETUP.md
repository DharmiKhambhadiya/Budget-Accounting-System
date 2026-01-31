# Setup Guide - Budget App

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/invoicing_user

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Application Configuration
BCRYPT_ROUNDS=10
```

### Step 3: Start MongoDB
Make sure MongoDB is installed and running:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or run directly
mongod
```

### Step 4: Run the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Step 5: Verify Installation

Open your browser or use curl:
```bash
curl http://localhost:3000/
```

You should see:
```json
{
  "message": "Budget App API",
  "version": "1.0.0",
  "status": "running"
}
```

## Creating Your First User

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "loginId": "admin",
    "email": "admin@example.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "admin",
    "password": "Admin123!"
  }'
```

Save the token from the response for authenticated requests.

## Project Structure Overview

```
budget-app/
├── config/          # Configuration files
├── controllers/     # Business logic
├── middleware/      # Auth, error handling
├── models/         # Mongoose schemas
├── routes/         # API routes
├── utils/          # Helper functions
└── server.js       # Entry point
```

## Common Commands

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start

# Check for linting errors (if configured)
npm run lint
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible on the configured port

### Port Already in Use
- Change the PORT in `.env`
- Or kill the process using the port:
  ```bash
  # Find process
  lsof -i :3000
  
  # Kill process
  kill -9 <PID>
  ```

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

1. Create your first admin user
2. Set up master data (Contacts, Products, Analytical Accounts)
3. Create budgets
4. Set up auto-analytical models
5. Start creating vendor bills and customer invoices

## API Documentation

See `PROJECT_STRUCTURE.md` for complete API documentation.
