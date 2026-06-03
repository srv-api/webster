import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const VerifyReset = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(240);
  const [isExpired, setIsExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token_verfied");

  // 🕒 TIMER
  useEffect(() => {
    if (isExpired) return;
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isExpired]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 🧩 OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ✅ SUBMIT OTP ke API verify-reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    if (isExpired) {
      toast.error("OTP expired. Please resend OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `https://api.posttest.co.id/auth/verify-reset?token=${token}`,
        { otp: code },
        { headers: { "X-Api-Key": "3f=Pr#g1@RU-nw=30" } }
      );

      if (res.data.status) {
        toast.success("OTP verified successfully!");
        setTimeout(() => navigate("/reset-password"), 1500);
      } else {
        toast.error(res.data.message || "Invalid OTP. Try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP (optional)
  const handleResendOtp = async () => {
    setResending(true);
    try {
      await axios.post("https://api.posttest.co.id/auth/request-reset-password", {
        email: localStorage.getItem("lastEmail") || "", // bisa ubah sesuai data yang disimpan
      });
      toast.success("A new OTP has been sent!");
      setOtp(["", "", "", ""]);
      setTimeLeft(240);
      setIsExpired(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        background: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <ToastContainer theme="colored" />
      <h2 style={{ color: "#333", fontWeight: "bold", marginBottom: "5px" }}>
        Verify your OTP
      </h2>
      <h4 style={{ marginBottom: "10px", color: "#333", fontWeight: "normal" }}>
        Enter the 4-digit code sent to your email.
      </h4>

      <p
        style={{
          marginBottom: "25px",
          color: isExpired ? "#e63946" : "#52796f",
          fontWeight: "bold",
        }}
      >
        {isExpired ? "OTP expired" : `Expires in ${formatTime(timeLeft)}`}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 🔢 Input OTP */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              style={{
                width: "60px",
                height: "60px",
                textAlign: "center",
                fontSize: "22px",
                borderRadius: "12px",
                border: "2px solid #ccc",
                outline: "none",
                background: "#fff",
                color: "black",
                transition: "0.2s",
              }}
            />
          ))}
        </div>

        {/* 🔘 Tombol Verify */}
        <button
          type="submit"
          disabled={isExpired || loading}
          style={{
            width: "240px",
            padding: "14px",
            borderRadius: "30px",
            border: "none",
            backgroundColor: isExpired ? "#aaa" : "#52796f",
            color: "white",
            fontWeight: "bold",
            cursor: isExpired || loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* 🔁 Tombol Resend */}
        {isExpired && (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            style={{
              width: "240px",
              padding: "14px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#2a9d8f",
              color: "white",
              fontWeight: "bold",
              marginTop: "15px",
              cursor: resending ? "not-allowed" : "pointer",
              opacity: resending ? 0.6 : 1,
              transition: "0.3s",
            }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        )}
      </form>
    </div>
  );
};

export default VerifyReset;
