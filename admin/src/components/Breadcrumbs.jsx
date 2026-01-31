import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on login page
  if (location.pathname === '/login') {
    return null;
  }

  const getBreadcrumbName = (path) => {
    const names = {
      '': 'Dashboard',
      dashboard: 'Dashboard',
      master: 'Master Data',
      users: 'Users',
      contacts: 'Contacts',
      products: 'Products',
      'analytical-accounts': 'Analytical Accounts',
      budgets: 'Budgets',
      'auto-analytical-models': 'Auto Analytical Models',
      transactions: 'Transactions',
      'purchase-orders': 'Purchase Orders',
      'sales-orders': 'Sales Orders',
      'vendor-bills': 'Vendor Bills',
      'customer-invoices': 'Customer Invoices',
      payments: 'Payments',
      'bill-payments': 'Bill Payments',
      'invoice-payments': 'Invoice Payments',
      reports: 'Reports',
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav 
      className="flex items-center space-x-2 text-sm mb-6 text-gray-600"
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center transition-colors hover:text-blue-600"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = getBreadcrumbName(value);

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="transition-colors hover:text-blue-600"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
