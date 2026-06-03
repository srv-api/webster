import React, { useState, useEffect } from "react";
import ImportModal from "./ImportModal";
import ExportModal from "./ExportModal";
import { fetchCategoryData} from "../../services/product/api";

const Headbar = ({
  search,
  setSearch,
  searchCategory,
  setSearchCategory,
  limit,
  setLimit,
  selectedRows,
  setData,
  data,
  setSelectedRows,
  onAddNew,
  isBulkEditMode,
  setIsBulkEditMode,
  handleSaveBulkEdit,
  onBulkDelete,
  onExportPDF,
  onExportExcel,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategoryData();
        setCategories(res || []);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };
    loadCategories();
  }, []);

  const handleBulkEditClick = () => {
    if (isBulkEditMode) {
      handleSaveBulkEdit();
    } else {
      if (selectedRows.length === 0) {
        alert("Tidak ada data yang dipilih!");
        return;
      }
      setIsBulkEditMode(true);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedRows.length === 0) {
      alert("Tidak ada data yang dipilih!");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setShowConfirmModal(false);
    if (typeof onBulkDelete === "function") onBulkDelete();
  };

  return (
    <>
      {/* === HEADBAR === */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1000, // 🔥 DITINGKATKAN dari 900 ke 1000 (di atas header tabel)
          gap: "10px",
          flexWrap: "wrap", // agar responsif
        }}
      >
        {/* 🔹 Kiri: tombol aksi */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={onAddNew} style={btnStyle}>
            + New
          </button>

          <button
            onClick={handleBulkDeleteClick}
            disabled={selectedRows.length === 0}
            style={{
              ...btnStyle,
              backgroundColor: selectedRows.length === 0 ? "#f9f9f9" : "#fff",
              color: selectedRows.length === 0 ? "#aaa" : "#000",
              cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Bulk Delete
          </button>

          <button onClick={handleBulkEditClick} style={btnStyle}>
            {isBulkEditMode ? "Save Changes" : "Bulk Edit"}
          </button>

          <button style={btnStyle} onClick={() => setShowImportModal(true)}>
            Import
          </button>

          <button style={btnStyle} onClick={() => setShowExportModal(true)}>
            Export
          </button>
        </div>

        {/* 🔹 Filter Kategori */}
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* 🔹 Search Input */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        {/* 🔹 Limit per halaman */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={selectStyle}
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
        </select>
      </div>

      {/* === MODAL DELETE === */}
      {showConfirmModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: "10px" }}>Konfirmasi Hapus</h3>
            <p style={{ marginBottom: "20px", fontSize: "14px" }}>
              Apakah kamu yakin ingin menghapus{" "}
              <b>{selectedRows.length}</b> data yang dipilih?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={btnCancel}
              >
                Batal
              </button>
              <button onClick={confirmDelete} style={btnDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL IMPORT === */}
      {showImportModal && (
        <ImportModal show={showImportModal} onClose={() => setShowImportModal(false)} />
      )}

      {/* === MODAL EXPORT === */}
      {showExportModal && (
        <ExportModal
          show={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExportPDF={onExportPDF}
          onExportExcel={onExportExcel}
        />
      )}
    </>
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
  transition: "all 0.2s ease",
};

const selectStyle = {
  padding: "7px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "12px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  flex: "1",
  minWidth: "200px",
  outline: "none",
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
  zIndex: 2000, // 🔥 Modal harus di atas segalanya
  backdropFilter: "blur(3px)",
};

const modalBox = {
  backgroundColor: "#fff",
  padding: "25px 20px",
  borderRadius: "10px",
  width: "320px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  textAlign: "center",
};

const btnCancel = {
  ...btnStyle,
  backgroundColor: "#f1f1f1",
};

const btnDelete = {
  ...btnStyle,
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
};

export default Headbar;