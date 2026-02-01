import { getAllData, getById, createData, updateData, deleteData } from './adminApi';

const ENDPOINT = '/auto-analytical-models';

export const getAutoAnalyticalModels = () => getAllData(ENDPOINT);
export const getAutoAnalyticalModel = (id) => getById(ENDPOINT, id);
export const createAutoAnalyticalModel = (payload) => createData(ENDPOINT, payload);
export const updateAutoAnalyticalModel = (id, payload) => updateData(ENDPOINT, id, payload);
export const deleteAutoAnalyticalModel = (id) => deleteData(ENDPOINT, id);
