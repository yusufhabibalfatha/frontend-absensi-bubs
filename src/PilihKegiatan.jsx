import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleBackToHome } from "./utility/pilihMapelUtils";
import "./style/styles.css";

const PilihKegiatan = () => {
  const [kegiatan, setKegiatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJenisKegiatan();
  }, []);

  const fetchJenisKegiatan = async () => {
    try {
      setLoading(true);

      const url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/jenis-kegiatan`;

      const response = await axios.get(url);

      const result = response.data;

      if (result.success) {
        setKegiatan(result.data);
      } else {
        throw new Error("Data kegiatan tidak ditemukan");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePilihKegiatan = (kegiatanItem) => {
    if (kegiatanItem.kategori === "SEKOLAH") {
      navigate("/kegiatan/kelas", { state: { kegiatan: kegiatanItem } });
    } else if (kegiatanItem.kategori === "PONDOK") {
      navigate("/kegiatan/kamar", { state: { kegiatan: kegiatanItem } });
    }
  };

  const kegiatanSekolah = kegiatan.filter(
    (item) => item.kategori === "SEKOLAH"
  );
  const kegiatanPondok = kegiatan.filter((item) => item.kategori === "PONDOK");

  if (loading) {
    return (
      <div className="card">
        <div className="loading-text loading-pulse">
          🔄 Memuat data kegiatan...
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
            onClick={fetchJenisKegiatan}
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
      <button
        onClick={() => handleBackToHome(navigate)}
        className="btn-back-home"
      >
        ← Kembali ke Beranda
      </button>
      <h1>📋 Pilih Jenis Kegiatan</h1>
      <p>Silakan pilih jenis kegiatan yang ingin dilakukan absensi:</p>

      {/* Kegiatan Sekolah */}
      <div className="kegiatan-section">
        <h2
          style={{
            color: "#1e40af",
            marginBottom: "1rem",
            borderBottom: "3px solid #1e40af",
            paddingBottom: "0.5rem",
          }}
        >
          🏫 KEGIATAN SEKOLAH
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Untuk siswa BOARDING saja - berdasarkan kelas
        </p>

        <div className="kegiatan-grid">
          {kegiatanSekolah.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePilihKegiatan(item)}
              className="kegiatan-card"
            >
              <div className="kegiatan-icon">📅</div>
              <div className="kegiatan-content">
                <h3>{item.nama_kegiatan}</h3>
                <p>{item.deskripsi}</p>
                <small>Waktu: {item.waktu_pelaksanaan}</small>
              </div>
              <div className="kegiatan-arrow">→</div>
            </button>
          ))}
        </div>
      </div>

      {/* Kegiatan Pondok */}
      <div className="kegiatan-section" style={{ marginTop: "2rem" }}>
        <h2
          style={{
            color: "#059669",
            marginBottom: "1rem",
            borderBottom: "3px solid #059669",
            paddingBottom: "0.5rem",
          }}
        >
          🏠 KEGIATAN PONDOK
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Untuk siswa BOARDING & REGULER - berdasarkan kamar
        </p>

        <div className="kegiatan-grid">
          {kegiatanPondok.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePilihKegiatan(item)}
              className="kegiatan-card"
            >
              <div className="kegiatan-icon">🌙</div>
              <div className="kegiatan-content">
                <h3>{item.nama_kegiatan}</h3>
                <p>{item.deskripsi}</p>
                <small>Waktu: {item.waktu_pelaksanaan}</small>
              </div>
              <div className="kegiatan-arrow">→</div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "2px dashed #d1d5db",
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="nav-button btn-back"
          style={{ width: "100%", justifyContent: "center" }}
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default PilihKegiatan;
