// components/PresensiSiswa.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Presensi.css";

const PresensiSiswa = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("sekolah"); // 'sekolah' or 'kegiatan'
  const navigate = useNavigate();

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchPresensiData();
  }, [selectedMonth, selectedYear, navigate]);

  const fetchPresensiData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));

      let url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/presensi-siswa?bulan=${selectedMonth}&tahun=${selectedYear}`;

      const response = await fetch(url, {
        headers: {
          "X-User-Data": JSON.stringify(userData),
        },
      });

      const result = await response.json();

      console.log("log ", result);

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Gagal mengambil data presensi");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hadir":
        return "#10b981";
      case "Izin":
        return "#f59e0b";
      case "Sakit":
        return "#ef4444";
      case "Alpa":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Hadir":
        return "✅";
      case "Izin":
        return "📋";
      case "Sakit":
        return "🤒";
      case "Alpa":
        return "❌";
      default:
        return "❓";
    }
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
        <button
          onClick={() => navigate("/classroom/siswa")}
          className="nav-button btn-back"
        >
          ← Dashboard
        </button>

        <h1 className="absensi-header">📊 Presensi Saya</h1>

        <div style={{ width: "100px" }}></div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Bulan:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            disabled={loading}
          >
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Tahun:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            disabled={loading}
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchPresensiData}
          disabled={loading}
          className="refresh-button"
        >
          {loading ? "🔄" : "↻"}
        </button>
      </div>

      {/* Statistics */}
      {data?.statistik && (
        <div className="statistics-grid">
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#10b981" }}>
              {data.statistik.sekolah.find((s) => s.status === "Hadir")
                ?.jumlah || 0}
            </div>
            <div className="stat-label">Hadir</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#f59e0b" }}>
              {data.statistik.sekolah.find((s) => s.status === "Izin")
                ?.jumlah || 0}
            </div>
            <div className="stat-label">Izin</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#ef4444" }}>
              {data.statistik.sekolah.find((s) => s.status === "Sakit")
                ?.jumlah || 0}
            </div>
            <div className="stat-label">Sakit</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#6b7280" }}>
              {data.statistik.sekolah.find((s) => s.status === "Alpa")
                ?.jumlah || 0}
            </div>
            <div className="stat-label">Alpa</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "sekolah" ? "active" : ""}`}
          onClick={() => setActiveTab("sekolah")}
        >
          🏫 Sekolah
        </button>
        <button
          className={`tab-button ${activeTab === "kegiatan" ? "active" : ""}`}
          onClick={() => setActiveTab("kegiatan")}
        >
          📋 Kegiatan
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-text loading-pulse">
          🔄 Memuat data presensi...
        </div>
      ) : error ? (
        <div className="error-message">❌ {error}</div>
      ) : (
        <div className="presensi-content">
          {activeTab === "sekolah" && (
            <PresensiList
              data={data?.presensi_sekolah || []}
              type="sekolah"
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}

          {activeTab === "kegiatan" && (
            <PresensiList
              data={data?.presensi_kegiatan || []}
              type="kegiatan"
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (
        <div className="empty-state">
          <p>📭 Tidak ada data presensi untuk periode ini</p>
          <button onClick={fetchPresensiData} className="retry-button">
            Muat Ulang
          </button>
        </div>
      )}
    </div>
  );
};

// Sub-component untuk list presensi
const PresensiList = ({ data, type, getStatusColor, getStatusIcon }) => {
  if (data.length === 0) {
    return (
      <div className="empty-list">
        <p>Tidak ada data presensi {type}</p>
      </div>
    );
  }

  return (
    <div className="presensi-list">
      {data.map((item, index) => (
        <div key={index} className="presensi-item">
          <div className="presensi-header">
            <div className="presensi-date">
              {new Date(item.tanggal).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div
              className="presensi-status"
              style={{
                background: getStatusColor(item.status),
                color: "white",
              }}
            >
              {getStatusIcon(item.status)} {item.status}
            </div>
          </div>

          <div className="presensi-details">
            {type === "sekolah" ? (
              <>
                <div className="detail-item">
                  <strong>Mata Pelajaran:</strong> {item.mata_pelajaran}
                </div>
                <div className="detail-item">
                  <strong>Guru:</strong> {item.nama_guru}
                </div>
                <div className="detail-item">
                  <strong>Kelas:</strong> {item.nama_kelas}
                </div>
              </>
            ) : (
              <>
                <div className="detail-item">
                  <strong>Kegiatan:</strong> {item.nama_kegiatan}
                </div>
                <div className="detail-item">
                  <strong>Kategori:</strong> {item.kategori}
                </div>
                {item.nama_kelas && (
                  <div className="detail-item">
                    <strong>Kelas:</strong> {item.nama_kelas}
                  </div>
                )}
                {item.nama_kamar && (
                  <div className="detail-item">
                    <strong>Kamar:</strong> {item.nama_kamar}
                  </div>
                )}
              </>
            )}

            {item.keterangan && (
              <div className="detail-item">
                <strong>Keterangan:</strong> {item.keterangan}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PresensiSiswa;
