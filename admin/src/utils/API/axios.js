  import axios from "axios";

  const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // ✅ Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 🔐 Unauthorized → logout
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/admin/login";
      }

      // 🔥 Internal Server Error (debug only)
      if (error.response?.status === 500) {
        console.error(
          "Server error:",
          error.response?.data || error.message
        );
      }

      return Promise.reject(error);
    }
  );


  export default axiosInstance;
