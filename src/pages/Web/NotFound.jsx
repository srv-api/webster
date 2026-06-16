import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import text from "../../locales/text";

export default function NotFound() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const priceRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Tentukan bahasa
  const language = location.pathname.startsWith("/en") ? "en" : "id";
  const t = text[language];

  return (
    <div className="landing-container">
      {/* Navbar */}
      <Navbar
        heroRef={heroRef}
        aboutRef={aboutRef}
        priceRef={priceRef}
        language={language}
        t={t}
      />

      {/* Hero / Main Section */}
      <section
        style={{
          minHeight: "calc(100vh - 140px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "96px", fontWeight: "800", marginBottom: "20px" }}>
          404
        </h1>
        <p style={{ fontSize: "22px", fontWeight: "500", marginBottom: "10px" }}>
          {language === "en" ? "Page not found" : "Halaman tidak ditemukan"}
        </p>
        <p style={{ fontSize: "16px", color: "#666", maxWidth: "500px", marginBottom: "30px" }}>
          {language === "en"
            ? "The page you are looking for might have been removed or is temporarily unavailable."
            : "Halaman yang Anda cari mungkin telah dihapus atau tidak tersedia sementara."}
        </p>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => navigate(language === "en" ? "/en" : "/")}
            style={{
              padding: "12px 28px",
              borderRadius: "8px",
              border: "none",
              background: "#111",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {language === "en" ? "Back to Home" : "Kembali ke Home"}
          </button>

        </div>
      </section>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}
