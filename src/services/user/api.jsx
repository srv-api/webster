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

export const fetchUserData = async (pagination = { limit: 10, page: 0 }) => {
    try {
        const response = await axiosInstance.get('/merchant/user/pagination', {
            params: pagination,
        });
        return response.data.rows; // Asumsikan data ada di `rows`
    } catch (error) {
        console.error('Error fetching User data:', error);
        throw error;
    }
};

// 📘 API FUNCTION EXPORTS
export const fetchMerkData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/user/merk");
    return response.data;
  } catch (error) {
    console.error("Error fetching Merk data:", error);
    throw error;
  }
};

export const fetchCategoryData = async () => {
  try {
    const response = await axiosInstance.get("/merchant/user/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching Category data:", error);
    throw error;
  }
};

export const fetchUsers = async (paginationData) => {
    try {
        const response = await axiosInstance.get('/merchant/user/pagination', {
            params: paginationData,
        });

        // Pastikan response sukses dan data tersedia
        if (response.data.success && response.data.data) {
            return {
                users: response.data.data.data, // array data user
                totalRows: response.data.data.total_rows,
                totalPages: response.data.data.total_page,
                currentPage: response.data.data.page,
            };
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (user) => {
  try {
    const response = await axiosInstance.post("/merchant/user/create", user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`/merchant/user/${id}`);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

export const bulkDeleteUsers = async (selectedUserIds) => {
  try {
    await axiosInstance.delete("/merchant/user/bulk-delete", {
      data: { id: selectedUserIds },
    });
  } catch (error) {
    console.error("Failed to delete selected users:", error);
    throw error;
  }
};

export const updateExistingUser = async (user) => {
  try {
    const response = await axiosInstance.put(`/merchant/user/update/${user.id}`, {
      user_name: user.user_name,
      stock: user.stock,
      minimal_stock: user.minimal_stock,
      price: user.price,
      status: user.status,
      merk: user.merk,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// 📦 Get User by ID
export const fetchUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/merchant/user/${id}`);
    return response.data.data; // Mengembalikan object user
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};
export const uploadImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.put(
      `/merchant/user/upload/${id}`,
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


