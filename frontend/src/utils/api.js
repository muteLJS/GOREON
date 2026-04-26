import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  withCredentials: true,
});

const getStoredAccessToken = () => localStorage.getItem("authToken");
const clearStoredAuth = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
};

const shouldSkipRefresh = (url = "") =>
  ["/auth/login", "/auth/register", "/auth/social", "/auth/refresh", "/auth/logout"].some((path) =>
    url.includes(path),
  );

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise || api.post("/auth/refresh");
      const refreshResponse = await refreshPromise;
      const nextAccessToken = refreshResponse.data?.data?.accessToken;

      if (nextAccessToken) {
        localStorage.setItem("authToken", nextAccessToken);
      }

      return api(originalRequest);
    } catch (refreshError) {
      clearStoredAuth();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default api;
