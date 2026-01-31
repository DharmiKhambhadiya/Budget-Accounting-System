import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import contactRoutes from './routes/contact.routes.js';
import productRoutes from './routes/product.routes.js';
import analyticalAccountRoutes from './routes/analyticalAccount.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import autoAnalyticalModelRoutes from './routes/autoAnalyticalModel.routes.js';
import vendorBillRoutes from './routes/vendorBill.routes.js';
import billPaymentRoutes from './routes/billPayment.routes.js';
import salesOrderRoutes from './routes/salesOrder.routes.js';
import customerInvoiceRoutes from './routes/customerInvoice.routes.js';
import invoicePaymentRoutes from './routes/invoicePayment.routes.js';
import purchaseOrderRoutes from './routes/purchaseOrder.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Import error handler
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoicing_user')
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Budget App API', 
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytical-accounts', analyticalAccountRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/auto-analytical-models', autoAnalyticalModelRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/vendor-bills', vendorBillRoutes);
app.use('/api/bill-payments', billPaymentRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/customer-invoices', customerInvoiceRoutes);
app.use('/api/invoice-payments', invoicePaymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
