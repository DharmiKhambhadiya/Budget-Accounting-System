import { useNavigate } from "react-router-dom";
// import Breadcrumbs from "../components/Breadcrumbs"; // Optional, can keep if it exists
import {
  DollarSign,
  FileText,
  CreditCard,
  Download,
  History,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { mockInvoices, mockStats, mockRecentActivity } from "../data/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Compute dynamic stats from mockInvoices to be smarter
  const totalDue = mockInvoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, start) => {
        // Calculate remaining. For 'Partial', assume some paid. For 'Not Paid', full.
        // Simplifying: just sum amounts of non-paid invoices for demo.
        return sum + start.amount;
    }, 0);
  
  const totalPaid = mockInvoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, item) => sum + item.amount, 0);

  const stats = [
      {
          title: "Total Invoices",
          value: mockInvoices.length.toString(),
          change: "+3 this month",
          icon: FileText,
          color: "blue"
      },
      {
          title: "Paid Amount",
          value: `₹${totalPaid.toLocaleString()}`,
          change: "+12%",
          icon: DollarSign,
          color: "green"
      },
      {
          title: "Pending Due",
          value: `₹${totalDue.toLocaleString()}`,
          change: "Due soon",
          icon: CreditCard,
          color: "yellow"
      }
  ];

  const hasInvoices = mockInvoices.length > 0;
  const hasUnpaidInvoices = mockInvoices.some(i => i.status !== 'Paid');

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
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`p-3.5 rounded-xl ${getColorClasses(item.color)} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.timestamp}</p>
                    </div>
                    <span className={`font-bold text-lg ${activity.amount.includes('+') ? 'text-green-600' : 'text-gray-700'}`}>
                        {activity.amount}
                    </span>
                  </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>
            {!hasInvoices ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No invoices available
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
                {hasUnpaidInvoices && (
                  <button
                    onClick={() => navigate("/invoices")}
                    className="p-5 border-2 border-dashed border-red-300 bg-red-50 rounded-xl hover:border-red-500 hover:bg-red-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-center group"
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2.5 text-red-500 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-red-700">
                      Pay Invoice
                    </p>
                  </button>
                )}
                <button
                  onClick={() => navigate("/profile")}
                  className="p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-center group"
                >
                  <Download className="w-8 h-8 mx-auto mb-2.5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-900">
                    Profile
                  </p>
                </button>
                <button
                   className="p-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 hover:shadow-md transition-all duration-200 text-center group"
                   disabled
                >
                    <History className="w-8 h-8 mx-auto mb-2.5 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-400">History (N/A)</p>
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
