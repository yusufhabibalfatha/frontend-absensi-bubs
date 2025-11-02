// components/DashboardSiswa.jsx (Enhanced)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardSiswa = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!user) {
    return (
      <div className="card">
        <div className="loading-text loading-pulse">🔄 Loading...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="navigation-controls">
        <button onClick={handleBackToHome} className="nav-button btn-back">
          ← Beranda
        </button>

        <h1 className="absensi-header">🧑‍🎓 Dashboard Siswa</h1>

        <button
          onClick={handleLogout}
          className="nav-button"
          style={{ background: "#ef4444", color: "white" }}
        >
          🚪 Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="info-card">
        <div className="info-item">
          <div className="info-icon">👤</div>
          <div className="info-content">
            <div className="info-label">Nama Siswa</div>
            <div className="info-value">{user.nama_lengkap}</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">🏫</div>
          <div className="info-content">
            <div className="info-label">Kelas</div>
            <div className="info-value">{user.kelas || "-"}</div>
          </div>
        </div>
        <div className="info-item teacher-info">
          <div className="info-icon">🎯</div>
          <div className="info-content">
            <div className="info-label">Status</div>
            <div className="info-value">Siswa Aktif</div>
          </div>
          <span className="status-badge status-active">SISWA</span>
        </div>
      </div>

      <button
        className="kegiatan-card"
        onClick={() => navigate("/presensi-siswa")}
      >
        <div className="kegiatan-icon">📊</div>
        <div className="kegiatan-content">
          <h3>Lihat Presensi</h3>
          <p>History kehadiran sekolah & kegiatan</p>
        </div>
        <div className="kegiatan-arrow">→</div>
      </button>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.5rem",
          margin: "2rem 0",
        }}
      >
        <div
          style={{
            background: "#d1fae5",
            border: "2px solid #10b981",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#065f46" }}
          >
            85%
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#065f46" }}
          >
            ✅ Presensi
          </div>
        </div>
        <div
          style={{
            background: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#92400e" }}
          >
            0
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#92400e" }}
          >
            📝 Tugas
          </div>
        </div>
        <div
          style={{
            background: "#f0f9ff",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e40af" }}
          >
            3
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#1e40af" }}
          >
            📢 Pengumuman
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div
        style={{
          background: "#fef3c7",
          border: "2px solid #f59e0b",
          borderRadius: "12px",
          padding: "1.5rem",
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#92400e", marginBottom: "1rem" }}>
          ⏳ Fitur Segera Hadir
        </h3>
        <p style={{ color: "#92400e", margin: 0, fontSize: "0.9rem" }}>
          Dashboard siswa sedang dalam pengembangan. Fitur seperti pengumuman,
          tugas, dan presensi akan segera tersedia.
        </p>
      </div>
    </div>
  );
};

export default DashboardSiswa;
