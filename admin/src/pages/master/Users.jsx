import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { getUsers, createUser, updateUser } from "../../api/usersApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    loginId: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      loginId: "",
      email: "",
      password: "",
      role: "user",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      loginId: user.loginId || "",
      email: user.email || "",
      password: "", // Password not shown
      role: user.role || "user",
      isActive: user.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    (async () => {
      try {
        if (selectedUser) {
          const id = selectedUser._id || selectedUser.id;
          const updated = await updateUser(id, formData);
          setUsers(
            users.map((u) => (u._id === id || u.id === id ? updated : u)),
          );
          toast.success("User updated successfully");
        } else {
          const created = await createUser(formData);
          setUsers((prev) => [...prev, created]);
          toast.success("User created successfully");
        }
        setIsModalOpen(false);
      } catch (err) {
        console.error(err);
        toast.error("Operation failed");
      }
    })();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        if (mounted) setUsers(data || []);
      } catch (err) {
        console.error("Failed to load users", err);
        toast.error("Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    { key: "name", header: "Name" },
    { key: "loginId", header: "Login ID" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.isActive ? "Active" : "Inactive"} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <button className="btn-primary" onClick={handleAdd}>
          + Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : (
        <DataTable
          data={users}
          columns={columns}
          actions={(row) => (
            <button
              className="text-blue-600 underline"
              onClick={() => handleEdit(row)}
            >
              Edit
            </button>
          )}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? "Edit User" : "Add User"}
      >
        <div className="space-y-4">
          <input
            className="input-field"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            className="input-field"
            placeholder="Login ID"
            value={formData.loginId}
            onChange={(e) =>
              setFormData({ ...formData, loginId: e.target.value })
            }
          />

          <input
            className="input-field"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <select
            className="input-field"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <label>Active</label>
          </div>

          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </FormModal>
    </div>
  );
};

export default Users;
