import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/invoice-payments';

export const getInvoicePayments = () => getAllData(ENDPOINT);
export const getInvoicePayment = (id) => getById(ENDPOINT, id);
export const createInvoicePayment = (payload) => createData(ENDPOINT, payload);
export const updateInvoicePayment = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteInvoicePayment = (id) => deleteData(ENDPOINT, id);
