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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/master/Users";
import Contacts from "./pages/master/Contacts";
import Products from "./pages/master/Products";
import AnalyticalAccounts from "./pages/master/AnalyticalAccounts";
import Budgets from "./pages/master/Budgets";
import AutoAnalyticalModels from "./pages/master/AutoAnalyticalModels";
import PurchaseOrders from "./pages/transactions/PurchaseOrders";
import SalesOrders from "./pages/transactions/SalesOrders";
import VendorBills from "./pages/transactions/VendorBills";
import CustomerInvoices from "./pages/transactions/CustomerInvoices";
import BillPayments from "./pages/payments/BillPayments";
import InvoicePayments from "./pages/payments/InvoicePayments";
import Reports from "./pages/Reports";
import "./App.css";
import AdminLogin from "./pages/adminlogin";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Master Data Routes */}
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

            {/* Transaction Routes */}
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

            {/* Payment Routes */}
            <Route path="payments/bill-payments" element={<BillPayments />} />
            <Route
              path="payments/invoice-payments"
              element={<InvoicePayments />}
            />

            {/* Reports Route */}
            <Route path="reports" element={<Reports />} />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
