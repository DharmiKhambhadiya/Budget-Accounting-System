import axiosInstance from "../utils/API/axios";

export const getProducts = async () => {
  const res = await axiosInstance.get("/products");
  return res.data.data;
};

export const createProduct = async (payload) => {
  const res = await axiosInstance.post("/products", {
    name: payload.name,
    sku: payload.sku,
    price: payload.price,
    category: payload.category,
    isActive: payload.isActive ?? true,
  });
  return res.data.data;
};
