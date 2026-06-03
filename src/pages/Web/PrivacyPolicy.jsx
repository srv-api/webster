import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <div className="privacy-card">
        <h1>Kebijakan Privasi</h1>
        <p className="intro">
          Aplikasi <strong>CashPay Point of Sale (POS)</strong> menghargai privasi pengguna.
          Halaman ini menjelaskan cara kami mengelola dan melindungi data Anda.
        </p>

        <h2>📋 Informasi yang Dikumpulkan</h2>
        <ul>
          <li>Nama bisnis</li>
          <li>Transaksi dan data penjualan</li>
          <li>Lokasi dan perangkat</li>
          <li>Informasi login</li>
        </ul>

        <h2>💡 Penggunaan Data</h2>
        <p>
          Data digunakan untuk meningkatkan layanan, menyusun laporan penjualan,
          serta menjaga keamanan sistem dan transaksi pengguna.
        </p>

        <h2>🔐 Hak Pengguna</h2>
        <p>
          Anda dapat mengakses, memperbarui, atau menghapus data pribadi Anda dengan
          menghubungi kami melalui email berikut:
        </p>
        <p>
          <a href="mailto:support@posttest.com" className="contact-link">
            support@posttest.com
          </a>
        </p>

        <p className="last-updated">Terakhir diperbarui: 28 Mei 2025</p>
      </div>
    </div>
  );
}
