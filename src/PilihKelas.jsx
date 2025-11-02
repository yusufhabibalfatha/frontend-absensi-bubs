// PilihKelas.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/styles.css";

const PilihKelas = () => {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const kegiatan = location.state?.kegiatan;

  useEffect(() => {
    if (!kegiatan) {
      navigate("/kegiatan");
      return;
    }
    fetchKelasBoarding();
  }, [kegiatan, navigate]);

  const fetchKelasBoarding = async () => {
    try {
      setLoading(true);

      let url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/kelas-boarding`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Gagal mengambil data kelas");
      }

      const result = await response.json();

      if (result.success) {
        setKelas(result.data);
      } else {
        throw new Error("Data kelas tidak ditemukan");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePilihKelas = (kelasItem) => {
    navigate("/kegiatan/absen", {
      state: {
        kegiatan: kegiatan,
        kelas: kelasItem,
        tipe: "SEKOLAH",
      },
    });
  };

  if (!kegiatan) {
    return (
      <div className="card">
        <div className="error-message">❌ Data kegiatan tidak ditemukan</div>
        <button
          onClick={() => navigate("/kegiatan")}
          className="nav-button btn-back"
          style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}
        >
          ← Kembali ke Pilih Kegiatan
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading-text loading-pulse">
          🔄 Memuat data kelas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message">
          ❌ {error}
          <button
            onClick={fetchKelasBoarding}
            className="retry-button"
            style={{ marginLeft: "1rem" }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <button
          onClick={() => navigate("/kegiatan")}
          className="nav-button btn-back"
          style={{ marginRight: "1rem" }}
        >
          ←
        </button>
        <h1>🏫 Pilih Kelas</h1>
      </div>

      <div className="info-card" style={{ marginBottom: "2rem" }}>
        <div className="info-item">
          <div className="info-icon">📅</div>
          <div className="info-content">
            <div className="info-label">Kegiatan</div>
            <div className="info-value">{kegiatan.nama_kegiatan}</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">⏰</div>
          <div className="info-content">
            <div className="info-label">Waktu</div>
            <div className="info-value">{kegiatan.waktu_pelaksanaan}</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">👥</div>
          <div className="info-content">
            <div className="info-label">Peserta</div>
            <div className="info-value">Siswa Boarding</div>
          </div>
        </div>
      </div>

      <h2
        style={{ color: "#000", marginBottom: "1.5rem", textAlign: "center" }}
      >
        Pilih Kelas untuk Absensi
      </h2>

      {kelas.length === 0 ? (
        <div className="empty-state">
          <p>📭 Tidak ada data kelas boarding ditemukan</p>
          <button onClick={fetchKelasBoarding} className="retry-button">
            Muat Ulang
          </button>
        </div>
      ) : (
        <div className="kelas-grid">
          {kelas.map((kelasItem) => (
            <button
              key={kelasItem.id}
              onClick={() => handlePilihKelas(kelasItem)}
              className="kelas-card"
            >
              <div className="kelas-icon">🏫</div>
              <div className="kelas-content">
                <h3>{kelasItem.nama_kelas}</h3>
                <p>Kelas {kelasItem.nama_kelas}</p>
              </div>
              <div className="kelas-arrow">→</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PilihKelas;
