import axios from "axios";

const API_BASE_URL = "http://localhost:2356";

// instance axios (lebih rapi & reusable)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-Api-Key":"3f=Pr#g1@RU-nw=30",
    "Content-Type": "application/json",
  },
});

// 🔁 Resend OTP
export const resendOtp = (token) => {
  return api.post(`/auth/resend-otp?token=${token}`);
};

// ✅ Verify OTP (kalau backend sudah ada)
export const verifyOtp = (token, otp) => {
  return api.post(`/auth/verify?token=${token}`, {
    otp,
  });
};
