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
      path: '/',
      icon: LayoutDashboard
    },
    {
      title: 'Master Data',
      icon: Settings,
      children: [
        { title: 'Users', path: '/master/users', icon: Users },
        { title: 'Contacts', path: '/master/contacts', icon: UserCircle },
        { title: 'Products', path: '/master/products', icon: Package },
        {
          title: 'Analytical Accounts',
          path: '/master/analytical-accounts',
          icon: Network
        },
        { title: 'Budgets', path: '/master/budgets', icon: Wallet },
        {
          title: 'Auto Analytical Models',
          path: '/master/auto-analytical-models',
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
          path: '/transactions/purchase-orders',
          icon: Truck
        },
        {
          title: 'Sales Orders',
          path: '/transactions/sales-orders',
          icon: Store
        },
        {
          title: 'Vendor Bills',
          path: '/transactions/vendor-bills',
          icon: Receipt
        },
        {
          title: 'Customer Invoices',
          path: '/transactions/customer-invoices',
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
          path: '/payments/bill-payments',
          icon: CreditCard
        },
        {
          title: 'Invoice Payments',
          path: '/payments/invoice-payments',
          icon: Wallet
        }
      ]
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: BarChart3
    }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
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
