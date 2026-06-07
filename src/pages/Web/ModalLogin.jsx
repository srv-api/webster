import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./ModalLogin.css";
import loginLocales from "../../locales/loginLocales";

// Import API services yang sudah ada
import {
  loginUser,
  saveTokens,
  loginWithGoogle,
} from "../../services/auth/login";

export default function ModalLogin({ isOpen, onClose, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Deteksi bahasa dari URL
  const isEnglish = location.pathname.startsWith("/en");
  const langPrefix = isEnglish ? "/en" : "";
    const t = loginLocales[isEnglish ? "en" : "id"];

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginWithWhatsapp, setLoginWithWhatsapp] = useState(false);

  // Handler untuk tombol Email
  const handleEmailButtonClick = () => {
    setShowEmailForm(true);
    setLoginWithWhatsapp(false);
    setIdentifier("");
    setShowPassword(false);
  };

  // Handler untuk submit email (lanjut ke password)
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) {
      setShowPassword(true);
      toast.info(t.enterPassword, { autoClose: 1800 });
    } else {
      toast.warn(
        loginWithWhatsapp ? t.emptyWhatsappWarning : t.emptyEmailWarning
      );
    }
  };

  // Handler untuk login dengan API yang sudah ada
  const handleLogin = async (e) => {
    e.preventDefault();
  //     if (!cfToken) {
  //   toast.warn("Harap verifikasi Cloudflare sebelum login");
  //   return;
  // }

    if (!password.trim()) {
      toast.warn(t.emptyPasswordWarning);
      return;
    }

    setLoading(true);
    try {
      const payload = loginWithWhatsapp
        ? { whatsapp: countryCode + identifier }
        : { email: identifier };
      payload.password = password;

      const data = await loginUser(payload);

      if (data.status) {
        saveTokens(data.data);
        toast.success(t.loginSuccess, { autoClose: 1500 });
        setTimeout(() => {
          // Panggil onLogin jika ada
          if (onLogin) onLogin();
          // Tutup modal
          onClose();
          // Reload page untuk refresh token dan redirect ke dashboard
          window.location.href = "/d/beranda";
        }, 1500);

      } else {
        toast.error(data.meta?.message || t.loginFailed);
      }
    } catch (error) {
      toast.error(error.meta?.message || error.message || t.serverError);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk Google Login
  const handleGoogleLogin = () => {
    const clientId = "744637953413-u6104aasju3ouis551arkrtiujias26t.apps.googleusercontent.com";
    const redirectUri = `https://yuhuu.site/auth/google/callback`;
    const scope = "openid email profile";

    
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  // Handler untuk Sign Up - arahkan ke halaman signup
  const handleSignUpClick = () => {
    onClose(); // Tutup modal dulu
    navigate(`${langPrefix}/signup`); // Arahkan ke halaman signup
  };

  // Handler untuk Forgot Password
  const handleForgotPassword = () => {
    onClose();
    navigate(`${langPrefix}/forgot-password`);
  };

  // Handler untuk close modal & reset state
  const handleCloseModal = () => {
    setIdentifier("");
    setPassword("");
    setShowPassword(false);
    setIsPasswordVisible(false);
    setShowEmailForm(false);
    setLoading(false);
    onClose();
  };

  const elementStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "30px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s",
    marginBottom: "16px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    color: "#0F0F0F",
  };

  const buttonStyle = {
    ...elementStyle,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    color: "#FFFFFF",
    backgroundColor: "#0F0F0F",
    transition: "0.3s",
    marginBottom: "0",
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={handleCloseModal}
          aria-label="Close modal"
        >
          ×
        </button>

        <ToastContainer
          position="top-right"
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          style={{ fontSize: "12px" }}
        />

        <div className="modal-header">
          <h2 className="modal-title">Please sign in to your account</h2>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            ...elementStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            color: "#555",
            marginBottom: "16px",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          <FcGoogle style={{ width: "20px", height: "20px", marginRight: "12px" }} />
          Continue with Google
        </button>

        {/* Email Button */}
        <button
          type="button"
          onClick={handleEmailButtonClick}
          style={{
            ...elementStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            color: "#555",
            marginBottom: "20px",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          <svg
            style={{ width: "20px", height: "20px", marginRight: "12px" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Continue with Email
        </button>

        {/* Email Form */}
        {showEmailForm && (
          <div className="email-form-container">
            <form
              onSubmit={showPassword ? handleLogin : handleEmailSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <input
                type="email"
                placeholder="Email address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  ...elementStyle,
                  textAlign: "left",
                  marginBottom: showPassword ? "16px" : "0",
                }}
                autoFocus
              />

              {showPassword && (
                <>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        ...elementStyle,
                        paddingRight: "45px",
                        textAlign: "left",
                        marginBottom: "12px",
                      }}
                    />
                    <span
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#999",
                        fontSize: "18px",
                      }}
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <p
                    style={{
                      textAlign: "right",
                      color: "#0F0F0F",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginTop: "0",
                      marginBottom: "28px",
                      cursor: "pointer",
                      textDecoration: "underline",
                      opacity: 0.7,
                    }}
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </p>
                </>
              )}

              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  padding: "14px 16px",
                  marginTop: showPassword ? "0" : "20px",
                  opacity: loading || (!showPassword && !identifier.trim()) ? 0.5 : 1,
                  cursor:
                    loading || (!showPassword && !identifier.trim())
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={loading || (!showPassword && !identifier.trim())}
              >
                {showPassword ? (loading ? "Processing..." : "Sign In") : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Sign up link */}
        {(!showEmailForm || (showEmailForm && !showPassword)) && (
          <p className="modal-signup">
            Don't have an account?{" "}
            <span
              onClick={handleSignUpClick}
              style={{
                color: "#0F0F0F",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Sign up now
            </span>
          </p>
        )}
      </div>
    </div>
  );
}