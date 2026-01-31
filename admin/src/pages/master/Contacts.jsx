import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { getContacts } from '../../utils/dataLoader';
import './MasterPage.css';

const Contacts = () => {
  const [contacts, setContacts] = useState(getContacts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactType: 'Customer',
    email: '',
    phone: '',
    address: ''
  });

  const columns = [
    { key: 'name', header: 'Name', width: '25%' },
    {
      key: 'contactType',
      header: 'Type',
      width: '15%',
      render: (row) => <StatusBadge status={row.contactType} />
    },
    { key: 'email', header: 'Email', width: '25%' },
    { key: 'phone', header: 'Phone', width: '15%' },
    { key: 'address', header: 'Address', width: '20%' }
  ];

  const handleAdd = () => {
    setSelectedContact(null);
    setFormData({
      name: '',
      contactType: 'Customer',
      email: '',
      phone: '',
      address: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      contactType: contact.contactType,
      email: contact.email,
      phone: contact.phone,
      address: contact.address
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedContact) {
      setContacts(contacts.map(c =>
        c.id === selectedContact.id ? { ...selectedContact, ...formData } : c
      ));
    } else {
      const newContact = {
        id: Math.max(...contacts.map(c => c.id)) + 1,
        ...formData
      };
      setContacts([...contacts, newContact]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Contacts</h1>
          <p className="master-page-subtitle">Manage customers and vendors</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Contact
        </button>
      </div>

      <DataTable
        data={contacts}
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
        title={selectedContact ? 'Edit Contact' : 'Add Contact'}
        size="medium"
      >
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Type</label>
          <select
            className="form-select"
            value={formData.contactType}
            onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
          >
            <option value="Customer">Customer</option>
            <option value="Vendor">Vendor</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            className="form-textarea"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

export default Contacts;
