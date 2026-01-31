import { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import {
  getSalesOrders,
  getContacts,
  getAnalyticalAccounts,
  formatCurrency,
  formatDate,
} from "../../utils/dataLoader";
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
  const [orders, setOrders] = useState(getSalesOrders());
  const contacts = getContacts();
  const accounts = getAnalyticalAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list"); // create | view | edit
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState(emptyOrder);

  /* ---------------- HELPERS ---------------- */
  const customerName = (id) => contacts.find((c) => c.id === id)?.name || "-";

  const accountName = (id) => accounts.find((a) => a.id === id)?.name || "-";

  /* ---------------- TABLE ---------------- */
  const columns = [
    { key: "orderNumber", header: "Order #", width: "12%" },
    {
      key: "customerId",
      header: "Customer",
      render: (row) => customerName(row.customerId),
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
      setFormData(selectedOrder);
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
    const newOrder = {
      ...formData,
      id: Math.max(...orders.map((o) => o.id)) + 1,
    };
    setOrders([...orders, newOrder]);
    closeModal();
  };

  const updateOrder = () => {
    setOrders(orders.map((o) => (o.id === formData.id ? formData : o)));
    closeModal();
  };

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
            setFormData({ ...formData, customerId: Number(e.target.value) })
          }
        >
          <option value="">Select Customer</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
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
              analyticalAccountId: Number(e.target.value),
            })
          }
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
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

  /* ---------------- JSX ---------------- */
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
                  onClick={() =>
                    setFormData({ ...formData, status: "In Transit" })
                  }
                >
                  Mark In Transit
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setFormData({ ...formData, status: "Done" })}
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
