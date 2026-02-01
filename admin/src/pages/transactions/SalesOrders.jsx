import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { 
  mockSalesOrders, 
  mockContacts, 
  mockAnalyticalAccounts 
} from "../../data/mockData";
import { formatCurrency, formatDate } from "../../utils/formatters";
import "./TransactionPage.css";

const emptyOrder = {
  orderNumber: "",
  customerId: "",
  orderDate: "",
  deliveryDate: "",
  analyticalAccountId: "",
  status: "Draft",
  subtotal: 0,
  taxAmount: 0,
  totalAmount: 0,
};

const SalesOrders = () => {
  const [orders, setOrders] = useState(mockSalesOrders || []);
  const [contacts] = useState(mockContacts);
  const [accounts] = useState(mockAnalyticalAccounts);
  // No loading needed
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list"); // create | view | edit
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState(emptyOrder);

  /* ---------------- HELPERS ---------------- */
  const customerName = (id) => {
    const customerId = id?._id || id;
    const customer = contacts.find((c) => (c._id || c.id) === customerId);
    return customer ? customer.name : "-";
  };

  const accountName = (id) => {
    const accountId = id?._id || id;
    const account = accounts.find((a) => (a._id || a.id) === accountId);
    return account ? account.name : "-";
  };

  /* ---------------- TABLE ---------------- */
  const columns = [
    { key: "orderNumber", header: "Order #", width: "12%" },
    {
      key: "customerId",
      header: "Customer",
      render: (row) => {
        const customerId = row.customerId?._id || row.customerId;
        return customerName(customerId);
      },
      width: "20%",
    },
    { key: "orderDate", header: "Order Date", type: "date", width: "12%" },
    {
      key: "deliveryDate",
      header: "Delivery Date",
      type: "date",
      width: "12%",
    },
    { key: "totalAmount", header: "Total", type: "currency", width: "15%" },
    {
      key: "analyticalAccountId",
      header: "Analytical Account",
      render: (row) => accountName(row.analyticalAccountId),
      width: "15%",
    },
    {
      key: "status",
      header: "Status",
      type: "status",
      statusType: "order",
      width: "14%",
    },
  ];

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      if (selectedOrder) {
        const customerId = selectedOrder.customerId?._id || selectedOrder.customerId;
        const accountId = selectedOrder.analyticalAccountId?._id || selectedOrder.analyticalAccountId;
        setFormData({
          ...selectedOrder,
          customerId: customerId || "",
          analyticalAccountId: accountId || ""
        });
      }
    } else {
      setFormData(emptyOrder);
    }
  }, [mode, selectedOrder]);

  /* ---------------- ACTIONS ---------------- */
  const openCreate = () => {
    setMode("create");
    setIsModalOpen(true);
  };

  const openView = (order) => {
    setSelectedOrder(order);
    setMode("view");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setMode("list");
  };

  const createOrder = () => {
    try {
      const newOrder = {
        ...formData,
        _id: Date.now().toString()
      };
      setOrders([...orders, newOrder]);
      toast.success('Sales order created successfully');
      closeModal();
    } catch (err) {
      toast.error('Failed to create sales order');
    }
  };

  const updateOrder = () => {
    try {
      const updatedOrder = {
        ...formData,
        _id: formData._id || formData.id || selectedOrder._id
      };
      setOrders(orders.map((o) => 
        (o._id || o.id) === (formData._id || formData.id) ? updatedOrder : o
      ));
      toast.success('Sales order updated successfully');
      closeModal();
    } catch (err) {
      toast.error('Failed to update sales order');
    }
  };

  const updateStatus = (newStatus) => {
      const updated = { ...formData, status: newStatus };
      setOrders(orders.map((o) => 
        (o._id || o.id) === (formData._id || formData.id) ? updated : o
      ));
      setFormData(updated);
      toast.success(`Status updated to ${newStatus}`);
  }

  /* ---------------- FORM ---------------- */
  const renderForm = () => (
    <div className="po-form-grid">
      <div className="form-group">
        <label>Order Number</label>
        <input
          value={formData.orderNumber}
          onChange={(e) =>
            setFormData({ ...formData, orderNumber: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Customer</label>
        <select
          value={formData.customerId}
          onChange={(e) =>
            setFormData({ ...formData, customerId: e.target.value })
          }
        >
          <option value="">Select Customer</option>
          {contacts.filter(c => c.contactType === 'Customer').map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Order Date</label>
        <input
          type="date"
          value={formData.orderDate}
          onChange={(e) =>
            setFormData({ ...formData, orderDate: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Delivery Date</label>
        <input
          type="date"
          value={formData.deliveryDate}
          onChange={(e) =>
            setFormData({ ...formData, deliveryDate: e.target.value })
          }
        />
      </div>

      <div className="form-group full-width">
        <label>Analytical Account</label>
        <select
          value={formData.analyticalAccountId}
          onChange={(e) =>
            setFormData({
              ...formData,
              analyticalAccountId: e.target.value,
            })
          }
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a._id || a.id} value={a._id || a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group full-width">
        <label>Total Amount</label>
        <input
          type="number"
          value={formData.totalAmount}
          onChange={(e) =>
            setFormData({ ...formData, totalAmount: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );

  /* ---------------- VIEW ---------------- */
  const renderView = () => (
    <div className="po-view">
      <div className="po-view-header">
        <h3>{formData.orderNumber}</h3>
        <StatusBadge status={formData.status} type="order" />
      </div>

      <div className="po-view-grid">
        <p>
          <strong>Customer:</strong> {customerName(formData.customerId)}
        </p>
        <p>
          <strong>Order Date:</strong> {formatDate(formData.orderDate)}
        </p>
        <p>
          <strong>Delivery Date:</strong> {formatDate(formData.deliveryDate)}
        </p>
        <p>
          <strong>Account:</strong> {accountName(formData.analyticalAccountId)}
        </p>
      </div>

      <div className="po-summary">
        <div>
          <span>Subtotal</span>
          <span>{formatCurrency(formData.subtotal)}</span>
        </div>
        <div>
          <span>Tax</span>
          <span>{formatCurrency(formData.taxAmount)}</span>
        </div>
        <div className="total">
          <span>Total</span>
          <span>{formatCurrency(formData.totalAmount)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="transaction-page">
      <div className="transaction-page-header">
        <div>
          <h1 className="transaction-page-title">Sales Orders</h1>
          <p className="transaction-page-subtitle">
            Manage customer sales orders
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          + New Sales Order
        </button>
      </div>

      <DataTable data={orders} columns={columns} onRowClick={openView} />

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="large"
        title={
          mode === "create"
            ? "New Sales Order"
            : `Sales Order: ${formData.orderNumber}`
        }
      >
        <div className="po-modal">
          <div className="po-modal-body">
            {mode === "view" && renderView()}
            {(mode === "create" || mode === "edit") && renderForm()}
          </div>

          <div className="po-modal-footer">
            {mode === "view" && (
              <>
                <button
                  className="btn btn-warning"
                  onClick={() => updateStatus("In Transit")}
                >
                  Mark In Transit
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => updateStatus("Done")}
                >
                  Mark Done
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setMode("edit")}
                >
                  Edit
                </button>
              </>
            )}

            {mode === "create" && (
              <button className="btn btn-primary" onClick={createOrder}>
                Create
              </button>
            )}

            {mode === "edit" && (
              <button className="btn btn-primary" onClick={updateOrder}>
                Update
              </button>
            )}

            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default SalesOrders;
