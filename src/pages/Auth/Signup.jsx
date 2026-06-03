import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import signupLocales from "../../locales/signupLocales";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = location.pathname.startsWith("/id") ? "id" : "en";
  const [language, setLanguage] = useState(currentLang);
  const t = signupLocales[language];

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState(""); // Tambahkan state untuk username
  const [loading, setLoading] = useState(false);

  // Ambil username dari URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameParam = queryParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [location]);

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
    textAlign: "center",
  };

  const buttonStyle = {
    ...elementStyle,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#52796f",
    transition: "0.3s",
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.warn(language === "id" ? "Nama lengkap wajib diisi" : "Full name is required");
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullName.trim())) {
      toast.error(language === "id" ? "Nama hanya boleh berisi huruf dan spasi" : "Full name can only contain letters and spaces");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Kirim username juga ke halaman berikutnya
      navigate(`/${language}/signup/form`, { state: { fullName, username } });
    }, 600);
  };

  const handleGoogleSignup = () => {
    toast.info(language === "id" ? "Daftar dengan Google diklik!" : "Google Sign Up clicked!");
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
      <ToastContainer theme="colored" position="top-right" />

      <h2 style={{ color: "#333", fontWeight: "bold", marginBottom: "5px" }}>{t.title}</h2>
      <h4 style={{ marginBottom: "30px", color: "#333", fontWeight: "normal" }}>{t.subtitle}</h4>

      {/* Tampilkan username yang dipilih jika ada */}
      {username && (
        <div style={{ 
          marginBottom: "20px", 
          padding: "10px", 
          backgroundColor: "#f0f0f0", 
          borderRadius: "30px",
          width: "320px",
          textAlign: "center"
        }}>
          <span style={{ color: "#333" }}>
            {language === "id" ? "Username: " : "Username: "}
            <strong style={{ color: "#52796f" }}>kirim.co/{username}</strong>
          </span>
        </div>
      )}

      <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="text"
          placeholder={t.fullNamePlaceholder}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            ...elementStyle,
            backgroundColor: "white",
            color: "#555",
          }}
        />

        <button
          type="submit"
          onClick={handleContinue}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? t.processing : t.continue}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "320px",
            marginBottom: "20px",
          }}
        >
          <hr style={{ flex: 1, border: "none", height: "1px", backgroundColor: "#ccc" }} />
          <span style={{ margin: "0 10px", color: "#999", fontSize: "14px" }}>{t.or}</span>
          <hr style={{ flex: 1, border: "none", height: "1px", backgroundColor: "#ccc" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          style={{
            ...elementStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            color: "#555",
          }}
        >
          <FcGoogle style={{ width: "20px", height: "20px", marginRight: "10px" }} />
          {t.google}
        </button>

        <p style={{ marginTop: "15px", color: "#333", fontSize: "14px" }}>
          {t.haveAccount}{" "}
          <span
            onClick={() => navigate(`/${language}/login`)}
            style={{
              color: "#2a9d8f",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {t.login}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;