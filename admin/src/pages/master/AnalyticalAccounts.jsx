import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getAnalyticalAccounts } from '../../utils/dataLoader';
import './MasterPage.css';

const AnalyticalAccounts = () => {
  const [accounts, setAccounts] = useState(getAnalyticalAccounts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accountType: 'Expense'
  });

  const columns = [
    { key: 'name', header: 'Account Name', width: '30%' },
    { key: 'description', header: 'Description', width: '40%' },
    { key: 'accountType', header: 'Type', width: '20%' }
  ];

  const handleAdd = () => {
    setSelectedAccount(null);
    setFormData({
      name: '',
      description: '',
      accountType: 'Expense'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setFormData({
      name: account.name,
      description: account.description,
      accountType: account.accountType
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedAccount) {
      setAccounts(accounts.map(a =>
        a.id === selectedAccount.id ? { ...selectedAccount, ...formData } : a
      ));
    } else {
      const newAccount = {
        id: Math.max(...accounts.map(a => a.id)) + 1,
        ...formData
      };
      setAccounts([...accounts, newAccount]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Analytical Accounts</h1>
          <p className="master-page-subtitle">Manage analytical accounting dimensions</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Account
        </button>
      </div>

      <DataTable
        data={accounts}
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
        title={selectedAccount ? 'Edit Analytical Account' : 'Add Analytical Account'}
        size="medium"
      >
        <div className="form-group">
          <label className="form-label">Account Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Account Type</label>
          <select
            className="form-select"
            value={formData.accountType}
            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
          >
            <option value="Expense">Expense</option>
            <option value="Revenue">Revenue</option>
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
          </select>
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

export default AnalyticalAccounts;
