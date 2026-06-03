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
    const response = await axiosInstance.get("/merchant/permission/merk");
    return response.data;
  } catch (error) {
    console.error("Error fetching Merk data:", error);
    throw error;
  }
};

export const fetchCategoryData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/permission/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching Category data:", error);
    throw error;
  }
};

export const fetchPermissions = async (paginationData) => {
  try {
    const response = await axiosInstance.get("/merchant/permission/pagination", {
      params: paginationData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};

export const createPermission = async (permission) => {
  try {
    const response = await axiosInstance.post("/merchant/permission/create", permission);
    return response.data;
  } catch (error) {
    console.error("Error creating permission:", error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    await axiosInstance.delete(`/merchant/permission/${id}`);
  } catch (error) {
    console.error("Failed to delete permission:", error);
    throw error;
  }
};

export const bulkDeletePermissions = async (selectedPermissionIds) => {
  try {
    await axiosInstance.delete("/merchant/permission/bulk-delete", {
      data: { id: selectedPermissionIds },
    });
  } catch (error) {
    console.error("Failed to delete selected permissions:", error);
    throw error;
  }
};

export const updateExistingPermission = async (permission) => {
  try {
    const response = await axiosInstance.put(`/merchant/permission/update/${permission.id}`, {
      permission_name: permission.permission_name,
      stock: permission.stock,
      minimal_stock: permission.minimal_stock,
      price: permission.price,
      status: permission.status,
      merk: permission.merk,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating permission:", error);
    throw error;
  }
};

// 📦 Get Permission by ID
export const fetchPermissionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/merchant/permission/${id}`);
    return response.data.data; // Mengembalikan object permission
  } catch (error) {
    console.error(`Error fetching permission with ID ${id}:`, error);
    throw error;
  }
};
export const uploadImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.put(
      `/merchant/permission/upload/${id}`,
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
