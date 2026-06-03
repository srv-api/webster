import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:2388/merchant';

// Mendapatkan token dari cookie
const getTokenFromCookie = () => Cookies.get('token');
const getRefreshTokenFromCookie = () => Cookies.get('refresh_token');

// Fungsi untuk merefresh token
const refreshAuthToken = async () => {
    const refreshToken = getRefreshTokenFromCookie(); 
    if (!refreshToken) throw new Error('No refresh token available');

    try {
        const response = await axios.post(
            'http://localhost:2356/auth/refresh',
            { refresh_token: refreshToken },
            {
                headers: {
                    'x-api-key': '3f=Pr#g1@RU-nw=30', // Header tambahan jika diperlukan
                    'Authorization': `Bearer ${refreshToken}`
                },
            }
        );
        if (response.data && response.data.data.access_token) {
            const newToken = response.data.data.access_token;
            Cookies.set('token', newToken); // Menyimpan token baru ke cookie
            return newToken; // Mengembalikan token baru
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Membuat instance axios dengan interceptor
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menyisipkan token pada setiap request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getTokenFromCookie();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor untuk menangani error pada respons
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token expired. Attempting to refresh...');
            try {
                const newToken = await refreshAuthToken();
                // Menyisipkan token baru pada header request yang gagal
                error.config.headers.Authorization = `Bearer ${newToken}`;
                // Mengulangi request asli
                return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                window.location.href = '/accounts/tap/login '; // Redirect ke login jika refresh token gagal
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

// Fungsi untuk mengambil data merchant
export const fetchSider = async () => {
  try {
    const response = await axiosInstance.get("/roleuser");

    // API MENGIRIM roles DI LEVEL ROOT, BUKAN DALAM data
    const roles = response.data?.roles || [];

    if (roles.length === 0) return [];

    return roles.flatMap(r => r.permissions || []);
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
