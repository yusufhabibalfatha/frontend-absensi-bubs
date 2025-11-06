// components/RekapPresensiGuru.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Presensi.css";

const RekapPresensiGuru = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMapel, setSelectedMapel] = useState("");
  const [mapelList, setMapelList] = useState([]);

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
    fetchKelasGuru();
  }, [navigate]);

  useEffect(() => {
    if (selectedKelas) {
      fetchRekapData();
    }
  }, [selectedKelas, selectedMonth, selectedYear, selectedMapel]);

  const fetchKelasGuru = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));

      let url = `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/kelas-guru`;

      const response = await fetch(url, {
        headers: {
          "X-User-Data": JSON.stringify(userData),
        },
      });

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setKelasList(result.data);
        setSelectedKelas(result.data[0].id);
      } else {
        setError("Tidak ada kelas yang diajar");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRekapData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));

      let url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/rekap-presensi-kelas-detailed?kelas=${selectedKelas}&bulan=${selectedMonth}&tahun=${selectedYear}`;

      // let url = `https://apibubs.sdit.web.id/wp-json/absensi-bubs/v1/rekap-presensi-kelas-detailed?kelas=${selectedKelas}&bulan=${selectedMonth}&tahun=${selectedYear}`;

      if (selectedMapel) {
        url += `&mapel=${encodeURIComponent(selectedMapel)}`;
      }

      const response = await fetch(url, {
        headers: {
          "X-User-Data": JSON.stringify(userData),
        },
      });

      const result = await response.json();

      console.log("resuyylt ", result);

      if (result.success) {
        setData(result.data);
        setMapelList(result.filters?.mapel_list || []);
      } else {
        setError(result.message || "Gagal mengambil data rekap");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));

      let url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/export-rekap-excel?kelas=${selectedKelas}&bulan=${selectedMonth}&tahun=${selectedYear}`;

      // let url = `https://apibubs.sdit.web.id/wp-json/absensi-bubs/v1/export-rekap-excel?kelas=${selectedKelas}&bulan=${selectedMonth}&tahun=${selectedYear}`;

      if (selectedMapel) {
        url += `&mapel=${encodeURIComponent(selectedMapel)}`;
      }

      const response = await fetch(url, {
        headers: {
          "X-User-Data": JSON.stringify(userData),
        },
      });

      const result = await response.json();

      if (result.success) {
        // Download file
        window.open(result.file_url, "_blank");
      } else {
        alert(result.message || "Gagal export data");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat export");
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Simple PDF export using window.print() for MVP
    window.print();
  };

  const getPresentaseColor = (presentase) => {
    if (presentase >= 90) return "#10b981";
    if (presentase >= 80) return "#f59e0b";
    if (presentase >= 70) return "#f97316";
    return "#ef4444";
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
          onClick={() => navigate("/classroom/guru")}
          className="nav-button btn-back"
        >
          ← Dashboard
        </button>

        <h1 className="absensi-header">📊 Rekap Presensi Kelas</h1>

        <div style={{ width: "100px" }}></div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Kelas:</label>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            disabled={loading || kelasList.length === 0}
          >
            {kelasList.map((kelas) => (
              <option key={kelas.id} value={kelas.id}>
                {kelas.nama_kelas}
              </option>
            ))}
          </select>
        </div>

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

        <div className="filter-group">
          <label>Mata Pelajaran:</label>
          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            disabled={loading}
          >
            <option value="">Semua Mapel</option>
            {mapelList.map((mapel, index) => (
              <option key={index} value={mapel}>
                {mapel}
              </option>
            ))}
          </select>
        </div>

        <div
          className="filter-group"
          style={{ flexDirection: "row", alignItems: "end", gap: "0.5rem" }}
        >
          <button
            onClick={fetchRekapData}
            disabled={loading}
            className="refresh-button"
          >
            {loading ? "🔄" : "↻"}
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exportLoading || data.length === 0}
            className="export-button"
            style={{ background: "#059669" }}
          >
            {exportLoading ? "🔄" : "📊"} Excel
          </button>

          <button
            onClick={handleExportPDF}
            disabled={data.length === 0}
            className="export-button"
            style={{ background: "#dc2626" }}
          >
            📄 PDF
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">❌ {error}</div>}

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="statistics-grid">
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#10b981" }}>
              {data.reduce((sum, row) => sum + row.hadir, 0)}
            </div>
            <div className="stat-label">Total Hadir</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#f59e0b" }}>
              {data.reduce((sum, row) => sum + row.izin, 0)}
            </div>
            <div className="stat-label">Total Izin</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#ef4444" }}>
              {data.reduce((sum, row) => sum + row.sakit, 0)}
            </div>
            <div className="stat-label">Total Sakit</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: "#6b7280" }}>
              {data.reduce((sum, row) => sum + row.alpa, 0)}
            </div>
            <div className="stat-label">Total Alpa</div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="loading-text loading-pulse">
          🔄 Memuat data rekap...
        </div>
      ) : data.length > 0 ? (
        <div className="rekap-table-container">
          <table className="rekap-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIS</th>
                <th>Nama Siswa</th>
                <th>Hadir</th>
                <th>Izin</th>
                <th>Sakit</th>
                <th>Alpa</th>
                <th>Total</th>
                <th>Presentase</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id_siswa}>
                  <td>{index + 1}</td>
                  <td>{row.nik}</td>
                  <td className="nama-siswa">{row.nama_lengkap}</td>
                  <td className="number-cell">{row.hadir}</td>
                  <td className="number-cell">{row.izin}</td>
                  <td className="number-cell">{row.sakit}</td>
                  <td className="number-cell">{row.alpa}</td>
                  <td className="number-cell">{row.total_pertemuan}</td>
                  <td
                    className="presentase-cell"
                    style={{ color: getPresentaseColor(row.presentase) }}
                  >
                    {row.presentase}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="empty-state">
            <p>📭 Tidak ada data presensi untuk filter yang dipilih</p>
            <button onClick={fetchRekapData} className="retry-button">
              Muat Ulang
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default RekapPresensiGuru;
