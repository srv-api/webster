import axios from "axios";
import Cookies from "js-cookie";


// 🔹 Buat instance axios utama
const axiosInstance = axios.create({
  baseURL: "https://api.posttest.co.id", // Ganti sesuai server
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Ambil token dari cookie dan tambahkan otomatis ke header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


// 📦 Ambil list order dengan pagination & optional search
export const getOrders = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await axiosInstance.get(
      `/merchant/order/pagination?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Gagal mengambil data order:", err);
    throw err;
  }
};

// 🔍 Ambil detail order berdasarkan ID
export const getOrderDetail = async (orderId) => {
  try {
    const res = await axiosInstance.get(`/merchant/order/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Gagal mengambil detail order:", err);
    throw err;
  }
};

// 🔄 Update status order
export const updateOrderStatus = async (orderId, status) => {
  try {
    const statusCode =
      status === "Processing" ? 1 : status === "Completed" ? 2 : 0;

    const res = await axiosInstance.put(`/merchant/order/${orderId}`, {
      status: statusCode,
    });

    return res.data;
  } catch (err) {
    console.error("❌ Gagal update status order:", err);
    throw err;
  }
};

// ❌ Hapus order (optional)
export const deleteOrder = async (orderId) => {
  try {
    const res = await axiosInstance.delete(`/merchant/order/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Gagal hapus order:", err);
    throw err;
  }
};

export default axiosInstance;
