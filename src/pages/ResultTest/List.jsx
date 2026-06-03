import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; // ✅ ambil param dari URL

// 🔹 Components
import Headbar from "./Headbar";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import ProductModal from "./ProductModal";
import DeleteModal from "./DeleteModal";
import BulkDeleteModal from "./BulkDeleteModal";
import ImageUploadModal from "./ImageUploadModal";
import ProductDetailModal from "./ProductDetailModal";

// 🔹 API services
import {
  fetchProducts,
  createProduct,
  bulkDeleteProducts,
  fetchProductById,
  bulkEditProducts,
} from "../../services/product/api";

const List = () => {
  // 🟢 Ambil parameter bahasa dari URL (misal: /id/dashboard atau /en/dashboard)
  const { lang } = useParams();
  const currentLang = lang || "id";

  // 🧠 State management
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchCategory, setSearchCategory] = useState("all");
  const [totalRows, setTotalRows] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    price: "",
    stock: "",
  });

  // 🧭 Load data produk
  const loadProducts = useCallback(async () => {
    try {
      const paginationData = { page: currentPage, limit, search };
      const response = await fetchProducts(paginationData);
      if (response && response.rows) {
        setData(response.rows);
        setTotalRows(response.total_rows || 0);
      } else {
        setData([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      setData([]);
      setTotalRows(0);
    }
  }, [currentPage, limit, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ➕ Tambah produk baru
  const handleAddProduct = () => {
    if (!newProduct.product_name || !newProduct.price) {
      alert(currentLang === "id" ? "Harap isi semua field" : "Please fill in all fields");
      return;
    }

    const newItem = {
      id: "P" + (data.length + 1),
      product_name: newProduct.product_name,
      price: parseInt(newProduct.price),
      stock: newProduct.stock || 0,
      created_at: new Date().toISOString().split("T")[0],
      status: 1,
      image: null,
    };

    setData([newItem, ...data]);
    setNewProduct({ product_name: "", price: "", stock: "" });
    setShowModal(false);
  };

  // 🗑️ Hapus banyak produk sekaligus
  const confirmBulkDelete = async () => {
    try {
      if (selectedRows.length === 0) return;
      await bulkDeleteProducts(selectedRows);
      await loadProducts();
      setSelectedRows([]);
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error("Bulk delete gagal:", error);
      alert(currentLang === "id" ? "Gagal menghapus data!" : "Failed to delete data!");
    }
  };

  // 🔍 Lihat detail produk
  const handleShowDetail = async (row) => {
    try {
      const product = await fetchProductById(row.id);
      if (product) {
        setSelectedProduct(product);
        setShowDetailModal(true);
      } else {
        alert(currentLang === "id" ? "Gagal mengambil detail produk!" : "Failed to fetch product details!");
      }
    } catch (error) {
      console.error(error);
      alert(currentLang === "id" ? "Terjadi kesalahan saat mengambil data produk." : "An error occurred while fetching product data.");
    }
  };

  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "13px",
      }}
    >
      {/* 🔝 Header */}
      <div style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
        <Headbar
          lang={currentLang}
          search={search}
          setSearch={setSearch}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          limit={limit}
          setLimit={setLimit}
          selectedRows={selectedRows}
          data={data}
          setData={setData}
          setSelectedRows={setSelectedRows}
          onAddNew={() => setShowModal(true)}
          isBulkEditMode={isBulkEditMode}
          setIsBulkEditMode={setIsBulkEditMode}
          handleSaveBulkEdit={async () => {
           try {
  // 🔹 Filter hanya yang dipilih & diedit
  const editedItems = Object.keys(editableData)
    .filter((id) => selectedRows.includes(id))
    .map((id) => ({
      id,
      ...editableData[id],
      sku:
        editableData[id].sku !== undefined
          ? Number(editableData[id].sku)
          : undefined,
      stock:
        editableData[id].stock !== undefined
          ? Number(editableData[id].stock)
          : undefined,
      price:
        editableData[id].price !== undefined
          ? Number(editableData[id].price)
          : undefined,
    }))
    .map((item) => {
      // remove undefined props so backend tidak menerima empty fields
      const cleaned = { id: item.id };

      if (item.sku !== undefined) cleaned.sku = item.sku;
      if (item.stock !== undefined) cleaned.stock = item.stock;
      if (item.price !== undefined) cleaned.price = item.price;

      // add other fields if present in editableData
      Object.keys(editableData[item.id]).forEach((field) => {
        if (field !== "stock" && field !== "price" && field !== "sku") {
          cleaned[field] = editableData[item.id][field];
        }
      });

      return cleaned;
    });

  if (editedItems.length === 0) {
    alert("Tidak ada perubahan yang disimpan.");
    setIsBulkEditMode(false);
    return;
  }

  // 🔹 Kirim ke backend
  await bulkEditProducts(editedItems);

  // 🔹 Update data lokal
  const newData = data.map((row) => {
    const edited = editedItems.find((e) => e.id === row.id);
    return edited ? { ...row, ...edited } : row;
  });
  setData(newData);

  // 🔹 Reset state
  setEditableData({});
  setSelectedRows([]);
  setIsBulkEditMode(false);

  alert("Perubahan berhasil disimpan!");
} catch (error) {
  console.error("Gagal menyimpan perubahan:", error);
  alert("Gagal menyimpan perubahan produk!");
}

          }}
          onBulkDelete={() => setShowBulkDeleteModal(true)}
        />
      </div>

      {/* 📋 Tabel Produk */}
      <DataTable
        lang={currentLang}
        data={data}
        setData={setData}
        search={search}
        searchCategory={searchCategory}
        limit={limit}
        currentPage={currentPage}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        isBulkEditMode={isBulkEditMode}
        editableData={editableData}
        setEditableData={setEditableData}
        setShowDeleteModal={setShowDeleteModal}
        setShowImageModal={setShowImageModal}
        setSelectedProduct={setSelectedProduct}
        onDetail={handleShowDetail}
      />

      {/* 📄 Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {/* 💬 Modals */}
      {showModal && (
        <ProductModal
          lang={currentLang}
          product={selectedProduct}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
          setShowModal={setShowModal}
          onSuccess={() => loadProducts()}
        />
      )}

      {showDetailModal && (
        <ProductDetailModal product={selectedProduct} 
        onClose={() => setShowDetailModal(false)} 
        onSuccess={() => loadProducts()
        }
        />
      )}

      <DeleteModal
        lang={currentLang}
        show={showDeleteModal}
        product={selectedProduct}
        onCancel={() => setShowDeleteModal(false)}
        onDeleted={() => {
          setShowDeleteModal(false);
          loadProducts();
        }}
      />

      <ImageUploadModal
        lang={currentLang}
        show={showImageModal}
        product={selectedProduct}
        onClose={() => setShowImageModal(false)}
        onDeleted={() => {
          setShowImageModal(false);
          loadProducts();
        }}
      />

      <BulkDeleteModal
        lang={currentLang}
        show={showBulkDeleteModal}
        count={selectedRows.length}
        onCancel={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
};

export default List;
