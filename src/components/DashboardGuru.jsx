// components/DashboardGuru.jsx (Enhanced)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardGuru = () => {
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

        <h1 className="absensi-header">🧑‍🏫 Dashboard Guru</h1>

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
        <div className="info-item teacher-info">
          <div className="info-icon">👤</div>
          <div className="info-content">
            <div className="info-label">Nama Guru</div>
            <div className="info-value">{user.nama_lengkap}</div>
          </div>
          <span className="status-badge status-active">GURU</span>
        </div>
      </div>
      {/* Quick Actions */}
      <div style={{ margin: "2rem 0" }}>
        <h2
          style={{ textAlign: "center", marginBottom: "1.5rem", color: "#000" }}
        >
          🚀 Menu Cepat
        </h2>

        <div className="kegiatan-grid">
          <button
            className="kegiatan-card"
            onClick={() => navigate("/rekap-presensi-guru")}
          >
            <div className="kegiatan-icon">📊</div>
            <div className="kegiatan-content">
              <h3>Rekap Presensi</h3>
              <p>Lihat rekap kehadiran siswa per kelas</p>
            </div>
            <div className="kegiatan-arrow">→</div>
          </button>
          {/* <button className="kegiatan-card" onClick={() => navigate("/pilih")}>
            <div className="kegiatan-icon">📚</div>
            <div className="kegiatan-content">
              <h3>Absensi Pelajaran</h3>
              <p>Absensi mata pelajaran harian</p>
            </div>
            <div className="kegiatan-arrow">→</div>
          </button>

          <button
            className="kegiatan-card"
            onClick={() => navigate("/kegiatan")}
          >
            <div className="kegiatan-icon">📋</div>
            <div className="kegiatan-content">
              <h3>Absensi Kegiatan</h3>
              <p>Absensi apel, upacara, pondok</p>
            </div>
            <div className="kegiatan-arrow">→</div>
          </button> */}

          <button
            className="kegiatan-card"
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            <div className="kegiatan-icon">📢</div>
            <div className="kegiatan-content">
              <h3>Buat Pengumuman</h3>
              <p>Fitur sedang dikembangkan</p>
            </div>
            <div className="kegiatan-arrow">⏳</div>
          </button>

          <button
            className="kegiatan-card"
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            <div className="kegiatan-icon">👥</div>
            <div className="kegiatan-content">
              <h3>Lihat Kelas</h3>
              <p>Fitur sedang dikembangkan</p>
            </div>
            <div className="kegiatan-arrow">⏳</div>
          </button>
        </div>
      </div>
      {/* Coming Soon Features */}
      <div
        style={{
          background: "#f0f9ff",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          padding: "1.5rem",
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#1e40af", marginBottom: "1rem" }}>
          🎯 Fitur Mendatang
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              background: "#dbeafe",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
            }}
          >
            📢 Pengumuman
          </span>
          <span
            style={{
              background: "#dbeafe",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
            }}
          >
            📝 Tugas
          </span>
          <span
            style={{
              background: "#dbeafe",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
            }}
          >
            📊 Laporan
          </span>
          <span
            style={{
              background: "#dbeafe",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
            }}
          >
            💬 Chat
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuru;
