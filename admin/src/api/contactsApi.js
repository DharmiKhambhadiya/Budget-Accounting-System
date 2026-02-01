import axiosInstance from "../utils/API/axios";

/* =====================
   GET CONTACTS
===================== */
export const getContacts = async () => {
  const res = await axiosInstance.get("/contacts");
  return res.data.data;
};

/* =====================
   CREATE CONTACT
===================== */
export const createContact = async (payload) => {
  const res = await axiosInstance.post("/contacts", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    type: payload.type,
    isActive: payload.isActive ?? true,
  });
  return res.data.data;
};

/* =====================
   UPDATE CONTACT ✅
===================== */
export const updateContact = async (id, payload) => {
  const res = await axiosInstance.put(`/contacts/${id}`, payload);
  return res.data.data;
};

/* =====================
   DELETE CONTACT (OPTIONAL)
===================== */
export const deleteContact = async (id) => {
  const res = await axiosInstance.delete(`/contacts/${id}`);
  return res.data.data;
};
