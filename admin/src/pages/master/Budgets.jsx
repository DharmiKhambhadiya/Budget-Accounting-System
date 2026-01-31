import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { getBudgets, getAnalyticalAccounts, formatCurrency, formatDate } from '../../utils/dataLoader';
import './MasterPage.css';

const Budgets = () => {
  const [budgets, setBudgets] = useState(getBudgets());
  const analyticalAccounts = getAnalyticalAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    analyticalAccountId: '',
    period_startDate: '',
    period_endDate: '',
    amount: 0
  });

  const getAccountName = (id) => {
    const account = analyticalAccounts.find(a => a.id === id);
    return account ? account.name : '-';
  };

  const getPeriodStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return 'Upcoming';
    if (today > end) return 'Expired';
    return 'Active';
  };

  const columns = [
    { key: 'name', header: 'Budget Name', width: '25%' },
    {
      key: 'analyticalAccountId',
      header: 'Analytical Account',
      width: '20%',
      render: (row) => getAccountName(row.analyticalAccountId)
    },
    {
      key: 'period_startDate',
      header: 'Start Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'period_endDate',
      header: 'End Date',
      type: 'date',
      width: '12%'
    },
    {
      key: 'amount',
      header: 'Budget Amount',
      type: 'currency',
      width: '15%'
    },
    {
      key: 'spentAmount',
      header: 'Spent',
      type: 'currency',
      width: '12%'
    },
    {
      key: 'remainingAmount',
      header: 'Remaining',
      type: 'currency',
      width: '12%'
    },
    {
      key: 'period_status',
      header: 'Period',
      width: '12%',
      render: (row) => {
        const status = getPeriodStatus(row.period_startDate, row.period_endDate);
        return <StatusBadge status={status} />;
      }
    }
  ];

  const handleAdd = () => {
    setSelectedBudget(null);
    setFormData({
      name: '',
      analyticalAccountId: '',
      period_startDate: '',
      period_endDate: '',
      amount: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setFormData({
      name: budget.name,
      analyticalAccountId: budget.analyticalAccountId,
      period_startDate: budget.period_startDate,
      period_endDate: budget.period_endDate,
      amount: budget.amount
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedBudget) {
      setBudgets(budgets.map(b =>
        b.id === selectedBudget.id ? { ...selectedBudget, ...formData } : b
      ));
    } else {
      const newBudget = {
        id: Math.max(...budgets.map(b => b.id)) + 1,
        ...formData,
        spentAmount: 0,
        remainingAmount: formData.amount
      };
      setBudgets([...budgets, newBudget]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Budgets</h1>
          <p className="master-page-subtitle">Manage budget allocations by analytical account</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Budget
        </button>
      </div>

      <DataTable
        data={budgets}
        columns={columns}
        actions={(row) => (
          <button
            className="btn-link"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            Edit
          </button>
        )}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBudget ? 'Edit Budget' : 'Add Budget'}
        size="medium"
      >
        <div className="form-group">
          <label className="form-label">Budget Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Analytical Account</label>
          <select
            className="form-select"
            value={formData.analyticalAccountId}
            onChange={(e) => setFormData({ ...formData, analyticalAccountId: parseInt(e.target.value) })}
          >
            <option value="">Select Account</option>
            {analyticalAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.period_startDate}
            onChange={(e) => setFormData({ ...formData, period_startDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.period_endDate}
            onChange={(e) => setFormData({ ...formData, period_endDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Budget Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default Budgets;
