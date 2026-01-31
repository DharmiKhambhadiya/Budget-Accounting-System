import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import { getAutoAnalyticalModels, getAnalyticalAccounts, getContacts, getProducts } from '../../utils/dataLoader';
import './MasterPage.css';

const AutoAnalyticalModels = () => {
  const [models, setModels] = useState(getAutoAnalyticalModels());
  const analyticalAccounts = getAnalyticalAccounts();
  const contacts = getContacts();
  const products = getProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [formData, setFormData] = useState({
    ruleType: 'Keyword Based',
    conditions: {
      vendorId: '',
      productId: '',
      minAmount: '',
      keywords: ''
    },
    analyticalAccountId: '',
    priority: 1
  });

  const getAccountName = (id) => {
    const account = analyticalAccounts.find(a => a.id === id);
    return account ? account.name : '-';
  };

  const formatConditions = (conditions) => {
    const parts = [];
    if (conditions.vendorId) {
      const vendor = contacts.find(c => c.id === conditions.vendorId);
      parts.push(`Vendor: ${vendor?.name || conditions.vendorId}`);
    }
    if (conditions.productId) {
      const product = products.find(p => p.id === conditions.productId);
      parts.push(`Product: ${product?.name || conditions.productId}`);
    }
    if (conditions.minAmount) {
      parts.push(`Min Amount: ₹${conditions.minAmount}`);
    }
    if (conditions.keywords) {
      const keywords = Array.isArray(conditions.keywords) 
        ? conditions.keywords.join(', ') 
        : conditions.keywords;
      parts.push(`Keywords: ${keywords}`);
    }
    return parts.length > 0 ? parts.join(' | ') : 'No conditions';
  };

  const columns = [
    { key: 'ruleType', header: 'Rule Type', width: '20%' },
    {
      key: 'conditions',
      header: 'Conditions',
      width: '40%',
      render: (row) => formatConditions(row.conditions)
    },
    {
      key: 'analyticalAccountId',
      header: 'Analytical Account',
      width: '25%',
      render: (row) => getAccountName(row.analyticalAccountId)
    },
    { key: 'priority', header: 'Priority', width: '15%' }
  ];

  const handleAdd = () => {
    setSelectedModel(null);
    setFormData({
      ruleType: 'Keyword Based',
      conditions: {
        vendorId: '',
        productId: '',
        minAmount: '',
        keywords: ''
      },
      analyticalAccountId: '',
      priority: 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (model) => {
    setSelectedModel(model);
    setFormData({
      ruleType: model.ruleType,
      conditions: {
        vendorId: model.conditions.vendorId || '',
        productId: model.conditions.productId || '',
        minAmount: model.conditions.minAmount || '',
        keywords: Array.isArray(model.conditions.keywords) 
          ? model.conditions.keywords.join(', ')
          : model.conditions.keywords || ''
      },
      analyticalAccountId: model.analyticalAccountId,
      priority: model.priority
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const conditions = {
      ...formData.conditions,
      keywords: formData.conditions.keywords 
        ? formData.conditions.keywords.split(',').map(k => k.trim())
        : []
    };
    
    if (selectedModel) {
      setModels(models.map(m =>
        m.id === selectedModel.id 
          ? { ...selectedModel, ...formData, conditions } 
          : m
      ));
    } else {
      const newModel = {
        id: Math.max(...models.map(m => m.id)) + 1,
        ...formData,
        conditions
      };
      setModels([...models, newModel]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Auto Analytical Models</h1>
          <p className="master-page-subtitle">Rule-based automatic analytical account assignment</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Model
        </button>
      </div>

      <DataTable
        data={models}
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
        title={selectedModel ? 'Edit Auto Analytical Model' : 'Add Auto Analytical Model'}
        size="large"
      >
        <div className="form-group">
          <label className="form-label">Rule Type</label>
          <select
            className="form-select"
            value={formData.ruleType}
            onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })}
          >
            <option value="Vendor Based">Vendor Based</option>
            <option value="Product Based">Product Based</option>
            <option value="Keyword Based">Keyword Based</option>
            <option value="Amount Based">Amount Based</option>
          </select>
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
          <label className="form-label">Priority</label>
          <input
            type="number"
            className="form-input"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
            min="1"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Vendor (Optional)</label>
          <select
            className="form-select"
            value={formData.conditions.vendorId}
            onChange={(e) => setFormData({
              ...formData,
              conditions: { ...formData.conditions, vendorId: e.target.value ? parseInt(e.target.value) : '' }
            })}
          >
            <option value="">Select Vendor</option>
            {contacts.filter(c => c.contactType === 'Vendor').map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Product (Optional)</label>
          <select
            className="form-select"
            value={formData.conditions.productId}
            onChange={(e) => setFormData({
              ...formData,
              conditions: { ...formData.conditions, productId: e.target.value ? parseInt(e.target.value) : '' }
            })}
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Minimum Amount (Optional)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={formData.conditions.minAmount}
            onChange={(e) => setFormData({
              ...formData,
              conditions: { ...formData.conditions, minAmount: e.target.value ? parseFloat(e.target.value) : '' }
            })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Keywords (Comma-separated, Optional)</label>
          <input
            type="text"
            className="form-input"
            value={formData.conditions.keywords}
            onChange={(e) => setFormData({
              ...formData,
              conditions: { ...formData.conditions, keywords: e.target.value }
            })}
            placeholder="marketing, advertising, promotion"
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

export default AutoAnalyticalModels;
