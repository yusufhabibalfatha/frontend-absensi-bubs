import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/styles.css";

const PilihKamar = () => {
  const [kamar, setKamar] = useState([]);
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
    fetchKamar();
  }, [kegiatan, navigate]);

  const fetchKamar = async () => {
    try {
      setLoading(true);

      const url = `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/kamar`;

      const response = await axios.get(url);
      const result = response.data;

      if (result.success) {
        setKamar(result.data);
      } else {
        throw new Error("Data kamar tidak ditemukan");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePilihKamar = (kamarItem) => {
    navigate("/kegiatan/absen", {
      state: {
        kegiatan: kegiatan,
        kamar: kamarItem,
        tipe: "PONDOK",
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
          🔄 Memuat data kamar...
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
            onClick={fetchKamar}
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
        <h1>🏠 Pilih Kamar</h1>
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
            <div className="info-value">Siswa Boarding & Reguler</div>
          </div>
        </div>
      </div>

      <h2
        style={{ color: "#000", marginBottom: "1.5rem", textAlign: "center" }}
      >
        Pilih Kamar untuk Absensi
      </h2>

      {kamar.length === 0 ? (
        <div className="empty-state">
          <p>📭 Tidak ada data kamar ditemukan</p>
          <button onClick={fetchKamar} className="retry-button">
            Muat Ulang
          </button>
        </div>
      ) : (
        <div className="kamar-grid">
          {kamar.map((kamarItem) => (
            <button
              key={kamarItem.id}
              onClick={() => handlePilihKamar(kamarItem)}
              className="kamar-card"
            >
              <div className="kamar-icon">🚪</div>
              <div className="kamar-content">
                <h3>Kamar {kamarItem.nama_kamar}</h3>
                <p>
                  Jenis: {kamarItem.jenis_kelamin === "L" ? "Putra" : "Putri"}
                </p>
                <p>Kapasitas: {kamarItem.kapasitas} orang</p>
              </div>
              <div className="kamar-arrow">→</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PilihKamar;
