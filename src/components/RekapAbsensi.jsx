import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../style/RekapAbsensi.css";

const API_URL = import.meta.env.VITE_NEW_API_URL_REKAP;
// Ganti dengan URL API Anda

function RekapAbsensi() {
  const [kelas, setKelas] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [guru, setGuru] = useState([]);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");

  const [idKelas, setIdKelas] = useState("");
  const [idMataPelajaran, setIdMataPelajaran] = useState("");
  const [idGuru, setIdGuru] = useState("");

  const [rekap, setRekap] = useState([]);
  const [detail, setDetail] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sudahCari, setSudahCari] = useState(false);

  const navigate = useNavigate();

  // =========================
  // LOAD FILTER
  // =========================

  useEffect(() => {
    fetchKelas();
    fetchMataPelajaran();
    fetchGuru();

    // Default tanggal = hari ini
    const today = new Date().toISOString().split("T")[0];

    setTanggalMulai(today);
    setTanggalSelesai(today);
  }, []);

  const fetchKelas = async () => {
    try {
      const response = await fetch(`${API_URL}/kelas_sekolah.php`);

      const data = await response.json();

      if (data.status !== false) {
        setKelas(data.data || data);
      }
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
    }
  };

  const fetchMataPelajaran = async () => {
    try {
      const response = await fetch(`${API_URL}/mata_pelajaran.php`);

      const data = await response.json();

      if (data.status !== false) {
        setMataPelajaran(data.data || data);
      }
    } catch (error) {
      console.error("Gagal mengambil data mata pelajaran:", error);
    }
  };

  const fetchGuru = async () => {
    try {
      const response = await fetch(`${API_URL}/guru_sekolah.php`);

      const data = await response.json();

      if (data.status !== false) {
        setGuru(data.data || data);
      }
    } catch (error) {
      console.error("Gagal mengambil data guru:", error);
    }
  };

  // =========================
  // CARI REKAP
  // =========================

  const handleCari = async () => {
    setError("");

    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal mulai dan tanggal selesai wajib diisi.");
      return;
    }

    if (tanggalMulai > tanggalSelesai) {
      setError("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
      return;
    }

    setLoading(true);
    setSudahCari(false);

    try {
      const params = new URLSearchParams();

      params.append("tanggal_mulai", tanggalMulai);
      params.append("tanggal_selesai", tanggalSelesai);

      if (idKelas) {
        params.append("id_kelas", idKelas);
      }

      if (idMataPelajaran) {
        params.append("id_mata_pelajaran", idMataPelajaran);
      }

      if (idGuru) {
        params.append("id_guru_sekolah", idGuru);
      }

      const response = await fetch(
        `${API_URL}/rekap_absensi.php?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "Gagal mengambil data.");
      }

      setRekap(data.rekap || []);
      setDetail(data.detail || []);
      setSudahCari(true);
    } catch (error) {
      console.error(error);

      setError(error.message || "Terjadi kesalahan saat mengambil data.");

      setRekap([]);
      setDetail([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT TANGGAL
  // =========================

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    const [tahun, bulan, hari] = tanggal.split("-");

    return `${hari}-${bulan}-${tahun}`;
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="rekap-absensi">
      <div className="rekap-header">
        <div className="flex flex-col">
          <h1>Rekap Absensi</h1>

          <center>
            Lihat rekap kehadiran siswa berdasarkan periode dan filter yang
            dipilih.
          </center>

          <button
            onClick={() => navigate("/")}
            className="btn-back-home bg-red-300 w-fit self-center"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>

      {/* =========================
                FILTER
            ========================= */}

      <div className="rekap-filter">
        <div className="filter-item">
          <label>Tanggal Mulai</label>

          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>Tanggal Selesai</label>

          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>Kelas</label>

          <select value={idKelas} onChange={(e) => setIdKelas(e.target.value)}>
            <option value="">Semua Kelas</option>

            {kelas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Mata Pelajaran</label>

          <select
            value={idMataPelajaran}
            onChange={(e) => setIdMataPelajaran(e.target.value)}
          >
            <option value="">Semua Mata Pelajaran</option>

            {mataPelajaran.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Guru</label>

          <select value={idGuru} onChange={(e) => setIdGuru(e.target.value)}>
            <option value="">Semua Guru</option>

            {guru.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-action">
          <button onClick={handleCari} disabled={loading}>
            {loading ? "Memuat..." : "Tampilkan Rekap"}
          </button>
        </div>
      </div>

      {/* =========================
                ERROR
            ========================= */}

      {error && <div className="rekap-error">{error}</div>}

      {/* =========================
                HASIL
            ========================= */}

      {sudahCari && (
        <>
          <div className="rekap-info">
            <div>
              <strong>Periode</strong>

              <span>
                {formatTanggal(tanggalMulai)}
                {" - "}
                {formatTanggal(tanggalSelesai)}
              </span>
            </div>

            <div>
              <strong>Jumlah Siswa</strong>

              <span>{rekap.length}</span>
            </div>

            <div>
              <strong>Jumlah Data</strong>

              <span>{detail.length}</span>
            </div>
          </div>

          {/* =========================
                        TABEL REKAP
                    ========================= */}

          <div className="rekap-section">
            <div className="section-header">
              <h2>Rekap Per Siswa</h2>
            </div>

            {rekap.length === 0 ? (
              <div className="empty-data">Tidak ada data absensi.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>NIK</th>
                      <th>Nama</th>
                      <th>Kelas</th>
                      <th>Hadir</th>
                      <th>Terlambat</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                      <th>Alpa</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rekap.map((item, index) => (
                      <tr key={item.id_siswa}>
                        <td>{index + 1}</td>

                        <td>{item.nik}</td>

                        <td>{item.nama_siswa}</td>

                        <td>{item.nama_kelas || "-"}</td>

                        <td>{item.hadir}</td>

                        <td>{item.terlambat}</td>

                        <td>{item.izin}</td>

                        <td>{item.sakit}</td>

                        <td>{item.alpa}</td>

                        <td>
                          <strong>{item.total}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* =========================
                        DETAIL
                    ========================= */}

          <div className="rekap-section">
            <div className="section-header">
              <h2>Detail Absensi</h2>
            </div>

            {detail.length === 0 ? (
              <div className="empty-data">Tidak ada data absensi.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Kelas</th>
                      <th>Mapel</th>
                      <th>Guru</th>
                      <th>NIK</th>
                      <th>Nama</th>
                      <th>Status</th>
                      <th>Keterangan</th>
                      <th>Materi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detail.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>{formatTanggal(item.tanggal)}</td>

                        <td>{item.nama_kelas || "-"}</td>

                        <td>{item.nama_mata_pelajaran || "-"}</td>

                        <td>{item.nama_guru || "-"}</td>

                        <td>{item.nik}</td>

                        <td>{item.nama_siswa}</td>

                        <td>{item.status}</td>

                        <td>{item.keterangan || "-"}</td>

                        <td>{item.materi || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RekapAbsensi;
