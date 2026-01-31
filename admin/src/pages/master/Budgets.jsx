import { useState } from "react";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { getBudgets, getAnalyticalAccounts } from "../../utils/dataLoader";
import "./MasterPage.css";

const emptyBudget = {
  name: "",
  analyticalAccountId: "",
  period_startDate: "",
  period_endDate: "",
  amount: 0,
};

const Budgets = () => {
  const [budgets, setBudgets] = useState(getBudgets());
  const analyticalAccounts = getAnalyticalAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState(emptyBudget);

  /* ---------- HELPERS ---------- */
  const getAccountName = (id) =>
    analyticalAccounts.find((a) => a.id === id)?.name || "-";

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
      render: (row) => getAccountName(row.analyticalAccountId),
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
    setFormData({
      name: budget.name,
      analyticalAccountId: budget.analyticalAccountId,
      period_startDate: budget.period_startDate,
      period_endDate: budget.period_endDate,
      amount: budget.amount,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedBudget) {
      setBudgets(
        budgets.map((b) =>
          b.id === selectedBudget.id ? { ...selectedBudget, ...formData } : b,
        ),
      );
    } else {
      setBudgets([
        ...budgets,
        {
          id: Math.max(...budgets.map((b) => b.id)) + 1,
          ...formData,
          spentAmount: 0,
          remainingAmount: formData.amount,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  /* ---------- JSX ---------- */
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
                      analyticalAccountId: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Select Account</option>
                  {analyticalAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
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
