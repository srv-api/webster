import React, { useState } from "react";
import { exportProductsToExcel } from "../../services/product/api";

const ExportModal = ({ show, onClose }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async (type) => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates!");
      return;
    }

    setLoading(true);
    try {
      if (type === "excel") {
        await exportProductsToExcel(fromDate, toDate);
      } else if (type === "pdf") {
        // nanti tambahkan export PDF di sini
        console.log("PDF export not yet implemented");
      }
    } catch (err) {
      console.error("❌ Error exporting Excel:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div style={modalOverlay}>
      <div style={{ ...modalBox, width: "360px" }}>
        <h3 style={{ marginBottom: "15px" }}>📤 Export Data</h3>

        {/* Filter tanggal */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "48%" }}>
            <label style={{ fontSize: "13px", marginBottom: "4px" }}>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={inputDate}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: "48%" }}>
            <label style={{ fontSize: "13px", marginBottom: "4px" }}>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={inputDate}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            style={btnStyle}
            onClick={() => handleExport("excel")}
            disabled={loading}
          >
            {loading ? "⏳ Exporting..." : "📊 Export to Excel"}
          </button>

          <button
            style={btnStyle}
            onClick={() => handleExport("pdf")}
            disabled={loading}
          >
            📄 Export to PDF
          </button>

          <button style={btnCancel} onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* === STYLE === */
const btnStyle = {
  padding: "7px 14px",
  borderRadius: "4px",
  backgroundColor: "#fff",
  color: "#000",
  border: "1px solid #d1d1d1",
  cursor: "pointer",
  fontSize: "12px",
};

const btnCancel = {
  ...btnStyle,
  backgroundColor: "#f1f1f1",
};

const inputDate = {
  padding: "6px 8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "13px",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(3px)",
};

const modalBox = {
  backgroundColor: "#fff",
  padding: "25px 20px",
  borderRadius: "10px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  textAlign: "center",
};

export default ExportModal;
