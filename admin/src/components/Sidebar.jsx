import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// New icon set (distinct & meaningful)
import {
  MdSpaceDashboard,
  MdSettingsApplications,
  MdGroup,
  MdPermContactCalendar,
  MdCategory,
  MdSchema,
  MdSavings,
  MdPrecisionManufacturing,
  MdSyncAlt,
  MdLocalShipping,
  MdStorefront,
  MdReceipt,
  MdRequestQuote,
  MdAccountBalanceWallet,
  MdPayments,
  MdBarChart
} from 'react-icons/md';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <MdSpaceDashboard />
    },
    {
      title: 'Master Data',
      icon: <MdSettingsApplications />,
      children: [
        { title: 'Users', path: '/master/users', icon: <MdGroup /> },
        { title: 'Contacts', path: '/master/contacts', icon: <MdPermContactCalendar /> },
        { title: 'Products', path: '/master/products', icon: <MdCategory /> },
        {
          title: 'Analytical Accounts',
          path: '/master/analytical-accounts',
          icon: <MdSchema />
        },
        { title: 'Budgets', path: '/master/budgets', icon: <MdSavings /> },
        {
          title: 'Auto Analytical Models',
          path: '/master/auto-analytical-models',
          icon: <MdPrecisionManufacturing />
        }
      ]
    },
    {
      title: 'Transactions',
      icon: <MdSyncAlt />,
      children: [
        {
          title: 'Purchase Orders',
          path: '/transactions/purchase-orders',
          icon: <MdLocalShipping />
        },
        {
          title: 'Sales Orders',
          path: '/transactions/sales-orders',
          icon: <MdStorefront />
        },
        {
          title: 'Vendor Bills',
          path: '/transactions/vendor-bills',
          icon: <MdReceipt />
        },
        {
          title: 'Customer Invoices',
          path: '/transactions/customer-invoices',
          icon: <MdRequestQuote />
        }
      ]
    },
    {
      title: 'Payments',
      icon: <MdAccountBalanceWallet />,
      children: [
        {
          title: 'Bill Payments',
          path: '/payments/bill-payments',
          icon: <MdPayments />
        },
        {
          title: 'Invoice Payments',
          path: '/payments/invoice-payments',
          icon: <MdAccountBalanceWallet />
        }
      ]
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: <MdBarChart />
    }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const hasActiveChild = (children) =>
    children?.some(child => isActive(child.path));

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Shiv Furniture</h1>
        <p className="sidebar-subtitle">Budget Accounting System</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <div key={idx} className="sidebar-menu-item">
            {item.path ? (
              <Link
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </Link>
            ) : (
              <>
                <div
                  className={`sidebar-parent ${
                    hasActiveChild(item.children) ? 'active' : ''
                  }`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.title}</span>
                </div>

                <div className="sidebar-children">
                  {item.children.map((child, childIdx) => (
                    <Link
                      key={childIdx}
                      to={child.path}
                      className={`sidebar-link sidebar-child-link ${
                        isActive(child.path) ? 'active' : ''
                      }`}
                    >
                      <span className="sidebar-icon">{child.icon}</span>
                      <span className="sidebar-text">{child.title}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
