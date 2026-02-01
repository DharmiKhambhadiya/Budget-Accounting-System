import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/bill-payments';

export const getBillPayments = () => getAllData(ENDPOINT);
export const getBillPayment = (id) => getById(ENDPOINT, id);
export const createBillPayment = (payload) => createData(ENDPOINT, payload);
export const updateBillPayment = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteBillPayment = (id) => deleteData(ENDPOINT, id);
