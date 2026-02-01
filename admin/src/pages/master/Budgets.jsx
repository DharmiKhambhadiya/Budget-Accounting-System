import { useState } from "react";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { mockBudgets, mockAnalyticalAccounts } from "../../data/mockData";
import "./MasterPage.css";

const emptyBudget = {
  name: "",
  analyticalAccountId: "",
  period_startDate: "",
  period_endDate: "",
  amount: 0,
};

const Budgets = () => {
  const [budgets, setBudgets] = useState(mockBudgets);
  const [analyticalAccounts] = useState(mockAnalyticalAccounts);
  // No loading state needed for static data
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState(emptyBudget);

  /* ---------- HELPERS ---------- */
  const getAccountName = (id) => {
    // Handle both populated object and ID string
    const accountId = id?._id || id;
    const account = analyticalAccounts.find((a) => a._id === accountId);
    return account ? account.name : "-";
  };

  const getPeriodStatus = (startDate, endDate) => {
    const today = new Date();
    if (today < new Date(startDate)) return "Upcoming";
    if (today > new Date(endDate)) return "Expired";
    return "Active";
  };

  /* ---------- TABLE ---------- */
  const columns = [
    { key: "name", header: "Budget Name", width: "22%" },
    {
      key: "analyticalAccountId",
      header: "Analytical Account",
      render: (row) => {
        const accountId = row.analyticalAccountId?._id || row.analyticalAccountId;
        return getAccountName(accountId);
      },
      width: "20%",
    },
    {
      key: "period_startDate",
      header: "Start Date",
      type: "date",
      width: "12%",
    },
    { key: "period_endDate", header: "End Date", type: "date", width: "12%" },
    { key: "amount", header: "Budget", type: "currency", width: "12%" },
    { key: "spentAmount", header: "Spent", type: "currency", width: "11%" },
    {
      key: "remainingAmount",
      header: "Remaining",
      type: "currency",
      width: "11%",
    },
    {
      key: "period_status",
      header: "Period",
      width: "10%",
      render: (row) => (
        <StatusBadge
          status={getPeriodStatus(row.period_startDate, row.period_endDate)}
        />
      ),
    },
  ];

  /* ---------- ACTIONS ---------- */
  const openCreate = () => {
    setSelectedBudget(null);
    setFormData(emptyBudget);
    setIsModalOpen(true);
  };

  const openEdit = (budget) => {
    setSelectedBudget(budget);
    const accountId = budget.analyticalAccountId?._id || budget.analyticalAccountId;
    setFormData({
      name: budget.name || "",
      analyticalAccountId: accountId || "",
      period_startDate: budget.period_startDate || "",
      period_endDate: budget.period_endDate || "",
      amount: budget.amount || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    try {
      if (selectedBudget) {
        // UPDATE
        const updatedBudget = {
          ...selectedBudget,
          ...formData,
           // Keep calculated fields or reset them? In real app backend does this.
           // For static, we preserve existing spentAmount/remainingAmount unless logic changes it.
           // Recalculate remaining just in case amount changed
          remainingAmount: formData.amount - (selectedBudget.spentAmount || 0),
          _id: selectedBudget._id || selectedBudget.id
        };
        
        setBudgets(
          budgets.map((b) =>
            (b._id || b.id) === (selectedBudget._id || selectedBudget.id)
              ? updatedBudget
              : b
          )
        );
        toast.success('Budget updated successfully');
      } else {
        // CREATE
        const newBudget = {
          ...formData,
          _id: Date.now().toString(),
          spentAmount: 0,
          remainingAmount: formData.amount
        };
        setBudgets([...budgets, newBudget]);
        toast.success('Budget added successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save budget');
    }
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Budgets</h1>
          <p className="master-page-subtitle">
            Manage budget allocations by analytical account
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            + Add Budget
          </button>
        </div>
      </div>

      <DataTable
        data={budgets}
        columns={columns}
        actions={(row) => (
          <button
            className="btn-link"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
          >
            Revised
          </button>
        )}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBudget ? "Edit Budget" : "Add Budget"}
        size="medium"
      >
        <div className="po-modal">
          <div className="po-modal-body">
            <div className="po-form-grid">
              <div className="form-group">
                <label>Budget Name</label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
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
                  {analyticalAccounts.map((acc) => (
                    <option key={acc._id || acc.id} value={acc._id || acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.period_startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period_startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.period_endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period_endDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Budget Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="po-modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default Budgets;
