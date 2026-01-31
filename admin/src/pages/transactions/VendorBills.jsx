import { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import {
  getVendorBills,
  getContacts,
  getPurchaseOrders,
  getAnalyticalAccounts,
  formatCurrency,
  formatDate,
} from "../../utils/dataLoader";
import "./TransactionPage.css";

const emptyBill = {
  billNumber: "",
  vendorId: "",
  purchaseOrderId: "",
  billDate: "",
  dueDate: "",
  analyticalAccountId: "",
  status: "Unpaid",
  totalAmount: 0,
  paidAmount: 0,
  remainingAmount: 0,
};

const VendorBills = () => {
  const [bills, setBills] = useState(getVendorBills());
  const contacts = getContacts();
  const purchaseOrders = getPurchaseOrders();
  const accounts = getAnalyticalAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list"); // create | view | edit
  const [selectedBill, setSelectedBill] = useState(null);
  const [formData, setFormData] = useState(emptyBill);

  /* ---------- HELPERS ---------- */
  const vendorName = (id) => contacts.find((v) => v.id === id)?.name || "-";
  const poNumber = (id) =>
    purchaseOrders.find((p) => p.id === id)?.orderNumber || "-";
  const accountName = (id) => accounts.find((a) => a.id === id)?.name || "-";

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "billNumber", header: "Bill #", width: "12%" },
    {
      key: "vendorId",
      header: "Vendor",
      render: (r) => vendorName(r.vendorId),
      width: "18%",
    },
    {
      key: "purchaseOrderId",
      header: "PO #",
      render: (r) => poNumber(r.purchaseOrderId),
      width: "12%",
    },
    { key: "billDate", header: "Bill Date", type: "date", width: "12%" },
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
      setFormData(selectedBill);
    } else {
      setFormData(emptyBill);
    }
  }, [mode, selectedBill]);

  /* ---------- ACTIONS ---------- */
  const openCreate = () => {
    setMode("create");
    setIsModalOpen(true);
  };

  const openView = (bill) => {
    setSelectedBill(bill);
    setMode("view");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
    setMode("list");
  };

  const createBill = () => {
    setBills([
      ...bills,
      {
        ...formData,
        id: Math.max(...bills.map((b) => b.id)) + 1,
        remainingAmount: formData.totalAmount - formData.paidAmount,
      },
    ]);
    closeModal();
  };

  const updateBill = () => {
    setBills(
      bills.map((b) =>
        b.id === formData.id
          ? {
              ...formData,
              remainingAmount: formData.totalAmount - formData.paidAmount,
            }
          : b,
      ),
    );
    closeModal();
  };

  /* ---------- FORM ---------- */
  const renderForm = () => (
    <div className="po-form-grid">
      <div className="form-group">
        <label>Bill Number</label>
        <input
          value={formData.billNumber}
          onChange={(e) =>
            setFormData({ ...formData, billNumber: e.target.value })
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
          {contacts.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Purchase Order</label>
        <select
          value={formData.purchaseOrderId}
          onChange={(e) =>
            setFormData({
              ...formData,
              purchaseOrderId: Number(e.target.value),
            })
          }
        >
          <option value="">Select PO</option>
          {purchaseOrders.map((p) => (
            <option key={p.id} value={p.id}>
              {p.orderNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Bill Date</label>
        <input
          type="date"
          value={formData.billDate}
          onChange={(e) =>
            setFormData({ ...formData, billDate: e.target.value })
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
          <h3>{formData.billNumber}</h3>
          <StatusBadge status={formData.status} type="payment" />
        </div>

        <div className="po-view-grid">
          <p>
            <strong>Vendor:</strong> {vendorName(formData.vendorId)}
          </p>
          <p>
            <strong>PO:</strong> {poNumber(formData.purchaseOrderId)}
          </p>
          <p>
            <strong>Bill Date:</strong> {formatDate(formData.billDate)}
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
          <h1>Vendor Bills</h1>
          <p>Manage vendor bills and payments</p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          + New Vendor Bill
        </button>
      </div>

      <DataTable data={bills} columns={columns} onRowClick={openView} />

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="large"
        title={
          mode === "create"
            ? "New Vendor Bill"
            : `Vendor Bill: ${formData.billNumber}`
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
              <button className="btn btn-primary" onClick={createBill}>
                Create
              </button>
            )}

            {mode === "edit" && (
              <button className="btn btn-primary" onClick={updateBill}>
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

export default VendorBills;
