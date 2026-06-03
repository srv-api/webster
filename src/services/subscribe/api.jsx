import axios from "axios";
import Cookies from "js-cookie";

//
// ======================================================
//  🔧 AXIOS INSTANCE SETUP
// ======================================================
//
const axiosInstance = axios.create({
  baseURL: "https://api.posttest.co.id",
  headers: {
    "Content-Type": "application/json",
  },
});

//
// ======================================================
//  🔑 GET TOKEN FROM COOKIES
// ======================================================
//
const getTokenFromCookie = () => Cookies.get("token");
const getRefreshTokenFromCookie = () => Cookies.get("refresh_token");

//
// ======================================================
//  🔄 FUNCTION: REFRESH TOKEN
// ======================================================
//
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

//
// ======================================================
//  📦 INTERCEPTOR REQUEST (Auto Add Authorization)
// ======================================================
//
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

//
// ======================================================
//  ⚠️ INTERCEPTOR RESPONSE (Auto Refresh Token)
// ======================================================
//
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

//
// ======================================================
//  🟦 API: CHARGE GOPAY SUBSCRIPTION
// ======================================================
//
export const chargeGopaySubscription = async (gross_amount) => {
  try {
    const response = await axiosInstance.post(
      "/merchant/subscribe/charge-gopay",
      {
        gross_amount: gross_amount,
      }
    );

    return response.data;

  } catch (error) {
    // ========= HANDLE JSON ERROR SESUAI BACKEND ==========
    if (error.response?.data?.error) {
      throw {
        error: error.response.data.error, // <= KELUAR PERSIS SAMA
      };
    }

    // ========= HANDLING UNTUK CASE TAK TERDUGA ============
    throw {
      error:
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred",
    };
  }
};
