import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaUser, FaPowerOff, FaGear, FaRankingStar, FaHouse, FaDoorOpen, FaBook, FaGlobe, FaCrown, FaGem, FaPlus } from "react-icons/fa6";
import { HiMenuAlt2, HiChevronDown, HiX } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Setting from "../pages/Setting/Setting";
import CreateAssessmentModal from "../pages/Assessment/CreateAssessmentModal";

const Topbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSetting, setShowSetting] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const settingsRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isEnglish = location.pathname.startsWith("/en");
  const basePath = isEnglish ? "/en" : "";



  // Cek ukuran layar untuk mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };


  const handleSettingsClick = () => {
    setShowSetting(true);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate(`${basePath}/d/beranda`);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleProductsClick = () => {
    navigate(`${basePath}/result/list`);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleRoomClick = () => {
    navigate(`${basePath}/room-class/list`);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleLibraryClick = () => {
    navigate(`${basePath}/room-class/list`);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleCreateClick = () => {
  setShowCreateModal(true);
  setOpenDropdown(null);
  setIsMobileMenuOpen(false);
};

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };


  // Menu items untuk desktop
  const DesktopMenuItems = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        onClick={handleHomeClick}
        style={menuButtonStyle}
      >
        <FaHouse size={14} />
        <span>Home</span>
      </button>
      <button
        onClick={handleCreateClick}
        style={menuButtonStyle}
      >
        <FaPlus size={14} />
        <span>Create</span>
      </button>
      <button
        onClick={handleProductsClick}
        style={menuButtonStyle}
      >
        <FaRankingStar size={14} />
        <span>Results</span>
      </button>
      <button
        onClick={handleRoomClick}
        style={menuButtonStyle}
      >
        <FaDoorOpen size={14} />
        <span>Room</span>
      </button>
      <button
        onClick={handleLibraryClick}
        style={menuButtonStyle}
      >
        <FaBook size={14} />
        <span>Library</span>
      </button>
    </div>
  );

  // Menu items untuk mobile (di dalam drawer)
  const MobileMenuItems = () => (
    <div style={mobileMenuStyles}>
      <div style={mobileMenuHeader}>
        <div>
          <div style={mobileUserTitle}>John Doe</div>
          <div style={mobileUserEmail}>john@example.com</div>
        </div>
      </div>

      <div style={mobileMenuNav}>
        <button onClick={handleHomeClick} style={mobileNavButton}>
          <FaHouse size={18} />
          <span>Home</span>
        </button>
        <button onClick={handleCreateClick} style={mobileNavButton}>
          <FaPlus size={18} />
          <span>Create</span>
        </button>
        <button onClick={handleProductsClick} style={mobileNavButton}>
          <FaRankingStar size={18} />
          <span>Results</span>
        </button>
        <button onClick={handleRoomClick} style={mobileNavButton}>
          <FaDoorOpen size={18} />
          <span>Room</span>
        </button>
        <button onClick={handleLibraryClick} style={mobileNavButton}>
          <FaDoorOpen size={18} />
          <span>Library</span>
        </button>
      </div>

      <div style={mobileMenuDivider} />


      <div style={mobileMenuDivider} />

      {/* Language Section */}
      <div style={mobileMenuSection}>
        <div style={mobileSectionTitle}>Language</div>
        <button 
          onClick={() => handleLanguageChange("English")} 
          style={{...mobileMenuOption, backgroundColor: language === "English" ? "#f0f0f0" : "transparent"}}
        >
          <FaGlobe size={16} />
          <span>English</span>
          {language === "English" && <span style={mobileCheckmark}>✓</span>}
        </button>
        <button 
          onClick={() => handleLanguageChange("Indonesian")} 
          style={{...mobileMenuOption, backgroundColor: language === "Indonesian" ? "#f0f0f0" : "transparent"}}
        >
          <FaGlobe size={16} />
          <span>Indonesian</span>
          {language === "Indonesian" && <span style={mobileCheckmark}>✓</span>}
        </button>
      </div>

      <div style={mobileMenuDivider} />

      {/* Settings & Logout */}
      <div style={mobileMenuSection}>
        <button onClick={handleSettingsClick} style={mobileMenuOption}>
          <FaGear size={16} />
          <span>Settings</span>
        </button>
        <button onClick={handleLogout} style={{...mobileMenuOption, color: "#d32f2f"}}>
          <FaPowerOff size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const menuButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    color: "#484848",
    cursor: "pointer",
    fontSize: "13px",
  };

  const mobileMenuStyles = {
    position: "fixed",
    top: 0,
    right: 0,
    width: "280px",
    height: "100vh",
    backgroundColor: "#fff",
    boxShadow: "-2px 0 12px rgba(0,0,0,0.15)",
    zIndex: 2000,
    overflowY: "auto",
    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
  };

  const mobileMenuHeader = {
    padding: "20px",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #e0e0e0",
  };

  const mobileUserTitle = {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "4px",
  };

  const mobileUserEmail = {
    fontSize: "12px",
    color: "#666",
  };

  const mobileMenuNav = {
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  };

  const mobileNavButton = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
  };

  const mobileMenuDivider = {
    height: "1px",
    backgroundColor: "#f0f0f0",
    margin: "8px 0",
  };

  const mobileMenuSection = {
    padding: "8px 0",
  };

  const mobileSectionTitle = {
    padding: "8px 20px",
    fontSize: "11px",
    color: "#888",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const mobileMenuOption = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "10px 20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    textAlign: "left",
  };

  const mobileCheckmark = {
    marginLeft: "auto",
    color: "#4caf50",
    fontSize: "12px",
  };


  // Overlay untuk mobile menu
  const MobileMenuOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1999,
        opacity: isMobileMenuOpen ? 1 : 0,
        visibility: isMobileMenuOpen ? "visible" : "hidden",
        transition: "opacity 0.3s ease-in-out",
      }}
      onClick={() => setIsMobileMenuOpen(false)}
    />
  );

  return (
    <>
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

      <div
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        {/* Kiri: Toggle Menu untuk Mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <HiMenuAlt2 size={20} />
            </button>
          )}
          
          {/* Desktop Menu */}
          {!isMobile && <DesktopMenuItems />}
        </div>

        {/* Kanan: Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Dropdown Profile (Desktop only) */}
          {!isMobile && (
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                onClick={() => toggleDropdown('profile')}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <FaUser size={14} />
                <HiChevronDown size={12} />
              </button>
              
              {openDropdown === 'profile' && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    minWidth: "220px",
                    border: "1px solid #e0e0e0",
                    zIndex: 1100,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f0f0f0",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>John Doe</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>john@example.com</div>
                  </div>
                  
                  <div
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 16px",
                        fontSize: "11px",
                        color: "#888",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Language
                    </div>
                    <div
                      onClick={() => handleLanguageChange("English")}
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: language === "English" ? "#f0f0f0" : "transparent",
                      }}
                    >
                      <FaGlobe size={14} style={{ color: "#666" }} />
                      <span style={{ fontSize: "13px" }}>English</span>
                      {language === "English" && (
                        <span style={{ marginLeft: "auto", color: "#4caf50", fontSize: "12px" }}>✓</span>
                      )}
                    </div>
                    <div
                      onClick={() => handleLanguageChange("Indonesian")}
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: language === "Indonesian" ? "#f0f0f0" : "transparent",
                      }}
                    >
                      <FaGlobe size={14} style={{ color: "#666" }} />
                      <span style={{ fontSize: "13px" }}>Indonesian</span>
                      {language === "Indonesian" && (
                        <span style={{ marginLeft: "auto", color: "#4caf50", fontSize: "12px" }}>✓</span>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={handleLogout}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#d32f2f",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <FaPowerOff size={14} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobile && (
        <>
          <MobileMenuOverlay />
          <div ref={mobileMenuRef} style={mobileMenuStyles}>
            <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <HiX size={24} />
              </button>
            </div>
            <MobileMenuItems />
          </div>
        </>
      )}
<CreateAssessmentModal 
  isOpen={showCreateModal} 
  onClose={() => setShowCreateModal(false)} 
/>
    
      {/* Modal Setting */}
      {showSetting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowSetting(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Setting onClose={() => setShowSetting(false)} />
          </div>
        </div>
      )}

    </>
  );
};

export default Topbar;