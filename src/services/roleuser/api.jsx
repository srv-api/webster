// src/api/AxiosProvider.jsx
import axios from "axios";
import Cookies from "js-cookie";

// 🔧 Membuat instance Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:2388",
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
      "http://localhost:2356/auth/refresh",
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
    const response = await axiosInstance.get("/merchant/roleuser/merk");
    return response.data;
  } catch (error) {
    console.error("Error fetching Merk data:", error);
    throw error;
  }
};

export const fetchCategoryData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/roleuser/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching Category data:", error);
    throw error;
  }
};

export const fetchRoleUsers = async (paginationData) => {
  try {
    const response = await axiosInstance.get("/merchant/roleuser/pagination", {
      params: paginationData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roleusers:", error);
    throw error;
  }
};

export const createRoleUser = async (roleuser) => {
  try {
    const response = await axiosInstance.post("/merchant/roleuser/create", roleuser);
    return response.data;
  } catch (error) {
    console.error("Error creating roleuser:", error);
    throw error;
  }
};

export const deleteRoleUser = async (id) => {
  try {
    await axiosInstance.delete(`/merchant/roleuser/${id}`);
  } catch (error) {
    console.error("Failed to delete roleuser:", error);
    throw error;
  }
};

export const bulkDeleteRoleUsers = async (selectedRoleUserIds) => {
  try {
    await axiosInstance.delete("/merchant/roleuser/bulk-delete", {
      data: { id: selectedRoleUserIds },
    });
  } catch (error) {
    console.error("Failed to delete selected roleusers:", error);
    throw error;
  }
};

export const updateExistingRoleUser = async (roleuser) => {
  try {
    const response = await axiosInstance.put(`/merchant/roleuser/update/${roleuser.id}`, {
      roleuser_name: roleuser.roleuser_name,
      stock: roleuser.stock,
      minimal_stock: roleuser.minimal_stock,
      price: roleuser.price,
      status: roleuser.status,
      merk: roleuser.merk,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating roleuser:", error);
    throw error;
  }
};

// 📦 Get RoleUser by ID
export const fetchRoleUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/merchant/roleuser/${id}`);
    return response.data.data; // Mengembalikan object roleuser
  } catch (error) {
    console.error(`Error fetching roleuser with ID ${id}:`, error);
    throw error;
  }
};
export const uploadImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.put(
      `/merchant/roleuser/upload/${id}`,
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
