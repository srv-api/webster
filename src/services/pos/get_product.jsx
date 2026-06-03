import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "https://api.posttest.co.id";

// 🔧 Buat instance axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Ambil token dari cookie
const getToken = () => Cookies.get("token");
const getRefreshToken = () => Cookies.get("refresh_token");

// 🔄 Refresh token function
const refreshToken = async () => {
  const rToken = getRefreshToken();
  if (!rToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(
      "https://api.posttest.co.id/auth/refresh",
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
    // Jika gagal refresh, redirect ke login
    window.location.href = "/login";
    throw err;
  }
};

// ⚡ Request interceptor: set Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚡ Response interceptor: refresh jika token expired
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

// 📦 API function
export const getProducts = async (limit = 10, page = 1) => {
  try {
    const response = await axiosInstance.get("/product/pagination", {
      params: { limit, page },
    });
    return response.data?.data?.rows || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data produk:", error);
    return [];
  }
};


// 📦 API: Ambil kategori produk
export const getProductCategories = async () => {
  try {
    const response = await axiosInstance.get(
      "https://api.posttest.co.id/merchant/product/category"
    );

    // hanya kategori aktif
    return (response.data || []).filter((c) => c.status === 1);
  } catch (error) {
    console.error("❌ Gagal mengambil kategori produk:", error);
    return [];
  }
};



export default axiosInstance;


