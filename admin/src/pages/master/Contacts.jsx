import { useState } from "react";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import StatusBadge from "../../components/StatusBadge";
import { mockContacts } from "../../data/mockData";
import "./MasterPage.css";

const Contacts = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactType: "Customer",
    email: "",
    phone: "",
    address: "",
    image: null,
    tags: [],
    tagsInput: "",
  });

  const columns = [
    {
      key: "image",
      header: "Image",
      width: "8%",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {row.image ? (
            <img
              src={row.image}
              alt="avatar"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                background: "#eee",
                borderRadius: 4,
              }}
            />
          )}
        </div>
      ),
    },
    { key: "name", header: "Name", width: "25%" },
    {
      key: "contactType",
      header: "Type",
      width: "15%",
      render: (row) => <StatusBadge status={row.contactType} />,
    },
    { key: "email", header: "Email", width: "25%" },
    { key: "phone", header: "Phone", width: "15%" },
    {
      key: "tags",
      header: "Tags",
      width: "12%",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(row.tags || []).map((t, i) => (
            <span key={i} className="status-badge">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    { key: "address", header: "Address", width: "20%" },
  ];

  const handleAdd = () => {
    setSelectedContact(null);
    setFormData({
      name: "",
      contactType: "Customer",
      email: "",
      phone: "",
      address: "",
      image: null,
      tags: [],
      tagsInput: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || "",
      contactType: contact.contactType || "Customer",
      email: contact.email || "",
      phone: contact.phone || "",
      address: contact.address || "",
      image: contact.image || null,
      tags: contact.tags || [],
      tagsInput: contact.tags ? contact.tags.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    try {
      // parse tags input into array
      const parsedTags = formData.tagsInput
        ? formData.tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : formData.tags || [];

      const payload = { ...formData, tags: parsedTags };
      delete payload.tagsInput; // Remove tagsInput from payload
      // Keep image in payload if present

      if (selectedContact) {
        // UPDATE
        const updatedContact = {
          ...selectedContact,
          ...payload,
          _id: selectedContact._id || selectedContact.id
        };
        setContacts(
          contacts.map((c) =>
            (c._id || c.id) === (selectedContact._id || selectedContact.id)
              ? updatedContact
              : c
          )
        );
        toast.success('Contact updated successfully');
      } else {
        // CREATE
        const newContact = {
          ...payload,
          _id: Date.now().toString()
        };
        setContacts([...contacts, newContact]);
        toast.success('Contact added successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save contact');
    }
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
        title={selectedContact ? "Edit Contact" : "Add Contact"}
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
            onChange={(e) =>
              setFormData({ ...formData, contactType: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-input"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            className="form-textarea"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-input"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                setFormData({ ...formData, image: reader.result });
              };
              reader.readAsDataURL(file);
            }}
          />
          {formData.image && (
            <div style={{ marginTop: 8 }}>
              <img
                src={formData.image}
                alt="preview"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. wholesale, priority"
            value={formData.tagsInput}
            onChange={(e) =>
              setFormData({ ...formData, tagsInput: e.target.value })
            }
          />
          {formData.tagsInput && (
            <div style={{ marginTop: 8 }}>
              {formData.tagsInput.split(",").map((t, i) => {
                const tag = t.trim();
                return tag ? (
                  <span
                    key={i}
                    className="status-badge"
                    style={{ marginRight: 6 }}
                  >
                    {tag}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
        <div className="form-actions">
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
      </FormModal>
    </div>
  );
};

export default Contacts;
