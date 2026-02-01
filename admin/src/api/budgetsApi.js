import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/budgets';

export const getBudgets = () => getAllData(ENDPOINT);
export const getBudget = (id) => getById(ENDPOINT, id);
export const createBudget = (payload) => createData(ENDPOINT, payload);
export const updateBudget = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteBudget = (id) => deleteData(ENDPOINT, id);
