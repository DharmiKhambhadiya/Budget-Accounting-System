import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { 
  getPurchaseOrders, 
  getContacts, 
  getProducts, 
  getAnalyticalAccounts,
  formatCurrency, 
  formatDate 
} from '../../utils/dataLoader';
import './TransactionPage.css';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState(getPurchaseOrders());
  const contacts = getContacts();
  const products = getProducts();
  const analyticalAccounts = getAnalyticalAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const getVendorName = (id) => {
    const contact = contacts.find(c => c.id === id);
    return contact ? contact.name : '-';
  };

  const getAccountName = (id) => {
    const account = analyticalAccounts.find(a => a.id === id);
    return account ? account.name : '-';
  };

  const columns = [
    { key: 'orderNumber', header: 'Order #', width: '12%' },
    {
      key: 'vendorId',
      header: 'Vendor',
      width: '20%',
      render: (row) => getVendorName(row.vendorId)
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'expectedDeliveryDate',
      header: 'Expected Delivery',
      type: 'date',
      width: '12%'
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      type: 'currency',
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
      statusType: 'order',
      width: '14%'
    }
  ];

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewMode('view');
    setIsModalOpen(true);
  };

  const renderOrderDetails = (order) => {
    if (!order) return null;

    return (
      <div className="order-details">
        <div className="order-details-header">
          <h3>{order.orderNumber}</h3>
          <StatusBadge status={order.status} type="order" />
        </div>
        
        <div className="order-details-section">
          <h4>Vendor Information</h4>
          <p><strong>Vendor:</strong> {getVendorName(order.vendorId)}</p>
          <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
          <p><strong>Expected Delivery:</strong> {formatDate(order.expectedDeliveryDate)}</p>
          <p><strong>Analytical Account:</strong> {getAccountName(order.analyticalAccountId)}</p>
        </div>

        <div className="order-details-section">
          <h4>Items</h4>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax Rate</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <tr key={idx}>
                    <td>{product ? product.name : `Product #${item.productId}`}</td>
                    <td>{item.quantity} {product ? product.unit : ''}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{item.taxRate}%</td>
                    <td>{formatCurrency(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="order-details-section">
          <div className="order-summary">
            <div className="order-summary-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="order-summary-row">
              <span>Tax Amount:</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="order-summary-row order-summary-total">
              <span>Total Amount:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
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
          <h1 className="transaction-page-title">Purchase Orders</h1>
          <p className="transaction-page-subtitle">Manage vendor purchase orders</p>
        </div>
      </div>

      <DataTable
        data={orders}
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
          setSelectedOrder(null);
        }}
        title={selectedOrder ? `Purchase Order: ${selectedOrder.orderNumber}` : 'Purchase Order'}
        size="large"
      >
        {renderOrderDetails(selectedOrder)}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default PurchaseOrders;
