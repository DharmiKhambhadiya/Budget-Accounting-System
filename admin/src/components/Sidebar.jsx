import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  UserCircle,
  Package,
  Network,
  Wallet,
  Cog,
  RefreshCw,
  Truck,
  Store,
  Receipt,
  FileText,
  CreditCard,
  BarChart3,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    'Master Data': true,
    'Transactions': true,
    'Payments': true
  });

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Master Data',
      icon: Settings,
      children: [
        { title: 'Users', path: '/admin/master/users', icon: Users },
        { title: 'Contacts', path: '/admin/master/contacts', icon: UserCircle },
        { title: 'Products', path: '/admin/master/products', icon: Package },
        {
          title: 'Analytical Accounts',
          path: '/admin/master/analytical-accounts',
          icon: Network
        },
        { title: 'Budgets', path: '/admin/master/budgets', icon: Wallet },
        {
          title: 'Auto Analytical Models',
          path: '/admin/master/auto-analytical-models',
          icon: Cog
        }
      ]
    },
    {
      title: 'Transactions',
      icon: RefreshCw,
      children: [
        {
          title: 'Purchase Orders',
          path: '/admin/transactions/purchase-orders',
          icon: Truck
        },
        {
          title: 'Sales Orders',
          path: '/admin/transactions/sales-orders',
          icon: Store
        },
        {
          title: 'Vendor Bills',
          path: '/admin/transactions/vendor-bills',
          icon: Receipt
        },
        {
          title: 'Customer Invoices',
          path: '/admin/transactions/customer-invoices',
          icon: FileText
        }
      ]
    },
    {
      title: 'Payments',
      icon: Wallet,
      children: [
        {
          title: 'Bill Payments',
          path: '/admin/payments/bill-payments',
          icon: CreditCard
        },
        {
          title: 'Invoice Payments',
          path: '/admin/payments/invoice-payments',
          icon: Wallet
        }
      ]
    },
    {
      title: 'Reports',
      path: '/admin/reports',
      icon: BarChart3
    }
  ];

  const isActive = (path) => {
    // Exact match for dashboard, prefix match for others
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const hasActiveChild = (children) =>
    children?.some(child => isActive(child.path));

  const toggleMenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-blue-600 mb-1">Shiv Furniture</h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider">Budget Accounting System</p>
      </div>

      <nav className="p-4">
        {menuItems.map((item, idx) => {
          const IconComponent = item.icon;
          
          if (item.path) {
            const active = isActive(item.path);
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          }

          const hasActive = hasActiveChild(item.children);
          const isExpanded = expandedMenus[item.title] ?? hasActive;

          return (
            <div key={idx} className="mb-1">
              <button
                onClick={() => toggleMenu(item.title)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  hasActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5" />
                  <span>{item.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                  {item.children.map((child, childIdx) => {
                    const ChildIcon = child.icon;
                    const childActive = isActive(child.path);
                    return (
                      <Link
                        key={childIdx}
                        to={child.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          childActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <ChildIcon className="w-4 h-4" />
                        <span>{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
