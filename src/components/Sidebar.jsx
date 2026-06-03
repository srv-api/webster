// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHouseUser,
  FaUser,
  FaShoppingCart,
  FaBoxOpen,
  FaCashRegister,
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
  FaFileInvoice,
  FaEnvelope,
  FaLifeRing,
  FaCog,
  FaUserCog,
  FaBell,
  FaUsersCog,
  FaTasks,
  FaFileAlt,
  FaPuzzlePiece,
  FaQuestionCircle,
  FaTags,
  FaTrademark,
  FaPercent,
  FaBalanceScale,
  FaCalendarCheck,
  FaBarcode,
} from "react-icons/fa";

import { fetchSider } from "./sidebarApi";
import SubscribeModal from "../pages/Subscribe/SubscribeModal";
import Setting from "../pages/Setting/Setting";

const iconMap = {
  Permission: <FaTasks />,
  User: <FaUser />,
  Role: <FaUsersCog />,
  "Role User": <FaUsers />,
  "Role User Permission": <FaPuzzlePiece />,
  "Payment Method": <FaMoneyBillWave />,
  "Content Setting": <FaCog />,
  Printer: <FaFileAlt />,
};

const Sidebar = ({ collapsed }) => {
const location = useLocation();

  // ✅ Bahasa dari URL (TANPA /id)
  const isEnglish = location.pathname.startsWith("/en");
  const basePath = isEnglish ? "/en" : "";

  const [dynamicMenu, setDynamicMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  // Static menu
  const staticMenuItems = [
    { label: "Home", to: `${basePath}/d/beranda`, icon: <FaHouseUser /> },
    { label: "Results", to: `${basePath}/result/list`, icon: <FaBoxOpen /> },
    { label: "Category", to: `${basePath}/category/list`, icon: <FaTags /> },
    { label: "Merk", to: `${basePath}/merk/list`, icon: <FaTrademark /> },
    { label: "Discount", to: `${basePath}/discount/list`, icon: <FaPercent /> },
    { label: "Tax", to: `${basePath}/tax/list`, icon: <FaBalanceScale /> },
//     { label: "Reservation", to: `${basePath}/reservation`, icon: <FaCalendarCheck /> },
//     {
//   label: "Transaction Methode",
//   icon: <FaBarcode />,
//   children: [
//         { label: "Qris", to: `${basePath}/transaction-methode/qris/list`, icon: <FaBarcode /> },
//         { label: "Bank", to: `${basePath}/transaction-methode/bank`, icon: <FaBalanceScale /> },
//         { label: "Kartu Debit", to: `${basePath}/transaction-methode/debit`, icon: <FaPercent /> },
//         { label: "E-Wallet", to: `${basePath}/transaction-methode/ewallet`, icon: <FaPercent /> },
//   ],
// },
//     // { label: "POS", to: `${basePath}/pos`, icon: <FaCashRegister /> },
//     { label: "Customers", to: `${basePath}/customers`, icon: <FaUsers /> },
//     { label: "Reports", to: `${basePath}/reports`, icon: <FaChartLine /> },
//     { label: "Finance", to: `${basePath}/finance`, icon: <FaMoneyBillWave /> },
//     { label: "Invoices", to: `${basePath}/invoices`, icon: <FaFileInvoice /> },
//     { label: "Messages", to: `${basePath}/messages`, icon: <FaEnvelope /> },
//     { label: "Support", to: `${basePath}/support`, icon: <FaLifeRing /> },
//     { label: "Users", to: `${basePath}/user-merchant/list`, icon: <FaUsersCog /> },
    { label: "Subscribe", action: () => setShowSubscribeModal(true), icon: <FaBell /> },
    { type: "divider" },
    { label: "Setting", action: () => setShowSetting(true), icon: <FaUserCog /> },
  ];

useEffect(() => {
    const loadDynamicMenu = async () => {
      try {
        const rows = await fetchSider();
        const formatted = rows.map((p) => ({
          label: p.label,
          to: `${basePath}${p.to}`,
          icon: iconMap[p.label] || <FaQuestionCircle />,
        }));
        setDynamicMenu(formatted);
      } catch {
        setError("Gagal memuat menu tambahan.");
      } finally {
        setLoading(false);
      }
    };

    loadDynamicMenu();
  }, [basePath]);


  const linkClass = ({ isActive }) =>
  isActive ? "sidebar-link active" : "sidebar-link";

const toggleMenu = (label) => {
  setOpenMenu(openMenu === label ? null : label);
};
  // RENDER menu + mendukung "divider"
const renderMenu = (items) =>
  items.map((item, index) => {
    // Divider
    if (item.type === "divider") {
      return (
        <li
          key={`divider-${index}`}
          style={{ borderTop: "1px solid #ddd", margin: "12px 0" }}
        />
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenu === item.label;

    // ===============================
    // 1. MENU PARENT (PUNYA CHILDREN)
    // ===============================
    if (hasChildren) {
      return (
        <li key={item.label} style={{ marginBottom: "6px" }}>
          <div
            onClick={() => toggleMenu(item.label)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px",
              cursor: "pointer",
              fontWeight: 600,
                color: "#111",

            }}
          >
            <span style={{ fontSize: "12px" }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && (
              <span style={{ marginLeft: "auto", fontSize: "10px" }}>
                {isOpen ? "▼" : "▶"}
              </span>
            )}
          </div>

          {/* SUB MENU */}
          {isOpen && !collapsed && (
            <ul
              style={{
                listStyle: "none",
                paddingLeft: "22px",
                marginTop: "4px",
              }}
            >
              {item.children.map((child) => (
                <li key={child.label} style={{ marginBottom: "4px" }}>
                  <NavLink
                    to={child.to}
                    className={linkClass}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "5px",
                      fontSize: "13px",
                      color: "#555",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{child.icon}</span>
                    <span>{child.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    // ===============================
    // 2. MENU ACTION (SUBSCRIBE, SETTING)
    // ===============================
    if (item.action) {
  return (
    <li key={item.label} style={{ marginBottom: "6px" }}>
      <div
        onClick={item.action}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px",
          cursor: "pointer",
          color: "#000",          // 👈 teks hitam
          fontWeight: 500,        // opsional biar rapi
        }}
      >
        <span style={{ fontSize: "12px", color: "#000" }}>
          {item.icon}
        </span>
        {!collapsed && <span>{item.label}</span>}
      </div>
    </li>
  );
}


    // ===============================
    // 3. MENU LINK BIASA
    // ===============================
    return (
      <li key={item.label} style={{ marginBottom: "6px" }}>
        <NavLink
          to={item.to}
          className={linkClass}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px",
            textDecoration: "none",
            color: "#333",
          }}
        >
          <span style={{ fontSize: "12px" }}>{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      </li>
    );
  });

  return (
    <>
      {/* SIDEBAR */}
      <div
        className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
        style={{
          position: "fixed",
          top: "50px",
          left: 0,
          padding: "2px 0",
          bottom: 0,
          width: collapsed ? "70px" : "250px",
          transition: "width 0.3s ease",
          overflowY: "auto",
          background: "#fff",
          borderRight: "1px solid #ddd",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <ul
          style={{
            padding: "10px",
            listStyle: "none",
            margin: 0,
            fontSize: collapsed ? "11px" : "14px",
            transition: "font-size 0.3s ease",
            paddingBottom: "50px",
          }}
        >
          {renderMenu(staticMenuItems)}

          {!loading && dynamicMenu.length > 0 && !collapsed && (
            <li style={{ margin: "10px 0", borderTop: "1px solid #ddd" }}></li>
          )}

          {loading && (
            <li style={{ fontSize: "12px", padding: "6px" }}>Memuat menu tambahan...</li>
          )}
          {error && (
            <li style={{ fontSize: "12px", color: "red", padding: "6px" }}>{error}</li>
          )}
          {!loading && !error && renderMenu(dynamicMenu)}
        </ul>
      </div>

      {/* MODAL SUBSCRIBE */}
      {showSubscribeModal && (
        <SubscribeModal onClose={() => setShowSubscribeModal(false)} />
      )}

      {/* MODAL SETTING */}
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

export default Sidebar;
