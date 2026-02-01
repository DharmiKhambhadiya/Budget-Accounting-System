import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/customer-invoices';

export const getCustomerInvoices = () => getAllData(ENDPOINT);
export const getCustomerInvoice = (id) => getById(ENDPOINT, id);
export const createCustomerInvoice = (payload) => createData(ENDPOINT, payload);
export const updateCustomerInvoice = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteCustomerInvoice = (id) => deleteData(ENDPOINT, id);
