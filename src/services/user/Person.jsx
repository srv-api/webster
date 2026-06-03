// apiUser.js
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "https://api.posttest.co.id";

// Buat instance axios
const Person = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Ambil token dari cookie
const getToken = () => Cookies.get("token");
const getRefreshToken = () => Cookies.get("refresh_token");

// Refresh token function
const refreshToken = async () => {
  const rToken = getRefreshToken();
  if (!rToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refresh_token: rToken },
      {
        headers: {
          "x-api-key": "3f=Pr#g1@RU-nw=30",
          Authorization: `Bearer ${rToken}`,
        },
      }
    );

    const newToken = response.data?.data?.access_token;
    if (!newToken) throw new Error("Refresh token failed");

    Cookies.set("token", newToken, { expires: 7 });
    return newToken;
  } catch (err) {
    console.error("❌ Refresh token error:", err);
    window.location.href = "/login"; // redirect ke login
    throw err;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh jika 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance.request(error.config);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default Person;
