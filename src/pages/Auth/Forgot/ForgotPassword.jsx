import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import forgotLocales from "../../../locales/forgotLocales.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Deteksi bahasa dari URL
  const currentLang = location.pathname.startsWith("/id") ? "id" : "en";
  const [language] = useState(currentLang);
  const t = forgotLocales[language]; // ✅ perbaikan di sini

  const elementStyle = {
    width: "320px",
    maxWidth: "100%",
    padding: "14px",
    borderRadius: "30px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "0.2s",
    marginBottom: "20px",
    boxSizing: "border-box",
    textAlign: "left",
    backgroundColor: "white",
    color: "black",
  };

  const buttonStyle = {
    ...elementStyle,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#52796f",
    transition: "0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warn(t.toast.emptyEmail);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.posttest.co.id/auth/request-reset-password",
        { email },
        { headers: { "X-Api-Key": "3f=Pr#g1@RU-nw=30" } }
      );

      if (response.data.status) {
        const token = response.data.data?.token;

        if (token) {
          toast.success(t.toast.success, { autoClose: 1500 });
          setTimeout(() => {
            navigate(`/verify-reset?token_verfied=${token}`);
          }, 2000);
        } else {
          toast.error(t.toast.missingToken);
        }
      } else {
        toast.error(response.data.message || t.toast.failed);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fff",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <ToastContainer position="top-right" hideProgressBar theme="colored" />

      <h2 style={{ color: "#333", fontWeight: "bold", marginBottom: "10px" }}>
        {t.title}
      </h2>
      <p style={{ color: "#555", marginBottom: "25px", fontSize: "15px" }}>
        {t.subtitle}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={elementStyle}
          onFocus={(e) => (e.target.style.borderColor = "#52796f")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />

        <button
          type="submit"
          style={{
            ...buttonStyle,
            opacity: loading || !email.trim() ? 0.5 : 1,
            cursor: loading || !email.trim() ? "not-allowed" : "pointer",
          }}
          disabled={loading || !email.trim()}
        >
          {loading ? t.sending : t.sendButton}
        </button>
      </form>

      <p style={{ marginTop: "20px", color: "#333", fontSize: "14px" }}>
        <span
          onClick={() => navigate(`/${language}/login`)}
          style={{
            color: "#2a9d8f",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {t.backToLogin}
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;
