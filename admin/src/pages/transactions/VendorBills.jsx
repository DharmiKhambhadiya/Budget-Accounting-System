import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import {
  getVendorBills,
  getContacts,
  getPurchaseOrders,
  getAnalyticalAccounts,
  formatCurrency,
  formatDate
} from '../../utils/dataLoader';
import './TransactionPage.css';

const VendorBills = () => {
  const [bills] = useState(getVendorBills());
  const contacts = getContacts();
  const purchaseOrders = getPurchaseOrders();
  const analyticalAccounts = getAnalyticalAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getVendorName = (id) => {
    const vendor = contacts.find(c => c.id === id);
    return vendor ? vendor.name : '-';
  };

  const getPONumber = (id) => {
    if (!id) return '-';
    const po = purchaseOrders.find(p => p.id === id);
    return po ? po.orderNumber : '-';
  };

  const getAccountName = (id) => {
    const acc = analyticalAccounts.find(a => a.id === id);
    return acc ? acc.name : '-';
  };

  const columns = [
    { key: 'billNumber', header: 'Bill #', width: '12%' },
    {
      key: 'vendorId',
      header: 'Vendor',
      width: '18%',
      render: (row) => getVendorName(row.vendorId)
    },
    {
      key: 'purchaseOrderId',
      header: 'PO #',
      width: '12%',
      render: (row) => getPONumber(row.purchaseOrderId)
    },
    { key: 'billDate', header: 'Bill Date', type: 'date', width: '12%' },
    { key: 'dueDate', header: 'Due Date', type: 'date', width: '12%' },
    { key: 'totalAmount', header: 'Total', type: 'currency', width: '12%' },
    { key: 'remainingAmount', header: 'Remaining', type: 'currency', width: '12%' },
    {
      key: 'status',
      header: 'Status',
      type: 'status',
      statusType: 'payment',
      width: '10%'
    }
  ];

  const handleView = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const renderBillDetails = (bill) => {
    if (!bill) return null;

    const paymentPercentage =
      bill.totalAmount > 0
        ? ((bill.paidAmount / bill.totalAmount) * 100).toFixed(1)
        : 0;

    return (
      <div className="order-details">
        <div className="order-details-header">
          <h3>{bill.billNumber}</h3>
          <StatusBadge status={bill.status} type="payment" />
        </div>

        <div className="order-details-section">
          <h4>Vendor Information</h4>
          <p><strong>Vendor:</strong> {getVendorName(bill.vendorId)}</p>
          <p><strong>Purchase Order:</strong> {getPONumber(bill.purchaseOrderId)}</p>
          <p><strong>Bill Date:</strong> {formatDate(bill.billDate)}</p>
          <p><strong>Due Date:</strong> {formatDate(bill.dueDate)}</p>
          <p><strong>Analytical Account:</strong> {getAccountName(bill.analyticalAccountId)}</p>
        </div>

        <div className="order-details-section">
          <h4>Payment Status</h4>
          <div className="payment-status">
            <div className="payment-status-row">
              <span>Total Amount:</span>
              <span className="amount-total">{formatCurrency(bill.totalAmount)}</span>
            </div>
            <div className="payment-status-row">
              <span>Paid Amount:</span>
              <span className="amount-paid">{formatCurrency(bill.paidAmount)}</span>
            </div>
            <div className="payment-status-row">
              <span>Remaining Amount:</span>
              <span className="amount-remaining">{formatCurrency(bill.remainingAmount)}</span>
            </div>

            <div className="payment-progress">
              <div className="payment-progress-bar">
                <div
                  className="payment-progress-fill"
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>
              <span className="payment-progress-text">
                {paymentPercentage}% Paid
              </span>
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
          <h1 className="transaction-page-title">Vendor Bills</h1>
          <p className="transaction-page-subtitle">
            Manage vendor bills and outgoing payments
          </p>
        </div>
      </div>

      <DataTable
        data={bills}
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
          setSelectedBill(null);
        }}
        title={selectedBill ? `Vendor Bill: ${selectedBill.billNumber}` : 'Vendor Bill'}
        size="medium"
      >
        {renderBillDetails(selectedBill)}
        <div className="form-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default VendorBills;
