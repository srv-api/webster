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
export const fetchMerkData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/user_merchant/merk");
    return response.data;
  } catch (error) { 
    console.error("Error fetching Merk data:", error);
    throw error;
  }
};

export const fetchRoles = async () => {
  try {
    const response = await axiosInstance.get("/merchant/role_user");
    // ✅ Ambil langsung dari "roles"
    return response.data.roles || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
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

export const exportUserMerchantsToExcel = async (from, to) => {
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
    link.setAttribute("download", "user_merchants_export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting Excel:", error);
    throw error;
  }
};

export const fetchCategoryData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/user_merchant/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching Category data:", error);
    throw error;
  }
};

export const fetchUserMerchants = async (paginationData) => {
  try {
    const response = await axiosInstance.get("/merchant/user_merchant/pagination", {
      params: paginationData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user_merchants:", error);
    throw error;
  }
};

export const createUserMerchant = async (user_merchant) => {
  try {
    const response = await axiosInstance.post("/merchant/user_merchant/create", user_merchant);
    return response.data;
  } catch (error) {
    console.error("Error creating user_merchant:", error);
    throw error;
  }
};

export const deleteUserMerchant = async (id) => {
  try {
    await axiosInstance.delete(`/merchant/user_merchant/${id}`);
  } catch (error) {
    console.error("Failed to delete user_merchant:", error);
    throw error;
  }
};

export const bulkDeleteUserMerchants = async (selectedUserMerchantIds) => {
  try {
    await axiosInstance.delete("/merchant/user_merchant/bulk-delete", {
      data: { id: selectedUserMerchantIds },
    });
  } catch (error) {
    console.error("Failed to delete selected user_merchants:", error);
    throw error;
  }
};

// 🧩 Bulk Edit UserMerchants
export const bulkEditUserMerchants = async (items) => {
  try {
    const response = await axiosInstance.put("/merchant/user_merchant/bulk-edit", {
      items,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Gagal melakukan bulk edit:", error);
    throw error;
  }
};

export const updateExistingUserMerchant = async (id, user_merchant) => {
  try {
    const response = await axiosInstance.put(`/merchant/user_merchant/update/${id}`, user_merchant);
    return response.data;
  } catch (error) {
    console.error("Error updating user_merchant:", error);
    throw error;
  }
};

// 📦 Get UserMerchant by ID
export const fetchUserMerchantById = async (id) => {
  try {
    const response = await axiosInstance.get(`/merchant/user_merchant/${id}`);
    return response.data.data; // Mengembalikan object user_merchant
  } catch (error) {
    console.error(`Error fetching user_merchant with ID ${id}:`, error);
    throw error;
  }
};
export const uploadImage = async (user_merchantId, file, onProgress) => {
  // ⬇️ Pastikan ID string (bukan objek)
  const id = typeof user_merchantId === "object" ? user_merchantId.id : user_merchantId;

  const formData = new FormData();
  formData.append("image", file); // ⬅️ harus sama dengan field di backend

  try {
    const response = await axiosInstance.put(
      `/merchant/user_merchant/upload/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export default axiosInstance;
