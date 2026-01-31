import { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import {
  getCustomerInvoices,
  getContacts,
  getSalesOrders,
  getAnalyticalAccounts,
  formatCurrency,
  formatDate,
} from "../../utils/dataLoader";
import "./TransactionPage.css";

const emptyInvoice = {
  invoiceNumber: "",
  customerId: "",
  salesOrderId: "",
  invoiceDate: "",
  dueDate: "",
  analyticalAccountId: "",
  status: "Unpaid",
  totalAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
};

const CustomerInvoices = () => {
  const [invoices, setInvoices] = useState(getCustomerInvoices());
  const contacts = getContacts();
  const salesOrders = getSalesOrders();
  const accounts = getAnalyticalAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list"); // create | view | edit
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState(emptyInvoice);

  /* ---------- HELPERS ---------- */
  const customerName = (id) => contacts.find((c) => c.id === id)?.name || "-";

  const soNumber = (id) =>
    salesOrders.find((s) => s.id === id)?.orderNumber || "-";

  const accountName = (id) => accounts.find((a) => a.id === id)?.name || "-";

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "invoiceNumber", header: "Invoice #", width: "12%" },
    {
      key: "customerId",
      header: "Customer",
      render: (r) => customerName(r.customerId),
      width: "18%",
    },
    {
      key: "salesOrderId",
      header: "SO #",
      render: (r) => soNumber(r.salesOrderId),
      width: "12%",
    },
    { key: "invoiceDate", header: "Invoice Date", type: "date", width: "12%" },
    { key: "dueDate", header: "Due Date", type: "date", width: "12%" },
    { key: "totalAmount", header: "Total", type: "currency", width: "12%" },
    {
      key: "remainingAmount",
      header: "Remaining",
      type: "currency",
      width: "12%",
    },
    {
      key: "status",
      header: "Status",
      type: "status",
      statusType: "payment",
      width: "10%",
    },
  ];

  /* ---------- EFFECT ---------- */
  useEffect(() => {
    if (mode === "view" || mode === "edit") {
      setFormData(selectedInvoice);
    } else {
      setFormData(emptyInvoice);
    }
  }, [mode, selectedInvoice]);

  /* ---------- ACTIONS ---------- */
  const openCreate = () => {
    setMode("create");
    setIsModalOpen(true);
  };

  const openView = (invoice) => {
    setSelectedInvoice(invoice);
    setMode("view");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
    setMode("list");
  };

  const createInvoice = () => {
    setInvoices([
      ...invoices,
      {
        ...formData,
        id: Math.max(...invoices.map((i) => i.id)) + 1,
        remainingAmount: formData.totalAmount - formData.paidAmount,
      },
    ]);
    closeModal();
  };

  const updateInvoice = () => {
    setInvoices(
      invoices.map((i) =>
        i.id === formData.id
          ? {
              ...formData,
              remainingAmount: formData.totalAmount - formData.paidAmount,
            }
          : i,
      ),
    );
    closeModal();
  };

  /* ---------- FORM ---------- */
  const renderForm = () => (
    <div className="po-form-grid">
      <div className="form-group">
        <label>Invoice Number</label>
        <input
          value={formData.invoiceNumber}
          onChange={(e) =>
            setFormData({ ...formData, invoiceNumber: e.target.value })
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
        <label>Sales Order</label>
        <select
          value={formData.salesOrderId}
          onChange={(e) =>
            setFormData({ ...formData, salesOrderId: Number(e.target.value) })
          }
        >
          <option value="">Select SO</option>
          {salesOrders.map((s) => (
            <option key={s.id} value={s.id}>
              {s.orderNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Invoice Date</label>
        <input
          type="date"
          value={formData.invoiceDate}
          onChange={(e) =>
            setFormData({ ...formData, invoiceDate: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
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
  const renderView = () => {
    const percentage =
      formData.totalAmount > 0
        ? ((formData.paidAmount / formData.totalAmount) * 100).toFixed(1)
        : 0;

    return (
      <div className="po-view">
        <div className="po-view-header">
          <h3>{formData.invoiceNumber}</h3>
          <StatusBadge status={formData.status} type="payment" />
        </div>

        <div className="po-view-grid">
          <p>
            <strong>Customer:</strong> {customerName(formData.customerId)}
          </p>
          <p>
            <strong>Sales Order:</strong> {soNumber(formData.salesOrderId)}
          </p>
          <p>
            <strong>Invoice Date:</strong> {formatDate(formData.invoiceDate)}
          </p>
          <p>
            <strong>Due Date:</strong> {formatDate(formData.dueDate)}
          </p>
          <p>
            <strong>Account:</strong>{" "}
            {accountName(formData.analyticalAccountId)}
          </p>
        </div>

        <div className="po-summary">
          <div>
            <span>Total</span>
            <span>{formatCurrency(formData.totalAmount)}</span>
          </div>
          <div>
            <span>Paid</span>
            <span>{formatCurrency(formData.paidAmount)}</span>
          </div>
          <div className="total">
            <span>Remaining</span>
            <span>{formatCurrency(formData.remainingAmount)}</span>
          </div>

          <div className="payment-progress">
            <div className="payment-progress-bar">
              <div
                className="payment-progress-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span>{percentage}% Paid</span>
          </div>
        </div>
      </div>
    );
  };

  /* ---------- JSX ---------- */
  return (
    <div className="transaction-page">
      <div className="transaction-page-header">
        <div>
          <h1 className="transaction-page-title">Customer Invoices</h1>
          <p className="transaction-page-subtitle">
            Manage customer invoices and incoming payments
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          + New Customer Invoice
        </button>
      </div>

      <DataTable data={invoices} columns={columns} onRowClick={openView} />

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="large"
        title={
          mode === "create"
            ? "New Customer Invoice"
            : `Customer Invoice: ${formData.invoiceNumber}`
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
                    setFormData({ ...formData, status: "Partially Paid" })
                  }
                >
                  Mark Partial
                </button>
                <button
                  className="btn btn-success"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: "Paid",
                      paidAmount: formData.totalAmount,
                    })
                  }
                >
                  Mark Paid
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
              <button className="btn btn-primary" onClick={createInvoice}>
                Create
              </button>
            )}

            {mode === "edit" && (
              <button className="btn btn-primary" onClick={updateInvoice}>
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

export default CustomerInvoices;
