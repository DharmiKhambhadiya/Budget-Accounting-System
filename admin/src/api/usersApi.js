import axiosInstance from "../utils/API/axios";

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.data;
};

export const createUser = async (payload) => {
  const res = await axiosInstance.post("/auth/admin/create-user", {
    name: payload.name,
    loginId: payload.loginId,
    email: payload.email,
    password: payload.password,
    role: payload.role || "user",
    isActive: payload.isActive ?? true,
  });
  return res.data.data;
};

export const updateUser = async (id, payload) => {
  const res = await axiosInstance.put(`/users/${id}`, payload);
  return res.data.data;
};
