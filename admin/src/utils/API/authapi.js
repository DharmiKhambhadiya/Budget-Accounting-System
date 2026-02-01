import axiosInstance from "./axios";

// USER LOGIN
export const userLoginApi = (payload) =>
  axiosInstance.post("/auth/login", payload);

// ADMIN REGISTER
export const adminRegisterApi = (payload) =>
  axiosInstance.post("/auth/admin/register", payload);

// ADMIN LOGIN
export const adminLoginApi = (payload) =>
  axiosInstance.post("/auth/admin/login", payload);

// GET CURRENT USER
export const getMeApi = () => axiosInstance.get("/auth/me");

// ADMIN CREATE USER
export const adminCreateUserApi = (payload) =>
  axiosInstance.post("/auth/admin/create-user", payload);
