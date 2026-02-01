import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/analytical-accounts';

export const getAnalyticalAccounts = () => getAllData(ENDPOINT);
export const getAnalyticalAccount = (id) => getById(ENDPOINT, id);
export const createAnalyticalAccount = (payload) => createData(ENDPOINT, payload);
export const updateAnalyticalAccount = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteAnalyticalAccount = (id) => deleteData(ENDPOINT, id);
