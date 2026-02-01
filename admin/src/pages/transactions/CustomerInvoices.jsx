import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { mockCustomerInvoices, mockContacts } from "../../data/mockData"; // Ensure mockCustomerInvoices is exported
import { formatCurrency, formatDate } from "../../utils/formatters";
import "./TransactionPage.css";

const emptyInvoice = {
  invoiceNumber: "",
  customerId: "",
  invoiceDate: "",
  dueDate: "",
  status: "Unpaid",
  totalAmount: 0,
  remainingAmount: 0,
};

const CustomerInvoices = () => {
  const [invoices, setInvoices] = useState(mockCustomerInvoices || []);
  const [contacts] = useState(mockContacts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState(emptyInvoice);

  /* ---------- HELPERS ---------- */
  const customerName = (id) => {
    const customerId = id?._id || id;
    const customer = contacts.find((c) => (c._id || c.id) === customerId);
    return customer ? customer.name : "-";
  };

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "invoiceNumber", header: "Invoice #", width: "15%" },
    {
      key: "customerId",
      header: "Customer",
      render: (r) => {
        const id = r.customerId?._id || r.customerId;
        return customerName(id);
      },
      width: "20%",
    },
    { key: "invoiceDate", header: "Date", type: "date", width: "15%" },
    { key: "dueDate", header: "Due Date", type: "date", width: "15%" },
    { key: "totalAmount", header: "Total", type: "currency", width: "15%" },
    {
      key: "remainingAmount",
      header: "Remaining",
      type: "currency",
      width: "15%",
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
      if (selectedInvoice) {
        const customerId = selectedInvoice.customerId?._id || selectedInvoice.customerId;
        setFormData({
          ...selectedInvoice,
          customerId: customerId || ""
        });
      }
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
    try {
      const newInvoice = {
        ...formData,
        remainingAmount: formData.totalAmount, // Default remaining = total
        _id: Date.now().toString()
      };
      setInvoices([...invoices, newInvoice]);
      toast.success('Invoice created successfully');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create invoice');
    }
  };

  const updateInvoice = () => {
    try {
      const updatedInvoice = {
        ...formData,
        _id: formData._id || formData.id
      };
      setInvoices(invoices.map((i) => 
        (i._id || i.id) === (formData._id || formData.id) ? updatedInvoice : i
      ));
      toast.success('Invoice updated successfully');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update invoice');
    }
  };

  const updateStatus = (newStatus) => {
      let updated = { ...formData, status: newStatus };
      if (newStatus === "Paid") {
          updated.remainingAmount = 0;
      }
      setInvoices(invoices.map(i => 
        (i._id || i.id) === (formData._id || formData.id) ? updated : i
      ));
      setFormData(updated);
      toast.success(`Status updated to ${newStatus}`);
  }

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

  /* ---------- VIEW ---------- */
  const renderView = () => (
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
          <strong>Date:</strong> {formatDate(formData.invoiceDate)}
        </p>
        <p>
          <strong>Due Date:</strong> {formatDate(formData.dueDate)}
        </p>
      </div>

      <div className="po-summary">
        <div className="total">
          <span>Total</span>
          <span>{formatCurrency(formData.totalAmount)}</span>
        </div>
        <div className="total">
          <span>Remaining</span>
          <span>{formatCurrency(formData.remainingAmount)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="transaction-page">
      <div className="transaction-page-header">
        <div>
          <h1>Customer Invoices</h1>
          <p>Manage outgoing invoices</p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          + New Invoice
        </button>
      </div>

      <DataTable data={invoices} columns={columns} onRowClick={openView} />

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="medium" // Smaller than PO modal
        title={
          mode === "create"
            ? "New Invoice"
            : `Invoice: ${formData.invoiceNumber}`
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
                  className="btn btn-success"
                  onClick={() => updateStatus("Paid")}
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
