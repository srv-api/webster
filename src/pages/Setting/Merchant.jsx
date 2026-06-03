import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Merchant = () => {
  const [data, setData] = useState({
    id_number: "",
    merchant_name: "",
    address: "",
    country: "",
    city: "",
    zip: "",
    phone: "",
    currency_id: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:2388/merchant/get";
  const REFRESH_URL = "http://localhost:2356/auth/refresh"; // ubah sesuai endpoint refresh token kamu

  // 🔹 Ambil token dari cookie
  const getAccessToken = () => Cookies.get("token");
  const getRefreshToken = () => Cookies.get("refresh_token");

  // 🔹 Ambil data merchant
  const fetchMerchant = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (res.data?.status && res.data.data) {
        setData(res.data.data);
        setOriginalData(res.data.data);
      } else {
        toast.error("Gagal memuat data merchant");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        await handleTokenRefresh();
      } else {
        console.error(err);
        toast.error("Terjadi kesalahan memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Refresh token jika expired
  const handleTokenRefresh = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return toast.error("Session expired, silakan login ulang");

    try {
      const res = await axios.post(REFRESH_URL, { refresh_token: refreshToken });
      const newAccess = res.data?.token;

      if (newAccess) {
        Cookies.set("token", newAccess);
        await fetchMerchant(); // ulangi request sebelumnya
      } else {
        toast.error("Gagal refresh token, silakan login ulang");
      }
    } catch {
      toast.error("Session expired, silakan login ulang");
    }
  };

  // 🔹 Cek perubahan form
  useEffect(() => {
    const changed = Object.keys(data).some((key) => data[key] !== originalData[key]);
    setIsChanged(changed);
  }, [data, originalData]);

  // 🔹 Load data pertama kali
  useEffect(() => {
    fetchMerchant();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
  if (!isChanged) return;

  try {
    setLoading(true);

    const res = await axios.put(
      "http://localhost:2388/merchant/update",
      data, // body tetap dikirim
      {
        params: {
          id: data.id, // ⬅️ kirim id sebagai query param
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data?.status) {
      toast.success("✅ Data merchant berhasil disimpan!");
      setOriginalData(data);
      setIsChanged(false);
    } else {
      toast.error("❌ Gagal menyimpan perubahan");
    }
  } catch (err) {
    console.error(err);
    toast.error("Terjadi kesalahan saat menyimpan");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "15px",
        }}
      >
        <h5 style={{ margin: 0 }}>Merchant</h5>
        <button
          onClick={handleSave}
          disabled={!isChanged || loading}
          style={{
            padding: "4px 10px",
            fontSize: "12px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: isChanged ? "#000" : "#ccc",
            color: "#fff",
            cursor: isChanged ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Merchant Name & ID Number */}
        <div style={{ display: "flex", gap: "30px" }}>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            Merchant Name:
            <input
              type="text"
              name="merchant_name"
              value={data.merchant_name || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </label>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            ID Number:
            <input
              type="text"
              name="id_number"
              value={data.id_number || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </label>
        </div>

        {/* City & Country */}
        <div style={{ display: "flex", gap: "30px" }}>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            City:
            <input
              type="text"
              name="city"
              value={data.city || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </label>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            Country:
            <input
              type="text"
              name="country"
              value={data.country || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </label>
        </div>

        {/* Address */}
        <div>
          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            Address:
            <textarea
              name="address"
              value={data.address || ""}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%", padding: "8px", resize: "vertical", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
              placeholder="Enter full address"
            />
          </label>
        </div>

        {/* Currency, Zip & Phone */}
        <div style={{ display: "flex", gap: "30px" }}>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            Currency:
            <select
              name="currency_id"
              value={data.currency_id || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              <option value="">-- Select Currency --</option>
              <option value="1">Rp</option>
              <option value="2">$</option>
            </select>
          </label>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            Zip:
            <input
              type="text"
              name="zip"
              value={data.zip || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </label>
          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            Phone:
            <input
              type="text"
              name="phone"
              value={data.phone || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", color: "#000", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Merchant;
