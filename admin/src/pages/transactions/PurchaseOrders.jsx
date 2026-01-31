import { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import {
  getPurchaseOrders,
  getContacts,
  getAnalyticalAccounts,
  formatCurrency,
  formatDate,
} from "../../utils/dataLoader";
import "./TransactionPage.css";

const emptyOrder = {
  orderNumber: "",
  vendorId: "",
  orderDate: "",
  expectedDeliveryDate: "",
  analyticalAccountId: "",
  status: "Draft",
  subtotal: 0,
  taxAmount: 0,
  totalAmount: 0,
};

const PurchaseOrders = () => {
  const [orders, setOrders] = useState(getPurchaseOrders());
  const contacts = getContacts();
  const accounts = getAnalyticalAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list"); // create | view | edit
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState(emptyOrder);

  /* ---------- HELPERS ---------- */
  const vendorName = (id) => contacts.find((c) => c.id === id)?.name || "-";
  const accountName = (id) => accounts.find((a) => a.id === id)?.name || "-";

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "orderNumber", header: "Order #", width: "12%" },
    {
      key: "vendorId",
      header: "Vendor",
      render: (r) => vendorName(r.vendorId),
    },
    { key: "orderDate", header: "Order Date", type: "date" },
    { key: "expectedDeliveryDate", header: "Delivery", type: "date" },
    { key: "totalAmount", header: "Total", type: "currency" },
    {
      key: "status",
      header: "Status",
      type: "status",
      statusType: "order",
    },
  ];

  /* ---------- EFFECT ---------- */
  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(selectedOrder);
    } else {
      setFormData(emptyOrder);
    }
  }, [mode, selectedOrder]);

  /* ---------- ACTIONS ---------- */
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
    setOrders([
      ...orders,
      { ...formData, id: Math.max(...orders.map((o) => o.id)) + 1 },
    ]);
    closeModal();
  };

  const updateOrder = () => {
    setOrders(orders.map((o) => (o.id === formData.id ? formData : o)));
    closeModal();
  };

  /* ---------- FORM ---------- */
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
        <label>Vendor</label>
        <select
          value={formData.vendorId}
          onChange={(e) =>
            setFormData({ ...formData, vendorId: Number(e.target.value) })
          }
        >
          <option value="">Select Vendor</option>
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
        <label>Expected Delivery</label>
        <input
          type="date"
          value={formData.expectedDeliveryDate}
          onChange={(e) =>
            setFormData({ ...formData, expectedDeliveryDate: e.target.value })
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

  /* ---------- VIEW ---------- */
  const renderView = () => (
    <div className="po-view">
      <div className="po-view-header">
        <h3>{formData.orderNumber}</h3>
        <StatusBadge status={formData.status} type="order" />
      </div>

      <div className="po-view-grid">
        <p>
          <strong>Vendor:</strong> {vendorName(formData.vendorId)}
        </p>
        <p>
          <strong>Order Date:</strong> {formatDate(formData.orderDate)}
        </p>
        <p>
          <strong>Delivery:</strong> {formatDate(formData.expectedDeliveryDate)}
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

  /* ---------- JSX ---------- */
  return (
    <div className="transaction-page">
      <div className="transaction-page-header">
        <div>
          <h1>Purchase Orders</h1>
          <p>Manage vendor purchase orders</p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          + New Purchase Order
        </button>
      </div>

      <DataTable data={orders} columns={columns} onRowClick={openView} />

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="large"
        title={
          mode === "create"
            ? "New Purchase Order"
            : `Purchase Order: ${formData.orderNumber}`
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

export default PurchaseOrders;
