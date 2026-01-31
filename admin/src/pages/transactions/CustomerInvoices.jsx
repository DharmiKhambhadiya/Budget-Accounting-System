import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { 
  getCustomerInvoices, 
  getContacts, 
  getSalesOrders,
  getAnalyticalAccounts,
  formatCurrency, 
  formatDate 
} from '../../utils/dataLoader';
import './TransactionPage.css';

const CustomerInvoices = () => {
  const [invoices, setInvoices] = useState(getCustomerInvoices());
  const contacts = getContacts();
  const salesOrders = getSalesOrders();
  const analyticalAccounts = getAnalyticalAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const getCustomerName = (id) => {
    const contact = contacts.find(c => c.id === id);
    return contact ? contact.name : '-';
  };

  const getSONumber = (id) => {
    if (!id) return '-';
    const so = salesOrders.find(s => s.id === id);
    return so ? so.orderNumber : '-';
  };

  const getAccountName = (id) => {
    const account = analyticalAccounts.find(a => a.id === id);
    return account ? account.name : '-';
  };

  const columns = [
    { key: 'invoiceNumber', header: 'Invoice #', width: '12%' },
    {
      key: 'customerId',
      header: 'Customer',
      width: '18%',
      render: (row) => getCustomerName(row.customerId)
    },
    {
      key: 'salesOrderId',
      header: 'SO #',
      width: '12%',
      render: (row) => getSONumber(row.salesOrderId)
    },
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'totalAmount',
      header: 'Total',
      type: 'currency',
      width: '12%'
    },
    {
      key: 'remainingAmount',
      header: 'Remaining',
      type: 'currency',
      width: '12%'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'status',
      statusType: 'payment',
      width: '10%'
    }
  ];

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const renderInvoiceDetails = (invoice) => {
    if (!invoice) return null;

    const paymentPercentage = invoice.totalAmount > 0 
      ? ((invoice.paidAmount / invoice.totalAmount) * 100).toFixed(1)
      : 0;

    return (
      <div className="order-details">
        <div className="order-details-header">
          <h3>{invoice.invoiceNumber}</h3>
          <StatusBadge status={invoice.status} type="payment" />
        </div>
        
        <div className="order-details-section">
          <h4>Customer Information</h4>
          <p><strong>Customer:</strong> {getCustomerName(invoice.customerId)}</p>
          <p><strong>Sales Order:</strong> {getSONumber(invoice.salesOrderId)}</p>
          <p><strong>Invoice Date:</strong> {formatDate(invoice.invoiceDate)}</p>
          <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
          <p><strong>Analytical Account:</strong> {getAccountName(invoice.analyticalAccountId)}</p>
        </div>

        <div className="order-details-section">
          <h4>Payment Status</h4>
          <div className="payment-status">
            <div className="payment-status-row">
              <span>Total Amount:</span>
              <span className="amount-total">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="payment-status-row">
              <span>Paid Amount:</span>
              <span className="amount-paid">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="payment-status-row">
              <span>Remaining Amount:</span>
              <span className="amount-remaining">{formatCurrency(invoice.remainingAmount)}</span>
            </div>
            <div className="payment-progress">
              <div className="payment-progress-bar">
                <div 
                  className="payment-progress-fill"
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>
              <span className="payment-progress-text">{paymentPercentage}% Paid</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="transaction-page">
      <div className="transaction-page-header">
        <div>
          <h1 className="transaction-page-title">Customer Invoices</h1>
          <p className="transaction-page-subtitle">Manage customer invoices and payments</p>
        </div>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        onRowClick={handleView}
        actions={(row) => (
          <button
            className="btn-link"
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
          >
            View
          </button>
        )}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInvoice(null);
        }}
        title={selectedInvoice ? `Customer Invoice: ${selectedInvoice.invoiceNumber}` : 'Customer Invoice'}
        size="medium"
      >
        {renderInvoiceDetails(selectedInvoice)}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default CustomerInvoices;
