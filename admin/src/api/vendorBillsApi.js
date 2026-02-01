import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/vendor-bills';

export const getVendorBills = () => getAllData(ENDPOINT);
export const getVendorBill = (id) => getById(ENDPOINT, id);
export const createVendorBill = (payload) => createData(ENDPOINT, payload);
export const updateVendorBill = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteVendorBill = (id) => deleteData(ENDPOINT, id);
