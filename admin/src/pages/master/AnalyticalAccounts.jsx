import { useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { mockAnalyticalAccounts } from '../../data/mockData';
import './MasterPage.css';

const AnalyticalAccounts = () => {
  const [accounts, setAccounts] = useState(mockAnalyticalAccounts);
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
      name: account.name || '',
      description: account.description || '',
      accountType: account.accountType || 'Expense'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    try {
      if (selectedAccount) {
        // UPDATE
        const updatedAccount = {
          ...selectedAccount,
          ...formData
        };
        setAccounts(accounts.map(a =>
          (a._id || a.id) === (selectedAccount._id || selectedAccount.id)
            ? updatedAccount
            : a
        ));
        toast.success('Analytical account updated successfully');
      } else {
        // CREATE
        const newAccount = {
          ...formData,
          _id: Date.now().toString()
        };
        setAccounts([...accounts, newAccount]);
        toast.success('Analytical account added successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save analytical account');
    }
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
