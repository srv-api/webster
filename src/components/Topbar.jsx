import React, { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaUser, FaPowerOff, FaGear, FaRankingStar, FaHouse, FaDoorOpen, FaGlobe, FaCrown, FaGem } from "react-icons/fa6";
import { HiMenuAlt2, HiChevronDown } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Setting from "../pages/Setting/Setting";

const Topbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSetting, setShowSetting] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isPremium, setIsPremium] = useState(false); // State untuk status premium
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const ordersRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  const isEnglish = location.pathname.startsWith("/en");
  const basePath = isEnglish ? "/en" : "";

  // Cek status premium dari localStorage atau API
  useEffect(() => {
    const checkPremiumStatus = () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setIsPremium(userData.isPremium || false);
    };
    checkPremiumStatus();
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ordersRef.current && !ordersRef.current.contains(event.target)) {
        if (openDropdown === 'orders') setOpenDropdown(null);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        if (openDropdown === 'settings') setOpenDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        if (openDropdown === 'profile') setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleOrdersClick = () => {
    setShowOrders(true);
    setOpenDropdown(null);
  };

  const handleSettingsClick = () => {
    setShowSetting(true);
    setOpenDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setOpenDropdown(null);
  };

  const handleHomeClick = () => {
    navigate(`${basePath}/d/beranda`);
    setOpenDropdown(null);
  };

  const handleProductsClick = () => {
    navigate(`${basePath}/result/list`);
    setOpenDropdown(null);
  };

  const handleRoomClick = () => {
    navigate(`${basePath}/room-class/list`);
    setOpenDropdown(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setOpenDropdown(null);
    // Add your language change logic here
    // For example: change URL path or update i18n context
  };

  const handleUpgradePremium = () => {
    setShowPremiumModal(true);
    setOpenDropdown(null);
  };

  const handlePremiumPurchase = (plan) => {
    // Simulasi pembelian premium
    toast.success(`Successfully upgraded to ${plan} plan!`, {
      position: "top-right",
      autoClose: 3000,
    });
    
    // Update status premium
    setIsPremium(true);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    userData.isPremium = true;
    userData.premiumPlan = plan;
    userData.premiumSince = new Date().toISOString();
    localStorage.setItem("user", JSON.stringify(userData));
    
    setShowPremiumModal(false);
  };

  const handlePremiumFeatures = () => {
    if (!isPremium) {
      toast.info("Please upgrade to premium to access this feature!", {
        position: "top-right",
        autoClose: 3000,
      });
      handleUpgradePremium();
      return;
    }
    // Navigate to premium features page
    navigate(`${basePath}/premium/features`);
    setOpenDropdown(null);
  };

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
        {/* Kiri: Toggle + Play Store */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
         
          {/* TOMBOL PRODUCTS - TAMBAHAN */}
          <button
            onClick={handleHomeClick}
            style={{
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
            }}
            // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
            // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
          >
            <FaHouse size={14} />
            <span>Home</span>
          </button>
           {/* TOMBOL PRODUCTS - TAMBAHAN */}
          <button
            onClick={handleProductsClick}
            style={{
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
            }}
            // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
            // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
          >
            <FaRankingStar size={14} />
            <span>Results</span>
          </button>
          <button
            onClick={handleRoomClick}
            style={{
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
            }}
          >
            <FaDoorOpen size={14} />
            <span>Room</span>
          </button>
        </div>

        {/* Kanan: Dropdown Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Premium Badge - Tampil jika sudah premium */}
          {isPremium && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "20px",
                backgroundColor: "#ffd700",
                color: "#8b6914",
                fontSize: "11px",
                fontWeight: "bold",
              }}
            >
              <FaCrown size={12} />
              <span>PREMIUM</span>
            </div>
          )}

          {/* Dropdown Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => toggleDropdown('profile')}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "20px",
                backgroundColor: openDropdown === 'profile' ? "#ffffff" : "#ffffff",
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
                
                {/* PREMIUM ACCESS SECTION - Added above language */}
                <div
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                    backgroundColor: isPremium ? "#fff8e1" : "transparent",
                  }}
                >
                  {!isPremium ? (
                    // Not Premium - Show Upgrade Option
                    <>                    
                      <div
                        onClick={handlePremiumFeatures}
                        style={{
                          padding: "8px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <FaGem size={14} style={{ color: "#764ba2" }} />
                        <span style={{ fontSize: "13px" }}>Premium Features</span>
                      </div>
                    </>
                  ) : (
                    // Already Premium - Show Premium Status and Management
                    <>
                      <div
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#fff8e1",
                          borderLeft: "3px solid #ffd700",
                          marginBottom: "4px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <FaCrown size={14} style={{ color: "#ffd700" }} />
                          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#8b6914" }}>
                            Premium Active
                          </span>
                        </div>
                        <div style={{ fontSize: "10px", color: "#8b6914" }}>
                          Unlimited access to all features
                        </div>
                      </div>
                      
                      <div
                        onClick={handlePremiumFeatures}
                        style={{
                          padding: "8px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <FaGem size={14} style={{ color: "#764ba2" }} />
                        <span style={{ fontSize: "13px" }}>Premium Dashboard</span>
                      </div>
                      
                      <div
                        onClick={() => {
                          toast.info("Manage your subscription", { position: "top-right" });
                          setOpenDropdown(null);
                        }}
                        style={{
                          padding: "8px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <FaGear size={12} />
                        <span>Manage Subscription</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Language Dropdown Section */}
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
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => {
                      if (language !== "English") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
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
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => {
                      if (language !== "Indonesian") {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <FaGlobe size={14} style={{ color: "#666" }} />
                    <span style={{ fontSize: "13px" }}>Indonesian</span>
                    {language === "Indonesian" && (
                      <span style={{ marginLeft: "auto", color: "#4caf50", fontSize: "12px" }}>✓</span>
                    )}
                  </div>
                </div>

                {/* Logout Option */}
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
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  <FaPowerOff size={14} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
          onClick={() => setShowPremiumModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              padding: "24px",
              position: "relative",
            }}
          >
            <h2 style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaCrown style={{ color: "#ffd700" }} />
              Upgrade to Premium
            </h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Get unlimited access to all premium features
            </p>

            {/* Premium Plans */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              {/* Monthly Plan */}
              <div
                style={{
                  flex: 1,
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102,126,234,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => handlePremiumPurchase("Monthly")}
              >
                <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Monthly</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#667eea", marginBottom: "8px" }}>
                  $9.99
                  <span style={{ fontSize: "14px", color: "#666" }}>/mo</span>
                </div>
                <ul style={{ fontSize: "12px", color: "#666", paddingLeft: "20px", margin: "8px 0" }}>
                  <li>Unlimited access</li>
                  <li>Priority support</li>
                  <li>Advanced features</li>
                </ul>
                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "12px",
                  }}
                >
                  Choose Plan
                </button>
              </div>

              {/* Yearly Plan (Recommended) */}
              <div
                style={{
                  flex: 1,
                  border: "2px solid #ffd700",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                  position: "relative",
                  backgroundColor: "#fff8e1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,215,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => handlePremiumPurchase("Yearly")}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "16px",
                    backgroundColor: "#ffd700",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#8b6914",
                  }}
                >
                  RECOMMENDED
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Yearly</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#ffd700", marginBottom: "8px" }}>
                  $99.99
                  <span style={{ fontSize: "14px", color: "#666" }}>/year</span>
                </div>
                <div style={{ fontSize: "12px", color: "#4caf50", marginBottom: "8px" }}>
                  Save 17% vs monthly
                </div>
                <ul style={{ fontSize: "12px", color: "#666", paddingLeft: "20px", margin: "8px 0" }}>
                  <li>Everything in Monthly</li>
                  <li>2 months free</li>
                  <li>Exclusive content</li>
                </ul>
                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#ffd700",
                    color: "#8b6914",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Choose Plan
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPremiumModal(false)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

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

      {/* Modal Order List */}
      {showOrders && (
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
            padding: "20px",
          }}
          onClick={() => setShowOrders(false)}
        >
         
        </div>
      )}
    </>
  );
};

export default Topbar;