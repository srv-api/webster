import React, { useState } from "react";
import Personalization from "./Personalization";
import Merchant from "./Merchant";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Setting = ({ onClose }) => {
  const [activeMenu, setActiveMenu] = useState("personalization");
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [personalization, setPersonalization] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    password: "",
  });

  const [merchant, setMerchant] = useState({
    ownerName: "",
    merchantName: "",
    city: "",
    country: "",
    currency: "",
    zip: "",
    phone: "",
  });

  const menuItems = [
    { key: "account", label: "Account" },
    { key: "merchant", label: "Merchant" },
    { key: "rekeningbank", label: "Rekening Bank" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
  ];

const handleLogout = async () => {
  setLoadingLogout(true);

  try {
    await axios.post(
      "http://localhost:2356/auth/logout",
      {},
    );

    // 🔥 Hapus cookie manual karena bisa diakses JS
    Cookies.remove("refresh_token");
    Cookies.remove("token");
    localStorage.removeItem("token", { domain: ".posttest.co.id", path: "/" });
    toast.success("Logout successful", { autoClose: 1000 });

    setTimeout(() => {
      window.location.replace("https://console.posttest.co.id/login");
    }, 1000);
  } catch (err) {
    console.error(err);
    toast.error("Logout failed");
  } finally {
    setLoadingLogout(false);
  }
};

  const renderContent = () => {
    switch (activeMenu) {
      case "personalization":
        return (
          <Personalization
            data={personalization}
            onChange={(e) =>
              setPersonalization((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            onSave={() => alert("Personalization info saved!")}
          />
        );
      case "merchant":
        return (
          <Merchant
            data={merchant}
            onChange={(e) =>
              setMerchant((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            onSave={() => alert("Merchant info saved!")}
          />
        );
      default:
        return <div>Coming Soon...</div>;
    }
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
          display: "flex",
          width: "750px",
          maxWidth: "95vw",
          height: "80vh",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
          position: "relative", // penting agar tombol close bisa absolut
        }}
      >
        {/* Tombol Close di pojok kanan atas modal */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "6px 10px",
            border: "none",
            backgroundColor: "#fff",
            color: "#626262",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          X
        </button>

        {/* Sidebar */}
        <div
          style={{
            width: "160px",
            backgroundColor: "#f7f7f7",
            padding: "20px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          {/* Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  backgroundColor: activeMenu === item.key ? "#e2e2e2" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                  color: activeMenu === item.key ? "#000" : "#626262",
                  fontSize: "12px",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            style={{
              padding: "10px 12px",
              textAlign: "left",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loadingLogout ? "not-allowed" : "pointer",
              fontSize: "12px",
            }}
          >
            {loadingLogout ? "Logging out..." : "Log Out"}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Setting;
