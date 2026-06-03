import React, { useState } from "react";
import { uploadImage } from "../../services/product/api";
import { toast } from "react-toastify";

const ImageUploadModal = ({ show, onClose, product, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  if (!show) return null;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Pilih file dulu!");
      return;
    }

    try {
      // Panggil API upload
      await uploadImage(product.id, selectedFile, setProgress);
      alert("Upload berhasil!");
      setSelectedFile(null);
      setProgress(0);
      onClose();

      // callback kalau ingin refresh data di parent
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h3>Upload Image</h3>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {progress > 0 && (
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#eee",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4caf50",
                borderRadius: "5px",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleUpload} style={{ marginRight: "10px" }}>
            Upload
          </button>
          <button
            onClick={() => {
              setSelectedFile(null);
              setProgress(0);
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
