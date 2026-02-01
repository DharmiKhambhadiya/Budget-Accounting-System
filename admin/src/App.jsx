import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import AdminLogin from "./pages/adminlogin";
import Signup from "./pages/Signup";

// Admin pages
import Dashboard from "./pages/Dashboard";

// Master pages
import Users from "./pages/master/Users";
import Contacts from "./pages/master/Contacts";
import Products from "./pages/master/Products";
import AnalyticalAccounts from "./pages/master/AnalyticalAccounts";
import Budgets from "./pages/master/Budgets";
import AutoAnalyticalModels from "./pages/master/AutoAnalyticalModels";

// Transaction pages
import PurchaseOrders from "./pages/transactions/PurchaseOrders";
import SalesOrders from "./pages/transactions/SalesOrders";
import VendorBills from "./pages/transactions/VendorBills";
import CustomerInvoices from "./pages/transactions/CustomerInvoices";

// Payment pages
import BillPayments from "./pages/payments/BillPayments";
import InvoicePayments from "./pages/payments/InvoicePayments";

// Reports
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* DEFAULT ENTRY — NO REDIRECT LOGIC */}
          <Route path="/" element={<AdminLogin />} />

          {/* PUBLIC ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />

            {/* Master */}
            <Route path="master/users" element={<Users />} />
            <Route path="master/contacts" element={<Contacts />} />
            <Route path="master/products" element={<Products />} />
            <Route
              path="master/analytical-accounts"
              element={<AnalyticalAccounts />}
            />
            <Route path="master/budgets" element={<Budgets />} />
            <Route
              path="master/auto-analytical-models"
              element={<AutoAnalyticalModels />}
            />

            {/* Transactions */}
            <Route
              path="transactions/purchase-orders"
              element={<PurchaseOrders />}
            />
            <Route path="transactions/sales-orders" element={<SalesOrders />} />
            <Route path="transactions/vendor-bills" element={<VendorBills />} />
            <Route
              path="transactions/customer-invoices"
              element={<CustomerInvoices />}
            />

            {/* Payments */}
            <Route path="payments/bill-payments" element={<BillPayments />} />
            <Route
              path="payments/invoice-payments"
              element={<InvoicePayments />}
            />

            {/* Reports */}
            <Route path="reports" element={<Reports />} />

            {/* Admin fallback */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Global fallback */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </Router>
  );
}

export default App;
