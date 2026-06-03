import React from "react";

const BulkDeleteModal = ({ show, count, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "20px 25px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Konfirmasi Hapus</h3>
        <p style={{ fontSize: "14px", color: "#555" }}>
          Apakah kamu yakin ingin menghapus <b>{count}</b> data terpilih?
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              background: "#f9f9f9",
              cursor: "pointer",
            }}
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
              background: "#d9534f",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;
