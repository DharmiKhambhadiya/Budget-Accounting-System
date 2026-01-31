import { useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import { getUsers } from '../../utils/dataLoader';

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
      toast.success('User updated successfully');
    } else {
      // Add new
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData
      };
      setUsers([...users, newUser]);
      toast.success('User added successfully');
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (user) => {
    setUsers(users.map(u =>
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Manage system users and access</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Add User
        </button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              Edit
            </button>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(row);
              }}
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        )}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add User'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Login ID</label>
            <input
              type="text"
              className="input-field"
              value={formData.loginId}
              onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Customer">Customer</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Active
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default Users;
