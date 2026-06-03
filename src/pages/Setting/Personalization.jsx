import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

const getToken = () => Cookies.get("token");
const getRefreshToken = () => Cookies.get("refresh_token");

const setTokens = (accessToken, refreshToken) => {
  Cookies.set("token", accessToken);
  Cookies.set("refresh_token", refreshToken);
};

const refreshToken = async () => {
  const rToken = getRefreshToken();
  if (!rToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(
      "http://localhost:2356/auth/refresh",
      { refresh_token: rToken },
      {
        headers: {
          "x-api-key": "3f=Pr#g1@RU-nw=30",
          Authorization: `Bearer ${rToken}`,
        },
      }
    );

    const newAccessToken = response.data.data.access_token;
    const newRefreshToken = response.data.data.refresh_token;
    setTokens(newAccessToken, newRefreshToken);
    return newAccessToken;
  } catch (err) {
    console.error("❌ Refresh token error:", err);
    window.location.href = "/login";
    throw err;
  }
};

const Personalization = () => {
  const [data, setData] = useState({
    id: "",
    fullName: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fields = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Whatsapp", key: "whatsapp" },
    { label: "Password", key: "password" },
  ];

  // Fetch profile + handle refresh token
  const fetchProfile = async () => {
    let token = getToken();
    try {
      const res = await axios.get("http://localhost:2356/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      if (err.response?.status === 401) {
        token = await refreshToken();
        const retryRes = await axios.get("http://localhost:2356/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return retryRes.data.data;
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        const profile = await fetchProfile();
        setData({
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          whatsapp: profile.whatsapp,
          password: "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  const handleEdit = (fieldKey, value) => {
    setData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSave = async () => {
    let token = getToken();
    try {
      const res = await axios.put(
        `http://localhost:2356/auth/profile/update?id=${data.id}`,
        {
          full_name: data.fullName,
          email: data.email,
          whatsapp: data.whatsapp,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) alert("Profile updated successfully");
    } catch (err) {
      if (err.response?.status === 401) {
        token = await refreshToken();
        try {
          const res = await axios.put(
            `http://localhost:2356/auth/profile/update?id=${data.id}`,
            {
              full_name: data.fullName,
              email: data.email,
              whatsapp: data.whatsapp,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.status) alert("Profile updated successfully");
        } catch (e) {
          console.error(e);
          alert("Failed to update profile");
        }
      } else {
        console.error(err);
        alert("Failed to update profile");
      }
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h5 style={{ marginBottom: "20px" }}>Personalization</h5>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {fields.map((field) => (
          <div key={field.key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "120px", fontWeight: "400", fontSize: "13px" }}>
              {field.label}:
            </span>

            {editingField === field.key ? (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  handleEdit(field.key, e.currentTarget.textContent);
                  setEditingField(null);
                }}
                style={{
                  flex: 1,
                  padding: "4px 6px",
                  borderBottom: "1px dashed #000",
                  outline: "none",
                  minHeight: "20px",
                  cursor: "text",
                }}
              >
                {data[field.key]}
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  padding: "4px 6px",
                  minHeight: "20px",
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  paddingRight: "8px",
                }}
              >
                <span>{data[field.key] || <i style={{ color: "#999" }}>Click to edit</i>}</span>
                <FaPencilAlt
                  style={{ cursor: "pointer", fontSize: "12px", color: "#555" }}
                  onClick={() => setEditingField(field.key)}
                />
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleSave}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Personalization;
