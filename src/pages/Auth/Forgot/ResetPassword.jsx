import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://api.posttest.co.id/auth/resetpassword?token=${token}`,
        { new_password: password },
        { headers: { "X-Api-Key": "3f=Pr#g1@RU-nw=30" } }
      );

      if (response.data.status) {
        toast.success("Password has been reset successfully!");
        setTimeout(() => navigate("/login?ref=reset-success"), 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <ToastContainer position="top-right" hideProgressBar theme="colored" />

      <div
        style={{
          background: "#fff",
          padding: "40px 35px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          width: "360px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#333",
            fontWeight: "bold",
            marginBottom: "10px",
            fontSize: "22px",
          }}
        >
          Create New Password
        </h2>

        <p style={{ color: "#555", marginBottom: "30px", fontSize: "15px" }}>
          Enter your new password below.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1.8px solid #ccc",
              fontSize: "15px",
              marginBottom: "25px",
              outline: "none",
              transition: "0.3s",
              color: "black",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#52796f")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#52796f",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              !loading && (e.target.style.backgroundColor = "#405d50")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#52796f")
            }
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
