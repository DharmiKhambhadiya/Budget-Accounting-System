# Budget App - MongoDB Database Design

## Overview

This is a comprehensive MongoDB database design for an invoicing and budget management system. The database handles user management, vendor bills, customer invoices, sales orders, and budget tracking with analytical accounts.

## Database Name
**`invoicing_user`**

## Collections

### Core Collections (11 Total)

1. **users** - User authentication and authorization
2. **contacts** - Vendors and Customers master data
3. **products** - Product/Inventory master data
4. **analytical_accounts** - Cost centers for budget tracking
5. **budgets** - Budget allocations linked to analytical accounts
6. **auto_analytical_models** - Rules for automatic cost center assignment
7. **vendor_bills** - Bills received from vendors
8. **bill_payments** - Payments made for vendor bills
9. **sales_orders** - Customer orders
10. **customer_invoices** - Invoices sent to customers
11. **invoice_payments** - Payments received from customers

## Key Features

### User Management
- **Login ID**: 6-12 characters, unique
- **Email**: Valid format, unique, no duplicates
- **Password**: Minimum 8 characters with:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one special character
- **Roles**: `user` and `admin`

### Master Data
- **Contact Master**: Stores vendors and customers with GST numbers, addresses
- **Product Master**: Inventory items with categories, units, prices
- **Analytical Accounts**: Cost centers (e.g., "Showroom Rent", "Factory Labor", "Marketing Expo 2026")

### Budget Management
- Budgets linked to analytical accounts
- Track spent vs. allocated amounts
- Support for monthly, quarterly, yearly, or custom periods

### Auto-Analytical Assignment
- Rules-based automatic assignment of analytical accounts
- Can be based on vendor, product, amount, or custom conditions
- Priority-based rule matching

### Invoice Flow
1. **Vendor Side**: Vendor Bills → Bill Payments
2. **Customer Side**: Sales Orders → Customer Invoices → Invoice Payments

## Files in This Project

1. **database-design.md** - Complete schema documentation with field descriptions
2. **database-diagram.md** - Visual Mermaid diagrams (ERD and flow charts)
3. **mongodb-schemas.json** - JSON schema validators for MongoDB
4. **PROJECT_STRUCTURE.md** - Complete project structure and API documentation
5. **README.md** - This file

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Port number

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

4. **Run the Application**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

5. **Test the API**
   The server will run on `http://localhost:3000` (or your configured port)
   
   Test endpoint:
   ```bash
   curl http://localhost:3000/
   ```

## API Usage Examples

### 1. Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "loginId": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "user"
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "loginId": "johndoe",
  "password": "Password123!"
}
```

### 3. Create Contact (Vendor)
```bash
POST /api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Timber Mart",
  "contactType": "vendor",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "gstNumber": "27ABCDE1234F1Z5",
  "email": "info@timmermart.com",
  "phone": "+91-9876543210"
}
```

### 4. Create Vendor Bill
```bash
POST /api/vendor-bills
Authorization: Bearer <token>
Content-Type: application/json

{
  "billNumber": "VB-2024-001",
  "vendorId": "<vendor_id>",
  "billDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "items": [
    {
      "productId": "<product_id>",
      "quantity": 100,
      "unitPrice": 500,
      "taxRate": 18,
      "amount": 59000
    }
  ],
  "subtotal": 50000,
  "taxAmount": 9000,
  "totalAmount": 59000
}
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: Helmet.js, CORS
- **Logging**: Morgan

## Relationships

### Primary Relationships
- Users create all records (audit trail)
- Contacts (vendors) → Vendor Bills → Bill Payments
- Contacts (customers) → Sales Orders → Customer Invoices → Invoice Payments
- Products → Items in Bills, Orders, and Invoices
- Analytical Accounts → Linked to all financial documents
- Budgets → Track spending against Analytical Accounts
- Auto-Analytical Models → Automatically assign Analytical Accounts

## Validation Rules

### User Registration
- `loginId`: 6-12 characters, unique
- `email`: Valid email, unique, no duplicates
- `password`: 8+ chars, uppercase, lowercase, special character

### Financial Documents
- All amounts must be ≥ 0
- Invoice numbers, bill numbers, payment numbers must be unique
- Status fields use predefined enums

## Implementation Notes

1. **Password Security**: Use bcrypt or similar for password hashing
2. **Calculated Fields**: 
   - `remainingAmount` = `totalAmount` - `paidAmount`
   - `spentAmount` in budgets should be updated when bills/payments are created
3. **Auto-Assignment**: Check `auto_analytical_models` when creating vendor bills
4. **Status Updates**: Automatically update invoice status based on payment amounts
5. **Soft Deletes**: Use `isActive` flag instead of hard deletes
6. **Timestamps**: All collections have `createdAt` and `updatedAt`

## Indexes

Each collection has appropriate indexes for:
- Unique fields (loginId, email, billNumber, invoiceNumber, etc.)
- Foreign key lookups (vendorId, customerId, analyticalAccountId, etc.)
- Query optimization (status, dates, etc.)

## Next Steps

1. Set up MongoDB database with name `invoicing_user`
2. Create collections with the schemas defined
3. Set up indexes as specified
4. Implement validation using the JSON schemas
5. Build API endpoints for CRUD operations
6. Implement authentication and authorization
7. Add business logic for auto-analytical assignment
8. Implement budget tracking and reporting

## Example Queries

### Find all unpaid vendor bills
```javascript
db.vendor_bills.find({ status: { $ne: "paid" } })
```

### Get budget spending for a period
```javascript
db.budgets.aggregate([
  { $match: { analyticalAccountId: ObjectId("...") } },
  { $project: { 
      name: 1, 
      amount: 1, 
      spentAmount: 1, 
      remainingAmount: { $subtract: ["$amount", "$spentAmount"] }
    }
  }
])
```

### Find invoices with overdue payments
```javascript
db.customer_invoices.find({
  dueDate: { $lt: new Date() },
  status: { $in: ["sent", "partially_paid"] }
})
```
