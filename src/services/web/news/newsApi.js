import axios from "axios";
import Cookies from "js-cookie";

/* =====================================================
   CONFIG
===================================================== */
const BASE_URL = "http://localhost:1236";

/* =====================================================
   AXIOS INSTANCE
===================================================== */
const api = axios.create({
  baseURL: BASE_URL,
});

/* =====================================================
   TOKEN HELPERS
===================================================== */
const getToken = () => Cookies.get("token");
const getRefreshToken = () => Cookies.get("refresh_token");

/* =====================================================
   REFRESH TOKEN
===================================================== */
const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post(
    `${BASE_URL}/auth/refresh`,
    { refresh_token: refreshToken },
    {
      headers: {
        "x-api-key": "3f=Pr#g1@RU-nw=30",
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const newToken = res?.data?.data?.access_token;
  if (!newToken) throw new Error("Invalid refresh response");

  Cookies.set("token", newToken);
  return newToken;
};

/* =====================================================
   INTERCEPTORS
===================================================== */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        Cookies.remove("token");
        Cookies.remove("refresh_token");
        window.location.href = "/accounts/tap/login";
      }
    }

    return Promise.reject(error);
  }
);

/* =====================================================
   API NEWS
===================================================== */
export const createNews = async (payload) => {
  const formData = new FormData();

  formData.append("tag", payload.tag);
  formData.append("title", payload.title);
  formData.append("body", payload.body);
  formData.append("excerpt", payload.excerpt);
  formData.append("status", payload.status);

  formData.append("file", payload.image);              // FILE
  formData.append("file_name", payload.image.name);     // FILE_NAME
  formData.append("file_path", "news");                 // FILE_PATH

  console.log([...formData.entries()]);

  return api.post("/web/create/news", formData);
};



export async function getNewsList() {
  const res = await fetch(`${BASE_URL}/web/list/news`);
  const json = await res.json();

  if (!json.status) {
    throw new Error(json.message || "Failed to fetch news");
  }

  return json.data || [];
}

export async function getNewsDetail(slug) {
  const res = await fetch(`${BASE_URL}/web/detail/news/${slug}`);
  const json = await res.json();

  if (!json.status) {
    throw new Error(json.message || "News not found");
  }

  return json.data;
}



export default api;
