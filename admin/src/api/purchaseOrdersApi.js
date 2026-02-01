import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/purchase-orders';

export const getPurchaseOrders = () => getAllData(ENDPOINT);
export const getPurchaseOrder = (id) => getById(ENDPOINT, id);
export const createPurchaseOrder = (payload) => createData(ENDPOINT, payload);
export const updatePurchaseOrder = (id, payload) => updateData(ENDPOINT, id, payload);
export const deletePurchaseOrder = (id) => deleteData(ENDPOINT, id);
