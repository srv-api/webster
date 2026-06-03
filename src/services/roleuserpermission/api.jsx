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
    const response = await axiosInstance.get("/merchant/roleuserpermission/merk");
    return response.data;
  } catch (error) {
    console.error("Error fetching Merk data:", error);
    throw error;
  }
};

export const fetchCategoryData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/roleuserpermission/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching Category data:", error);
    throw error;
  }
};

export const fetchRoleUserPermissions = async (paginationData) => {
  try {
    const response = await axiosInstance.get("/merchant/roleuserpermission/pagination", {
      params: paginationData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roleuserpermissions:", error);
    throw error;
  }
};

export const createRoleUserPermission = async (roleuserpermission) => {
  try {
    const response = await axiosInstance.post("/merchant/roleuserpermission/create", roleuserpermission);
    return response.data;
  } catch (error) {
    console.error("Error creating roleuserpermission:", error);
    throw error;
  }
};

export const deleteRoleUserPermission = async (id) => {
  try {
    await axiosInstance.delete(`/merchant/roleuserpermission/${id}`);
  } catch (error) {
    console.error("Failed to delete roleuserpermission:", error);
    throw error;
  }
};

export const bulkDeleteRoleUserPermissions = async (selectedRoleUserPermissionIds) => {
  try {
    await axiosInstance.delete("/merchant/roleuserpermission/bulk-delete", {
      data: { id: selectedRoleUserPermissionIds },
    });
  } catch (error) {
    console.error("Failed to delete selected roleuserpermissions:", error);
    throw error;
  }
};

export const updateExistingRoleUserPermission = async (roleuserpermission) => {
  try {
    const response = await axiosInstance.put(`/merchant/roleuserpermission/update/${roleuserpermission.id}`, {
      roleuserpermission_name: roleuserpermission.roleuserpermission_name,
      stock: roleuserpermission.stock,
      minimal_stock: roleuserpermission.minimal_stock,
      price: roleuserpermission.price,
      status: roleuserpermission.status,
      merk: roleuserpermission.merk,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating roleuserpermission:", error);
    throw error;
  }
};

// 📦 Get RoleUserPermission by ID
export const fetchRoleUserPermissionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/merchant/roleuserpermission/${id}`);
    return response.data.data; // Mengembalikan object roleuserpermission
  } catch (error) {
    console.error(`Error fetching roleuserpermission with ID ${id}:`, error);
    throw error;
  }
};
export const uploadImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.put(
      `/merchant/roleuserpermission/upload/${id}`,
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
