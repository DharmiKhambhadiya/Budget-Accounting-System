import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { FileText } from 'lucide-react';

const Invoices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Format invoice number as INV/YYYY/0001
  const formatInvoiceNumber = (id) => {
    const year = new Date().getFullYear();
    const paddedId = String(id).padStart(4, '0');
    return `INV/${year}/${paddedId}`;
  };

  // Get invoice status from localStorage (updated after payment)
  const getInvoiceStatus = (invoiceId) => {
    const savedStatus = localStorage.getItem(`invoice_${invoiceId}_status`);
    return savedStatus;
  };

  // Mock invoice data - replace with API call
  // Customer can only see their own invoices
  const baseInvoices = [
    {
      id: '0001',
      invoiceNumber: formatInvoiceNumber('0001'),
      date: '2025-01-15',
      dueDate: '2025-02-15',
      amount: 12500.00,
      status: 'Not Paid',
      customerId: user?.id,
    },
    {
      id: '0002',
      invoiceNumber: formatInvoiceNumber('0002'),
      date: '2025-01-10',
      dueDate: '2025-02-10',
      amount: 8500.00,
      status: 'Paid',
      customerId: user?.id,
    },
    {
      id: '0003',
      invoiceNumber: formatInvoiceNumber('0003'),
      date: '2025-01-05',
      dueDate: '2025-02-05',
      amount: 15200.00,
      status: 'Partial',
      customerId: user?.id,
    },
  ];

  // Update invoice status from localStorage if available
  const invoices = baseInvoices.map(inv => ({
    ...inv,
    status: getInvoiceStatus(inv.id) || inv.status,
  }));

  const handleRowClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-gray-600">View and manage your invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="table-header">
                    Invoice Number
                  </th>
                  <th className="table-header">
                    Date
                  </th>
                  <th className="table-header">
                    Due Date
                  </th>
                  <th className="table-header text-right">
                    Amount
                  </th>
                  <th className="table-header text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No invoices found</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      onClick={() => handleRowClick(invoice.id)}
                      className="table-row group"
                    >
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell text-gray-600">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="table-cell text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="table-cell text-right font-semibold text-gray-900">
                        ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                            invoice.status === 'Paid'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : invoice.status === 'Partial'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
