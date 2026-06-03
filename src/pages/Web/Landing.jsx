import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import text from "../../locales/text";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import About from "../../components/about/About";
import Footer from "../../components/footer/Footer";
import FAQ from "../../components/faq/FAQ";
import { trackPackage } from "../../services/tracking/trackingApi";
import Vision from "../../components/vision/Vision";
import ModalLogin from "./ModalLogin"; // IMPORT MODAL

export default function LandingPage() {
  const heroRef = useRef(null);
  const resiRef = useRef(null);
  const aboutRef = useRef(null);
  const trackingRef = useRef(null);
  const faqRef = useRef(null);
  const visionRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const language = location.pathname.startsWith("/en") ? "en" : "id";
  const t = text[language];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // STATE MODAL

  const [tracking, setTracking] = useState({
    courier: "",
    resi: "",
    data: null,
  });

  const handleTrack = async ({ courier, resi }) => {
    try {
      setLoading(true);
      setError("");

      const result = await trackPackage({ courier, resi });

      setTracking({
        courier,
        resi,
        data: result.data,
      });

      setTimeout(() => {
        trackingRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      setError("Gagal mengambil data resi");
      setTracking({ courier: "", resi: "", data: null });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    console.log("Login success");
    // Refresh user state atau redirect
  };

  return (
    <div className="landing-container">
      {/* NAVBAR - tambahkan prop untuk membuka modal */}
      <Navbar
        heroRef={heroRef}
        faqRef={faqRef}
        aboutRef={aboutRef}
        language={language}
        t={t}
        onLoginClick={() => setIsLoginModalOpen(true)} // PASS FUNCTION
      />

      {/* HERO */}
      <Hero heroRef={heroRef} t={t} onTrack={handleTrack} />

      {/* TRACKING RESULT */}
      <div ref={trackingRef}>
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

       

        {/* VISION */}
        <Vision visionRef={visionRef} />

        {/* About */}
        <About aboutRef={aboutRef} t={t} />
      </div>

      {/* FAQ */}
      <FAQ faqRef={faqRef} t={t} />

      {/* FOOTER */}
      <Footer language={language} />

      {/* MODAL LOGIN */}
      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
}