import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 bahasa ditentukan dari URL
  const isEnglish = location.pathname.startsWith("/en");
  const langPrefix = isEnglish ? "/en" : "";

  return (
    <footer className="footer">
      <div className="footer-top">
        <span>
          © {new Date().getFullYear()} POSTTEST .io
        </span>
      </div>

      <button
        onClick={() => navigate(`${langPrefix}/privacy`)}
        className="privacy-link"
      >
        Privacy Policy
      </button>

      <div className="footer-social">
        <a
          href="https://instagram.com/posttest.io"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
          aria-label="Instagram PostTest"
        >
          <FaInstagram size={26} />
        </a>

        <a
          href="https://www.facebook.com/share/1AqYgAzggh/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
          aria-label="Facebook PostTest"
        >
          <FaFacebook size={26} />
        </a>

        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
          aria-label="YouTube Kirim"
        >
          <FaYoutube size={26} />
        </a>

        <a
          href="https://www.linkedin.com/company/posttest-link"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
          aria-label="LinkedIn PostTest"
        >
          <FaLinkedin size={26} />
        </a>
      </div>
    </footer>
  );
}
