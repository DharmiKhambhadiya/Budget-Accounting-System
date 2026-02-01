import axiosInstance from './axiosInstance';

/**
 * Generic CRUD API helper functions
 * Provides reusable methods for all admin resources
 */

/**
 * Get all records from an endpoint
 * @param {string} endpoint - API endpoint (e.g., '/users', '/contacts')
 * @returns {Promise} Array of records
 */
export const getAllData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    // Handle different response structures
    if (response.data?.data?.users) {
      return response.data.data.users; // For users endpoint
    }
    if (response.data?.data?.contacts) {
      return response.data.data.contacts; // For contacts endpoint
    }
    if (Array.isArray(response.data?.data)) {
      return response.data.data; // Direct array
    }
    if (response.data?.data) {
      // If data is an object with a list property
      const data = response.data.data;
      const listKey = Object.keys(data).find(key => Array.isArray(data[key]));
      return listKey ? data[listKey] : data;
    }
    return response.data?.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single record by ID
 * @param {string} endpoint - API endpoint (e.g., '/users', '/contacts')
 * @param {string|number} id - Record ID
 * @returns {Promise} Record object
 */
export const getById = async (endpoint, id) => {
  try {
    const response = await axiosInstance.get(`${endpoint}/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new record
 * @param {string} endpoint - API endpoint (e.g., '/users', '/contacts')
 * @param {object} payload - Data to create
 * @returns {Promise} Created record object
 */
export const createData = async (endpoint, payload) => {
  try {
    const response = await axiosInstance.post(endpoint, payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing record
 * @param {string} endpoint - API endpoint (e.g., '/users', '/contacts')
 * @param {string|number} id - Record ID
 * @param {object} payload - Data to update
 * @returns {Promise} Updated record object
 */
export const updateData = async (endpoint, id, payload) => {
  try {
    const response = await axiosInstance.put(`${endpoint}/${id}`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a record
 * @param {string} endpoint - API endpoint (e.g., '/users', '/contacts')
 * @param {string|number} id - Record ID
 * @returns {Promise} Deletion response
 */
export const deleteData = async (endpoint, id) => {
  try {
    const response = await axiosInstance.delete(`${endpoint}/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};
