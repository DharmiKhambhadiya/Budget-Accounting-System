import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on login/forgot-password pages
  if (location.pathname === '/login' || location.pathname === '/forgot-password') {
    return null;
  }

  const getBreadcrumbName = (path) => {
    const names = {
      dashboard: 'Dashboard',
      invoices: 'Invoices',
      payments: 'Payments',
      'sales-orders': 'Sales Orders',
      profile: 'Profile',
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const isInvoiceDetail = pathnames.length === 2 && pathnames[0] === 'invoices' && pathnames[1] !== '';

  // Check if we're on a dark theme page (no longer needed, but keeping for consistency)
  const isDarkPage = false; // All pages now use light theme

  // Format invoice number for breadcrumb
  const formatInvoiceNumber = (id) => {
    if (!id) return '';
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(4, '0');
    return `INV/${year}/${paddedId}`;
  };

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm mb-6 ${isDarkPage ? 'text-gray-400' : 'text-gray-600'}`}
      aria-label="Breadcrumb"
    >
      <Link
        to="/dashboard"
        className={`flex items-center transition-colors ${isDarkPage ? 'hover:text-white' : 'hover:text-blue-600'}`}
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        let displayName;
        
        if (isInvoiceDetail && index === 1) {
          displayName = formatInvoiceNumber(value);
        } else {
          displayName = getBreadcrumbName(value);
        }

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className={`w-4 h-4 ${isDarkPage ? 'text-gray-500' : 'text-gray-400'}`} />
            {isLast ? (
              <span className={`font-medium ${isDarkPage ? 'text-white' : 'text-gray-900'}`}>
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className={`transition-colors ${isDarkPage ? 'hover:text-white' : 'hover:text-blue-600'}`}
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
