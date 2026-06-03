import React, { useState } from "react";
import { fetchTemplate, uploadTemplate } from "../../services/product/api"; // ✅ pastikan path-nya sesuai

const ImportModal = ({ show, onClose }) => {
  const [file, setFile] = useState(null);

const handleImport = async () => {
  if (!file) {
    alert("Silakan pilih file terlebih dahulu!");
    return;
  }

  try {
    const response = await uploadTemplate(file);
    alert(response?.message || "✅ File berhasil diupload!");
    onClose();
    setFile(null);
  } catch (error) {
    console.error(error);
    alert("Gagal mengupload file!");
  }
};

  if (!show) return null;

  

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h2 style={titleStyle}>📁 Import Data</h2>
        <p style={descStyle}>
          Please download the template, fill in the data, and then upload.
        </p>

        <button
          onClick={fetchTemplate}
          style={btnDownload}
        >
          ⬇️ Download Template
        </button>

        <div style={{ marginTop: "20px" }}>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={inputFile}
          />
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={btnCancel}>
            Cancel
          </button>
          <button onClick={handleImport} style={btnUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

/* === STYLE === */
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
  padding: "25px 30px",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "600",
};

const descStyle = {
  fontSize: "13px",
  color: "#555",
  marginBottom: "15px",
};

const btnDownload = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "13px",
};

const inputFile = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "8px",
  fontSize: "13px",
};

const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  marginTop: "25px",
};

const btnCancel = {
  backgroundColor: "#f1f1f1",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: "13px",
};

const btnUpload = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: "13px",
};

export default ImportModal;
