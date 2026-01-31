import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  DollarSign,
  FileText,
  CreditCard,
  Download,
  History,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with API calls later
  const summaryData = [
    {
      title: "Total Invoices",
      value: "1,234",
      change: "+12.5%",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Paid Amount",
      value: "₹45,678",
      change: "+8.2%",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Pending Amount",
      value: "₹12,345",
      change: "-3.1%",
      icon: CreditCard,
      color: "yellow",
    },
  ];

  // Mock invoice data for dynamic Quick Actions
  const hasUnpaidInvoices = true; // Mock: replace with actual API call
  const hasInvoices = true; // Mock: replace with actual API call

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your finances today.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {summaryData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="card group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`p-3.5 rounded-xl ${getColorClasses(item.color)} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.change.startsWith("+")
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {item.value}
                </h3>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Content Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Invoice #INV-001</p>
                  <p className="text-sm text-gray-500 mt-0.5">2 hours ago</p>
                </div>
                <span className="text-green-600 font-bold text-lg">+₹1,200</span>
              </div>
              <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Payment Received</p>
                  <p className="text-sm text-gray-500 mt-0.5">5 hours ago</p>
                </div>
                <span className="text-green-600 font-bold text-lg">+₹850</span>
              </div>
              <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">Invoice #INV-002</p>
                  <p className="text-sm text-gray-500 mt-0.5">1 day ago</p>
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>
            {!hasInvoices ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No pending actions available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/invoices")}
                  className="p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-center group"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-900">
                    View Invoices
                  </p>
                </button>
                {hasUnpaidInvoices ? (
                  <button
                    onClick={() => navigate("/invoices")}
                    className="p-5 border-2 border-dashed border-red-300 bg-red-50 rounded-xl hover:border-red-500 hover:bg-red-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-center group"
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2.5 text-red-500 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-red-700">
                      Pay Invoice
                    </p>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/invoices")}
                    className="p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-center group"
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-900">
                      View Invoices
                    </p>
                  </button>
                )}
                <button
                  onClick={() => navigate("/invoices")}
                  className="p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-center group"
                >
                  <History className="w-8 h-8 mx-auto mb-2.5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-green-900">
                    Payment History
                  </p>
                </button>
                <button
                  onClick={() => navigate("/invoices")}
                  className="p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-center group"
                >
                  <Download className="w-8 h-8 mx-auto mb-2.5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-900">
                    Download Invoice
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
