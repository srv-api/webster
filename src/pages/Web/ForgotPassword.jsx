import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get("ref");

  // 🔒 Hanya boleh diakses dari ?ref=auth
  useEffect(() => {
    if (ref !== "auth") {
      toast.warn("Akses tidak diizinkan", { autoClose: 1800 });
      setTimeout(() => navigate("/", { replace: true }), 1500);
    }
  }, [ref, navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warn("Email tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.posttest.co.id/auth/forgotpassword",
        { email },
        { headers: { "X-Api-Key": "3f=Pr#g1@RU-nw=30" } }
      );

      if (response.data.status) {
        toast.success("Link reset password telah dikirim ke email Anda!");
      } else {
        toast.error(response.data.meta?.message || "Permintaan gagal");
      }
    } catch (error) {
      toast.error(error.response?.data?.meta?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const buttonStyle = {
    ...elementStyle,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#52796f",
    textAlign: "center",
  };

  if (ref !== "auth") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          fontFamily: "sans-serif",
        }}
      >
        <p>Redirecting...</p>
        <ToastContainer />
      </div>
    );
  }

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
      <ToastContainer
        position="top-right"
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ fontSize: "14px" }}
      />

      <h2 style={{ color: "#333", fontWeight: "bold", marginBottom: "5px" }}>
        Forgot your password?
      </h2>
      <h4 style={{ marginBottom: "30px", color: "#333", fontWeight: "normal" }}>
        Enter your email and we’ll send you reset instructions
      </h4>

      <form
        onSubmit={handleForgotPassword}
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <input
          type="email"
          placeholder="Enter your email address"
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
            opacity: loading || !email.includes("@") ? 0.5 : 1,
            cursor: loading || !email.includes("@") ? "not-allowed" : "pointer",
          }}
          disabled={loading || !email.includes("@")}
          onMouseEnter={(e) => {
            if (!loading && email.includes("@"))
              e.target.style.backgroundColor = "#405d50";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#52796f")}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p
        style={{
          marginTop: "20px",
          color: "#333",
          fontSize: "14px",
        }}
      >
        Remember your password?{" "}
        <span
          onClick={() => navigate("/login?ref=auth")}
          style={{
            color: "#2a9d8f",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#1f776f")}
          onMouseLeave={(e) => (e.target.style.color = "#2a9d8f")}
        >
          Sign in
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;
