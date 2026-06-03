import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./BlogDetail.css";
import Navbar from "../../../components/navbar/Navbar";
import BlogSidebar from "./BlogSidebar";
import text from "../../../locales/text";

const API_URL = "http://localhost:1236/web/news";

export default function BlogDetail() {
  const { slug } = useParams();
  const location = useLocation();
  
  const isEnglish = location.pathname.startsWith("/en");
  const langPrefix = isEnglish ? "/en" : "";
  const t = text[isEnglish ? "en" : "id"];

  /* =======================
     REFS (Navbar)
  ======================= */
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const priceRef = useRef(null);

  /* =======================
     BLOG STATE
  ======================= */
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     COMMENT FORM STATE
  ======================= */
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     FETCH BLOG DETAIL
  ======================= */
  useEffect(() => {
    fetch(`${API_URL}/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.status) setBlog(res.data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!commentForm.name || !commentForm.email || !commentForm.comment) {
    alert(isEnglish ? "Please fill all fields" : "Semua kolom wajib diisi");
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(`${API_URL}/${slug}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentForm),
    });

    if (!res.ok) throw new Error("Failed");

    // 🔥 COMMENT BARU (optimistic UI)
    const newComment = {
      Name: commentForm.name,
      Comment: commentForm.comment,
      Email: commentForm.email,
      CreatedAt: new Date().toISOString(),
    };

    setBlog((prev) => ({
      ...prev,
      Comments: [newComment, ...(prev.Comments || [])],
    }));

    setCommentForm({
      name: "",
      email: "",
      comment: "",
    });
  } catch (err) {
    alert(isEnglish ? "Failed to send comment" : "Gagal mengirim komentar");
  } finally {
    setSubmitting(false);
  }
};


  /* =======================
     UI STATES
  ======================= */
  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!blog) return <p style={{ padding: 40 }}>Blog tidak ditemukan</p>;

  return (
    <>
      <Navbar
        heroRef={heroRef}
        featuresRef={featuresRef}
        aboutRef={aboutRef}
        priceRef={priceRef}
        t={t}
      />

      <div className="blog-detail-layout">
        {/* CONTENT */}
        <article className="blog-detail">
          {blog.tag && <span className="blog-tag">{blog.tag}</span>}
          <h1 className="blog-title">{blog.title}</h1>

          <div className="blog-meta">
            <span>
              {new Date(blog.created_at || Date.now()).toLocaleDateString(
                isEnglish ? "en-US" : "id-ID",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </span>
            {blog.created_by && <span> • {blog.created_by}</span>}
          </div>

          <img
            src={
              blog.file_path
                ? `http://localhost:1236/web/${blog.file_path}`
                : "https://via.placeholder.com/800x400"
            }
            alt={blog.title}
            className="blog-detail-img"
          />

          <div className="blog-body">
            {blog.body}
          </div>

          {/* =======================
              COMMENTS LIST
          ======================= */}
          {blog.Comments?.length > 0 && (
            <div className="blog-comments">
              <h3>{t.comment}</h3>

              {blog.Comments.map((c) => (
                <div key={c.ID} className="comment-item">
                  <div className="comment-header">
                    <strong>{c.Name}</strong>
                    <span>
                      {new Date(c.CreatedAt).toLocaleDateString(
                        isEnglish ? "en-US" : "id-ID"
                      )}
                    </span>
                  </div>
                  <p>{c.Comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* =======================
              COMMENT FORM
          ======================= */}
          <div className="blog-comment-form">
            <h3>{t.leaveComment}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder={t.name}
                value={commentForm.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder={t.email}
                value={commentForm.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="comment"
                placeholder={t.commentPlaceholder}
                value={commentForm.comment}
                onChange={handleChange}
                rows="4"
                required
              />

              <button type="submit" disabled={submitting}>
                {submitting ? t.sending : t.send}
              </button>
            </form>
          </div>
        </article>

        {/* SIDEBAR */}
        <BlogSidebar />
      </div>
    </>
  );
}
