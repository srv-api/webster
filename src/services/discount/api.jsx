// src/api/AxiosProvider.jsx
import axios from "axios";
import Cookies from "js-cookie";

// 🔧 Membuat instance Axios
const axiosInstance = axios.create({
  baseURL: "https://api.posttest.co.id",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Ambil token dari cookie
const getTokenFromCookie = () => Cookies.get("token");
const getRefreshTokenFromCookie = () => Cookies.get("refresh_token");

// 🔄 Fungsi refresh token
const refreshAuthToken = async () => {
  const refreshToken = getRefreshTokenFromCookie();
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(
      "https://api.posttest.co.id/auth/refresh",
      { refresh_token: refreshToken },
      {
        headers: {
          "x-api-key": "3f=Pr#g1@RU-nw=30",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (response.data?.data?.access_token) {
      const newToken = response.data.data.access_token;
      Cookies.set("token", newToken);
      return newToken;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// 📦 Interceptor Request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Interceptor Response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired. Attempting to refresh...");
      try {
        const newToken = await refreshAuthToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        window.location.href = "/accounts/tap/login";
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

// 📘 API FUNCTION EXPORTS
export const fetchDiscountData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/discount/discount");
    return response.data;
  } catch (error) {
    console.error("Error fetching Discount data:", error);
    throw error;
  }
};

// 📘 API FUNCTION EXPORTS
export const fetchTemplate = async () => {
  try {
    const response = await axiosInstance.get("/merchant/template", {
      responseType: "blob", // penting untuk menerima file binary
    });

    // 🔹 Ambil nama file dari header Content-Disposition
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "template.xlsx";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]); // handle nama file dengan spasi atau karakter khusus
      }
    }

    // 🔹 Buat URL blob & trigger download otomatis di browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // 🔹 Bersihkan DOM dan URL blob
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("❌ Error saat download template:", error);
    alert("Gagal mengunduh template. Silakan coba lagi!");
  }
};

// 📤 Upload Template Excel
export const uploadTemplate = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 🟢 key harus "file" sesuai backend

    const response = await axiosInstance.post("/merchant/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // misal: { message: "Upload sukses", data: {...} }
  } catch (error) {
    console.error("❌ Error uploading template:", error);
    throw error;
  }
};

export const exportDiscountsToExcel = async (from, to) => {
  try {
    const response = await axiosInstance.post(
      "/merchant/export/excel",
      { from, to },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "discounts_export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting Excel:", error);
    throw error;
  }
};

export const fetchDiscounts = async (paginationData) => {
  try {
    const response = await axiosInstance.get("/merchant/discount/pagination", {
      params: paginationData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

export const createDiscount = async (discount) => {
  try {
    const response = await axiosInstance.post("/merchant/discount/create", discount);
    return response.data;
  } catch (error) {
    console.error("Error creating discount:", error);
    throw error;
  }
};

export const deleteDiscount = async (id) => {
  try {
    await axiosInstance.delete(`/merchant/discount/${id}`);
  } catch (error) {
    console.error("Failed to delete discount:", error);
    throw error;
  }
};

export const bulkDeleteDiscounts = async (selectedDiscountIds) => {
  try {
    await axiosInstance.delete("/merchant/discount/bulk-delete", {
      data: { id: selectedDiscountIds },
    });
  } catch (error) {
    console.error("Failed to delete selected discounts:", error);
    throw error;
  }
};

export const updateExistingDiscount = async (discount) => {
  try {
    const response = await axiosInstance.put(`/merchant/discount/update/${discount.id}`, {
      discount_name: discount.discount_name,
      stock: discount.stock,
      minimal_stock: discount.minimal_stock,
      price: discount.price,
      status: discount.status,
      discount: discount.discount,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating discount:", error);
    throw error;
  }
};

// 📦 Get Discount by ID
export const fetchDiscountById = async (id) => {
  try {
    const response = await axiosInstance.get(`/merchant/discount/${id}`);
    return response.data.data; // Mengembalikan object discount
  } catch (error) {
    console.error(`Error fetching discount with ID ${id}:`, error);
    throw error;
  }
};
export const uploadImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.put(
      `/merchant/discount/upload/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default axiosInstance;
