import axiosInstance from './axiosInstance';

const ENDPOINT = '/dashboard';

export const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    return response.data;
  } catch (error) {
    throw error;
  }
};
