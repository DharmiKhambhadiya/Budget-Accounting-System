import { useState } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { getUsers } from '../../utils/dataLoader';
import './MasterPage.css';

const Users = () => {
  const [users, setUsers] = useState(getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    loginId: '',
    email: '',
    role: 'Accountant',
    isActive: true
  });

  const columns = [
    { key: 'name', header: 'Name', width: '25%' },
    { key: 'loginId', header: 'Login ID', width: '15%' },
    { key: 'email', header: 'Email', width: '25%' },
    { key: 'role', header: 'Role', width: '20%' },
    {
      key: 'isActive',
      header: 'Status',
      width: '15%',
      render: (row) => <StatusBadge status={row.isActive ? 'Active' : 'Inactive'} type="active" />
    }
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      loginId: '',
      email: '',
      role: 'Accountant',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedUser) {
      // Update existing
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...selectedUser, ...formData }
          : u
      ));
    } else {
      // Add new
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (user) => {
    setUsers(users.map(u =>
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    ));
  };

  return (
    <div className="master-page">
      <div className="master-page-header">
        <div>
          <h1 className="master-page-title">Users</h1>
          <p className="master-page-subtitle">Manage system users and access</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add User
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        actions={(row) => (
          <>
            <button 
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              Edit
            </button>
            <button
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(row);
              }}
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </>
        )}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add User'}
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
          <label className="form-label">Login ID</label>
          <input
            type="text"
            className="form-input"
            value={formData.loginId}
            onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
          />
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
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Customer">Customer</option>
            <option value="Vendor">Vendor</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            {' '}Active
          </label>
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

export default Users;
