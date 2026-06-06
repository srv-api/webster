import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "/2.png";

export default function Navbar({
  heroRef,
  aboutRef,
  priceRef,
  onLoginClick ,
  t,
}) {

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const dropdownRef = useRef(null);

  // ===============================
  // LANGUAGE FROM URL
  // ===============================
  const isEnglish = location.pathname.startsWith("/en");
  const langPrefix = isEnglish ? "/en" : "";

  // ===============================
  // HELPERS
  // ===============================
  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const goToService = (path) => {
    navigate(`${langPrefix}${path}`);
    setServiceOpen(false);
    setMenuOpen(false);
  };

  const goToLogin = () => {
    const consoleUrl = import.meta.env.VITE_CONSOLE_URL;
    if (!consoleUrl) {
      console.error("VITE_CONSOLE_URL is undefined");
      return;
    }

    const langPath = isEnglish ? "/en" : "";
    window.location.href = `${consoleUrl}${langPath}/login`;
  };

  const handleLogoClick = () => {
  // kalau bukan di halaman home → pindah ke home
  if (location.pathname !== `${langPrefix}/` && location.pathname !== "/") {
    navigate(`${langPrefix}/`);
    return;
  }

  // kalau sudah di home → scroll ke atas / hero
  if (heroRef?.current) {
    heroRef.current.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  setMenuOpen(false);
};

  // ===============================
  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  // ===============================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServiceOpen(false);
      }
    };

 document.addEventListener("click", handleClickOutside);
    return () =>
   document.removeEventListener("click", handleClickOutside);
  }, []);

  // ===============================
  // RENDER
  // ===============================
  return (
    <nav className="navbar">
     <div className="logo-wrapper" onClick={handleLogoClick}>
      <div className="logo-brand">
        <span className="logo-p">P</span>

        <span className="logo-o">
          <span className="logo-o-inner"></span>
        </span>

        <span className="logo-rest">stTest</span>

        <span className="logo-io">io</span>
      </div>
    </div>

      {/* MOBILE TOGGLE */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </div>

      {/* RIGHT MENU */}
      <div className={`nav-right ${menuOpen ? "active" : ""}`}>
        <div className="nav-links">
          <button onClick={() => navigate(`${langPrefix}/blog`)}>
            Blog
          </button>
          <button onClick={() => navigate(`${langPrefix}/blog`)}>
            Plans
          </button>
        </div>

        {/* LANGUAGE TOGGLE */}
        <div className="language-toggle">
          <button
            className={!isEnglish ? "active-lang" : ""}
            onClick={() => {
              const path = location.pathname.replace(/^\/en/, "") || "/";
              navigate(`${path}${location.search}`);
            }}
          >
            ID
          </button>

          <button
            className={isEnglish ? "active-lang" : ""}
            onClick={() => {
              const path = location.pathname.replace(/^\/en/, "");
              navigate(`/en${path}${location.search}`);
            }}
          >
            EN
          </button>
        </div>

        {/* LOGIN */}
        <button className="btn-login" onClick={onLoginClick || goToLogin}>
          {t.login}
        </button>
      </div>
    </nav>
  );
}
