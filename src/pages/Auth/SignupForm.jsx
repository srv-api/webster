import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🌐 Deteksi bahasa dari URL
  const currentLang = location.pathname.startsWith("/id") ? "id" : "en";

  const fullName = location.state?.fullName || "";
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌐 Lokalisasi teks
  const t = {
    en: {
      title: "Complete your account",
      emailPlaceholder: "Email address",
      whatsappPlaceholder: "WhatsApp number (e.g. +628123456789)",
      passwordPlaceholder: "Create password",
      signupButton: "Sign Up",
      creating: "Creating Account...",
      required: "All fields are required",
      invalidEmail: "Invalid email format",
      invalidPhone: "Invalid WhatsApp number",
      shortPassword: "Password must be at least 8 characters",
      success: "Signup successful! Please verify OTP.",
      failed: "Signup failed",
    },
    id: {
      title: "Lengkapi akun kamu",
      emailPlaceholder: "Alamat Email",
      whatsappPlaceholder: "Nomor WhatsApp (misal: +628123456789)",
      passwordPlaceholder: "Buat kata sandi",
      signupButton: "Daftar",
      creating: "Membuat Akun...",
      required: "Semua kolom wajib diisi",
      invalidEmail: "Format email tidak valid",
      invalidPhone: "Nomor WhatsApp tidak valid",
      shortPassword: "Kata sandi minimal 8 karakter",
      success: "Pendaftaran berhasil! Silakan verifikasi OTP.",
      failed: "Pendaftaran gagal",
    },
  }[currentLang];

  // 🔍 Validasi
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateWhatsapp = (num) => /^\+?[0-9]{10,15}$/.test(num);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !whatsapp || !password) {
      toast.warn(t.required);
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t.invalidEmail);
      return;
    }

    if (!validateWhatsapp(whatsapp)) {
      toast.error(t.invalidPhone);
      return;
    }

    if (password.length < 8) {
      toast.error(t.shortPassword);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:2356/auth/signup",
        {
          full_name: fullName,
          email,
          whatsapp,
          password,
        },
        {
          headers: {
            "X-Api-Key": "3f=Pr#g1@RU-nw=30",
          },
        }
      );

      if (res.data.status) {
        const token = res.data.data.token;
        toast.success(t.success);
        setTimeout(
          () => navigate(`/${currentLang}/signup/otp`, { state: { email, whatsapp, token } }),
          2000
        );
      } else {
        toast.error(res.data.meta?.message || t.failed);
      }
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Style umum
  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "30px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#000",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#52796f",
    color: "white",
    fontWeight: "bold",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <ToastContainer theme="colored" />

      <h2 style={{ color: "#333", fontWeight: "bold", marginBottom: "20px" }}>
        {t.title}
      </h2>

      <form
        onSubmit={handleSignup}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "320px",
        }}
      >
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder={t.whatsappPlaceholder}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ ...inputStyle, marginBottom: "25px" }}
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? t.creating : t.signupButton}
        </button>
      </form>
    </div>
  );
}
