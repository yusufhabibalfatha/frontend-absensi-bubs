// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Mengimpor useNavigate untuk navigasi

function NotFound() {
  const navigate = useNavigate(); // Inisialisasi navigate untuk mengarahkan pengguna

  // Fungsi untuk kembali ke halaman utama
  const handleGoHome = () => {
    navigate("/"); // Mengarahkan pengguna kembali ke halaman utama
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Halaman Tidak Ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
      <button
        onClick={handleGoHome}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        Kembali ke Halaman Utama
      </button>
    </div>
  );
}

export default NotFound;
