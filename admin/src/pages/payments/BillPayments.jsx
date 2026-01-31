import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { 
  getBillPayments, 
  getVendorBills,
  getAnalyticalAccounts,
  formatCurrency, 
  formatDate 
} from '../../utils/dataLoader';
import './PaymentPage.css';

const BillPayments = () => {
  const [payments, setPayments] = useState(getBillPayments());
  const vendorBills = getVendorBills();
  const analyticalAccounts = getAnalyticalAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const getBillNumber = (id) => {
    const bill = vendorBills.find(b => b.id === id);
    return bill ? bill.billNumber : '-';
  };

  const getAccountName = (id) => {
    const account = analyticalAccounts.find(a => a.id === id);
    return account ? account.name : '-';
  };

  const columns = [
    { key: 'paymentNumber', header: 'Payment #', width: '12%' },
    {
      key: 'vendorBillId',
      header: 'Vendor Bill',
      width: '15%',
      render: (row) => getBillNumber(row.vendorBillId)
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      width: '15%'
    },
    {
      key: 'amount',
      header: 'Amount',
      type: 'currency',
      width: '15%'
    },
    {
      key: 'referenceNumber',
      header: 'Reference #',
      width: '15%'
    },
    {
      key: 'analyticalAccountId',
      header: 'Analytical Account',
      width: '15%',
      render: (row) => getAccountName(row.analyticalAccountId)
    },
    {
      key: 'status',
      header: 'Status',
      type: 'status',
      width: '11%'
    }
  ];

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const renderPaymentDetails = (payment) => {
    if (!payment) return null;

    const bill = vendorBills.find(b => b.id === payment.vendorBillId);

    return (
      <div className="payment-details">
        <div className="payment-details-header">
          <h3>{payment.paymentNumber}</h3>
          <StatusBadge status={payment.status} />
        </div>
        
        <div className="payment-details-section">
          <h4>Payment Information</h4>
          <p><strong>Vendor Bill:</strong> {getBillNumber(payment.vendorBillId)}</p>
          {bill && (
            <>
              <p><strong>Bill Amount:</strong> {formatCurrency(bill.totalAmount)}</p>
              <p><strong>Bill Remaining:</strong> {formatCurrency(bill.remainingAmount)}</p>
            </>
          )}
          <p><strong>Payment Date:</strong> {formatDate(payment.paymentDate)}</p>
          <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
          <p><strong>Amount:</strong> {formatCurrency(payment.amount)}</p>
          <p><strong>Reference Number:</strong> {payment.referenceNumber}</p>
          <p><strong>Analytical Account:</strong> {getAccountName(payment.analyticalAccountId)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="payment-page">
      <div className="payment-page-header">
        <div>
          <h1 className="payment-page-title">Bill Payments</h1>
          <p className="payment-page-subtitle">Manage vendor bill payments</p>
        </div>
      </div>

      <DataTable
        data={payments}
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
          setSelectedPayment(null);
        }}
        title={selectedPayment ? `Bill Payment: ${selectedPayment.paymentNumber}` : 'Bill Payment'}
        size="medium"
      >
        {renderPaymentDetails(selectedPayment)}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default BillPayments;
