import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/sales-orders';

export const getSalesOrders = () => getAllData(ENDPOINT);
export const getSalesOrder = (id) => getById(ENDPOINT, id);
export const createSalesOrder = (payload) => createData(ENDPOINT, payload);
export const updateSalesOrder = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteSalesOrder = (id) => deleteData(ENDPOINT, id);
