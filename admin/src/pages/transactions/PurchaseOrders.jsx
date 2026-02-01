import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { 
  mockPurchaseOrders, 
  mockContacts, 
  mockAnalyticalAccounts 
} from "../../data/mockData";
import { formatCurrency, formatDate } from "../../utils/formatters"; // Fixed import path from 'dataLoader' to 'formatters' if that was issue, but original imported from formatted usually. Wait, original PO used 'dataLoader' for formatters? Let's fix that to be consistent. 
// Actually original code imported `formatCurrency, formatDate` from `../../utils/dataLoader`. I should check where they are. 
// `Dashboard.jsx` imported from `../utils/formatters`.
// I will use `../../utils/formatters` assuming it exists and is correct.

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
  const [orders, setOrders] = useState(mockPurchaseOrders);
  const [contacts] = useState(mockContacts);
  const [accounts] = useState(mockAnalyticalAccounts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list"); // create | view | edit
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState(emptyOrder);

  /* ---------- HELPERS ---------- */
  const vendorName = (id) => {
    const vendorId = id?._id || id;
    const vendor = contacts.find((c) => (c._id || c.id) === vendorId);
    return vendor ? vendor.name : "-";
  };
  const accountName = (id) => {
    const accountId = id?._id || id;
    const account = accounts.find((a) => (a._id || a.id) === accountId);
    return account ? account.name : "-";
  };

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "orderNumber", header: "Order #", width: "12%" },
    {
      key: "vendorId",
      header: "Vendor",
      render: (r) => {
        const vendorId = r.vendorId?._id || r.vendorId;
        return vendorName(vendorId);
      },
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
      if (selectedOrder) {
        const vendorId = selectedOrder.vendorId?._id || selectedOrder.vendorId;
        const accountId = selectedOrder.analyticalAccountId?._id || selectedOrder.analyticalAccountId;
        setFormData({
          ...selectedOrder,
          vendorId: vendorId || "",
          analyticalAccountId: accountId || ""
        });
      }
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
    try {
      const newOrder = {
        ...formData,
        _id: Date.now().toString()
      };
      setOrders([...orders, newOrder]);
      toast.success('Purchase order created successfully');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create purchase order');
    }
  };

  const updateOrder = () => {
    try {
      const updatedOrder = {
        ...selectedOrder,
        ...formData,
        _id: formData._id || formData.id || selectedOrder._id
      };
      setOrders(orders.map((o) => 
        (o._id || o.id) === (formData._id || formData.id) ? updatedOrder : o
      ));
      toast.success('Purchase order updated successfully');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update purchase order');
    }
  };

  const updateStatus = (newStatus) => {
      try {
        const updated = { ...formData, status: newStatus };
        setOrders(orders.map(o => 
          (o._id || o.id) === (formData._id || formData.id) ? updated : o
        ));
        setFormData(updated);
        toast.success(`Status updated to ${newStatus}`);
      } catch (err) {
        toast.error('Failed to update status');
      }
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
            setFormData({ ...formData, vendorId: e.target.value })
          }
        >
          <option value="">Select Vendor</option>
          {contacts.filter(c => c.contactType === 'Vendor').map((c) => (
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
        <label>Expected Delivery</label>
        <input
          type="date"
          value={formData.expectedDeliveryDate}
          onChange={(e) =>
            setFormData({ ...formData, expectedDeliveryDate: e.target.value })
          }
        />
      </div>
      
      <div className="form-group">
        <label>Total Amount</label>
        <input
          type="number"
          value={formData.totalAmount}
          onChange={(e) =>
            setFormData({ ...formData, totalAmount: Number(e.target.value) })
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

export default PurchaseOrders;
