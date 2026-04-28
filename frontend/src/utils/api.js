import axios from "axios";

export const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  withCredentials: true,
});

const clearStoredAuth = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

const shouldSkipRefresh = (url = "") =>
  ["/auth/login", "/auth/register", "/auth/social", "/auth/refresh", "/auth/logout"].some((path) =>
    url.includes(path),
  );

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const shouldSkipAuthRecovery =
      originalRequest.skipAuthRefresh === true || originalRequest.skipAuthLogout === true;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipAuthRecovery ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise || api.post("/auth/refresh");
      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      clearStoredAuth();

      if (!originalRequest.skipAuthLogout) {
        window.dispatchEvent(new Event("auth:logout"));
      }

      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default api;
