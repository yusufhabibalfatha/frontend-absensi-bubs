import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRScanner from "./components/QRScanner";
import "./style/AbsensiSiswa.css";

export default function AbsensiSiswa() {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState([]);
  const [guru, setGuru] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingKeterangan, setEditingKeterangan] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Scroll to top when component mounts or data loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setScanMessage(null);

    try {
      const params = {
        kelas: location.state.kelas,
        hari: location.state.hari,
        mapel: location.state.mapel,
      };

      const url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/jadwal-siswa`;

      const response = await axios.get(url, { params });

      console.log("response ", response);

      const result = response.data;

      if (response.status !== 200) {
        throw new Error(result.message);
      }

      setFormData(result.data);
      setGuru(result.kriteria.guru);

      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id_siswa, newStatus) => {
    const updatedData = formData.map((item) => {
      if (item.id_siswa === id_siswa) {
        return {
          ...item,
          status: newStatus,
          // Reset keterangan ketika status berubah, kecuali jika status sama
          keterangan: item.status === newStatus ? item.keterangan : null,
        };
      }
      return item;
    });
    setFormData(updatedData);
    setScanMessage(null);
  };

  // Batalkan status (set menjadi null)
  const handleCancelStatus = (id_siswa, nama_siswa) => {
    const updatedData = formData.map((item) => {
      if (item.id_siswa === id_siswa) {
        return { ...item, status: null, keterangan: null };
      }
      return item;
    });
    setFormData(updatedData);
    setScanMessage(`❌ Status ${nama_siswa} berhasil dibatalkan`);

    setTimeout(() => {
      setScanMessage(null);
    }, 3000);
  };

  // Handle QR Scan Result
  const handleQRScan = (nik) => {
    // Find student by NIK
    const student = formData.find((item) => item.nik === nik);

    if (student) {
      // Update status to "Hadir"
      const updatedData = formData.map((item) => {
        if (item.nik === nik) {
          return { ...item, status: "Hadir", keterangan: null };
        }
        return item;
      });

      setFormData(updatedData);
      setScanMessage(`✅ ${student.nama_lengkap} berhasil diabsensi!`);

      setTimeout(() => {
        setScanMessage(null);
      }, 3000);
    } else {
      setScanMessage("❌ Siswa tidak ditemukan dalam kelas ini");

      setTimeout(() => {
        setScanMessage(null);
      }, 3000);
    }
  };

  const handleScanError = (errorMessage) => {
    setScanMessage(errorMessage);

    setTimeout(() => {
      setScanMessage(null);
    }, 3000);
  };

  const openScanner = () => {
    setIsScannerOpen(true);
    setScanMessage(null);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  // Handle keterangan change
  const handleKeteranganChange = (id_siswa, keterangan) => {
    const updatedData = formData.map((item) => {
      if (item.id_siswa === id_siswa) {
        return { ...item, keterangan: keterangan || null };
      }
      return item;
    });
    setFormData(updatedData);
  };

  // Open keterangan editor
  const openKeteranganEditor = (id_siswa, status, currentKeterangan) => {
    setEditingKeterangan({
      id_siswa,
      status,
      keterangan: currentKeterangan || "",
    });
  };

  // Close keterangan editor
  const closeKeteranganEditor = () => {
    setEditingKeterangan(null);
  };

  // Save keterangan
  const saveKeterangan = () => {
    if (editingKeterangan) {
      handleKeteranganChange(
        editingKeterangan.id_siswa,
        editingKeterangan.keterangan
      );
      setEditingKeterangan(null);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitLoading(true);
  //   setError(null);
  //   setSuccessMessage(null);
  //   setScanMessage(null);

  //   try {
  //     const url = `${
  //       import.meta.env.VITE_API_URL
  //     }/absensi-bubs/insert/absensi-sekolah`;

  //     const response = await axios.post(url, formData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const result = response.data;

  //     if (result.success) {
  //       setSuccessMessage("Absensi berhasil disimpan!");
  //     } else {
  //       throw new Error(result.message || "Gagal menyimpan absensi");
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message);
  //   } finally {
  //     setSubmitLoading(false);
  //   }

  //   handleShare();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/insert/absensi-sekolah`;
      const response = await axios.post(url, formData);

      if (response.data.success) {
        setSuccessMessage("Absensi berhasil disimpan!");

        // 🔥 generate & tampilkan modal
        const message = generateWhatsappMessage();
        setWhatsappMessage(message);
        setIsShareModalOpen(true);
      } else {
        throw new Error("asdsad", response.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const sendToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(url, "_blank"); // aman Safari
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      alert("✅ Teks berhasil disalin");
    } catch {
      alert("❌ Gagal menyalin teks");
    }
  };

  // const handleShare = () => {
  //   const dataTambahan = {
  //     guruMapel: guru,
  //     kelas: location.state.kelas,
  //     hari: location.state.hari,
  //     mapel: location.state.mapel,
  //   };

  //   const today = new Date();
  //   const tanggalLengkap = today.toLocaleDateString("id-ID", {
  //     weekday: "long",
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //   });

  //   const groups = {
  //     Hadir: [],
  //     Izin: [],
  //     Sakit: [],
  //     Alpa: [],
  //   };

  //   formData.forEach((item) => {
  //     const status = item.status;
  //     if (status && groups[status]) {
  //       groups[status].push({
  //         nama: item.nama_lengkap,
  //         keterangan: item.keterangan,
  //       });
  //     }
  //   });

  //   let message = `📅 *Absensi Siswa ${tanggalLengkap}*\n`;
  //   message += `*Kelas:* ${dataTambahan.kelas}\n`;
  //   if (dataTambahan.mapel) {
  //     message += `*Mapel:* ${dataTambahan.mapel}\n`;
  //   }

  //   if (dataTambahan.guruMapel) {
  //     message += `*Guru:* ${dataTambahan.guruMapel}\n`;
  //   }
  //   // message += `*Tanggal:* ${tanggalLengkap}\n`;

  //   message += `\n`;

  //   const order = ["Hadir", "Izin", "Sakit", "Alpa"];
  //   let totalAbsensi = 0;

  //   order.forEach((kategori) => {
  //     const list = groups[kategori];
  //     if (list.length > 0) {
  //       let emoji = "📋";
  //       switch (kategori) {
  //         case "Hadir":
  //           emoji = "✅";
  //           break;
  //         case "Izin":
  //           emoji = "📋";
  //           break;
  //         case "Sakit":
  //           emoji = "🤒";
  //           break;
  //         case "Alpa":
  //           emoji = "❌";
  //           break;
  //       }

  //       message += `${emoji} *${kategori}*\n`;
  //       list.forEach((item) => {
  //         if (item.keterangan) {
  //           message += `- ${item.nama} - (${item.keterangan})\n`;
  //         } else {
  //           message += `- ${item.nama}\n`;
  //         }
  //       });
  //       message += `\n`;
  //       totalAbsensi += list.length;
  //     }
  //   });

  //   // Hitung siswa tanpa status
  //   const siswaTanpaStatus = formData.filter((item) => !item.status).length;

  //   if (siswaTanpaStatus > 0) {
  //     message += `📭 *Belum Diabsen:* ${siswaTanpaStatus} siswa\n\n`;
  //   }

  //   const summary = order
  //     .map((kategori) => {
  //       const count = groups[kategori].length;
  //       return `${kategori}: ${count}`;
  //     })
  //     .join(" | ");

  //   message += `📊 *Ringkasan:*\n${summary}`;
  //   message += `\nTotal Diabsen: ${totalAbsensi} dari ${formData.length} siswa`;

  //   const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
  //     message
  //   )}`;
  //   window.location.href = whatsappUrl;
  // };

  const generateWhatsappMessage = () => {
    const dataTambahan = {
      guruMapel: guru,
      kelas: location.state.kelas,
      hari: location.state.hari,
      mapel: location.state.mapel,
    };

    const today = new Date();
    const tanggalLengkap = today.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const groups = {
      Hadir: [],
      Izin: [],
      Sakit: [],
      Alpa: [],
    };

    formData.forEach((item) => {
      if (item.status && groups[item.status]) {
        groups[item.status].push({
          nama: item.nama_lengkap,
          keterangan: item.keterangan,
        });
      }
    });

    // let message = `📅 *Absensi Siswa ${tanggalLengkap}*\n`;
    let message = `📅 *Absensi Siswa ${dataTambahan.kelas}*\n`;
    message += `*Tanggal:* ${tanggalLengkap}\n`;

    if (dataTambahan.mapel) {
      message += `*Mapel:* ${dataTambahan.mapel}\n`;
    }

    if (dataTambahan.guruMapel) {
      message += `*Guru:* ${dataTambahan.guruMapel}\n`;
    }

    message += `\n`;

    const order = ["Hadir", "Izin", "Sakit", "Alpa"];
    let totalAbsensi = 0;

    order.forEach((kategori) => {
      const list = groups[kategori];
      if (list.length > 0) {
        const emojiMap = {
          Hadir: "✅",
          Izin: "📋",
          Sakit: "🤒",
          Alpa: "❌",
        };

        message += `${emojiMap[kategori]} *${kategori}*\n`;

        list.forEach((item) => {
          message += item.keterangan
            ? `- ${item.nama} (${item.keterangan})\n`
            : `- ${item.nama}\n`;
        });

        message += `\n`;
        totalAbsensi += list.length;
      }
    });

    const belum = formData.filter((item) => !item.status).length;
    if (belum > 0) {
      message += `📭 *Belum Diabsen:* ${belum} siswa\n\n`;
    }

    const summary = order.map((k) => `${k}: ${groups[k].length}`).join(" | ");

    message += `📊 *Ringkasan:*\n${summary}\n`;
    message += `Total Diabsen: ${totalAbsensi} dari ${formData.length} siswa`;

    return message;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    fetchData();
  };

  // Hitung statistik
  const getStats = () => {
    const hadir = formData.filter((item) => item.status === "Hadir").length;
    const izin = formData.filter((item) => item.status === "Izin").length;
    const sakit = formData.filter((item) => item.status === "Sakit").length;
    const alpa = formData.filter((item) => item.status === "Alpa").length;
    const belum = formData.filter((item) => !item.status).length;

    return { hadir, izin, sakit, alpa, belum };
  };

  const stats = getStats();

  return (
    <div className="absensi-container" ref={containerRef}>
      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={closeScanner}
        onScan={handleQRScan}
        onError={handleScanError}
      />

      {/* Keterangan Editor Modal */}
      {editingKeterangan && (
        <div
          className="keterangan-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
            padding: "1rem",
          }}
          onClick={(e) =>
            e.target === e.currentTarget && closeKeteranganEditor()
          }
        >
          <div
            className="keterangan-editor"
            style={{
              background: "white",
              border: "3px solid #000",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "8px 8px 0px #000",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                color: "#000",
                fontSize: "1.3rem",
                fontWeight: "800",
              }}
            >
              📝 Tambah Keterangan
            </h3>

            <p
              style={{
                margin: "0 0 1rem 0",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Tambahkan keterangan untuk status{" "}
              <strong>{editingKeterangan.status}</strong>
            </p>

            <textarea
              value={editingKeterangan.keterangan}
              onChange={(e) =>
                setEditingKeterangan({
                  ...editingKeterangan,
                  keterangan: e.target.value,
                })
              }
              placeholder={`Contoh: ${getKeteranganContoh(
                editingKeterangan.status
              )}`}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.8rem",
                border: "2px solid #000",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: "1rem",
              }}
              autoFocus
            />

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={closeKeteranganEditor}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "2px solid #000",
                  borderRadius: "6px",
                  padding: "0.6rem 1.2rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "2px 2px 0px #000",
                }}
              >
                Batal
              </button>

              <button
                onClick={saveKeterangan}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "2px solid #000",
                  borderRadius: "6px",
                  padding: "0.6rem 1.2rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "2px 2px 0px #000",
                }}
              >
                💾 Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="navigation-controls">
        <button
          onClick={handleBack}
          className="nav-button btn-back"
          title="Kembali ke halaman sebelumnya"
        >
          ← Kembali
        </button>
        <h1 className="absensi-header">📋 Absensi Siswa</h1>
        <div style={{ width: "100px" }}></div> {/* Spacer untuk balance */}
      </div>

      {/* Info Card */}
      <div className="info-card">
        <div className="info-item">
          <div className="info-icon">📅</div>
          <div className="info-content">
            <div className="info-label">Hari</div>
            <div className="info-value">{location.state?.hari || "-"}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">📚</div>
          <div className="info-content">
            <div className="info-label">Mata Pelajaran</div>
            <div className="info-value">{location.state?.mapel || "-"}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">🏫</div>
          <div className="info-content">
            <div className="info-label">Kelas</div>
            <div className="info-value">{location.state?.kelas || "-"}</div>
          </div>
        </div>

        <div className="info-item teacher-info">
          <div className="info-icon">👨‍🏫</div>
          <div className="info-content">
            <div className="info-label">Guru Pengajar</div>
            <div className="info-value">{guru || "Loading..."}</div>
          </div>
          <span className="status-badge status-active">Active</span>
        </div>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.5rem",
          margin: "1.5rem 0",
        }}
      >
        <div
          style={{
            background: "#d1fae5",
            border: "2px solid #10b981",
            borderRadius: "8px",
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#065f46" }}
          >
            {stats.hadir}
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#065f46" }}
          >
            ✅ Hadir
          </div>
        </div>
        <div
          style={{
            background: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#92400e" }}
          >
            {stats.izin}
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#92400e" }}
          >
            📋 Izin
          </div>
        </div>
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#991b1b" }}
          >
            {stats.sakit + stats.alpa}
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#991b1b" }}
          >
            ❌ Tidak Hadir
          </div>
        </div>
        <div
          style={{
            background: "#f3f4f6",
            border: "2px solid #6b7280",
            borderRadius: "8px",
            padding: "0.8rem",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "#374151" }}
          >
            {stats.belum}
          </div>
          <div
            style={{ fontSize: "0.7rem", fontWeight: "600", color: "#374151" }}
          >
            ⏳ Belum
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          textAlign: "center",
          margin: "1.5rem 0",
        }}
      >
        <button
          onClick={openScanner}
          className="submit-button"
          style={{
            background: "var(--primary-blue)",
            margin: "0.5rem",
          }}
        >
          📷 Scan QR Code Siswa
        </button>

        <button
          onClick={() => {
            const updatedData = formData.map((item) => ({
              ...item,
              status: null,
              keterangan: null,
            }));
            setFormData(updatedData);
            setScanMessage("🔄 Status semua siswa berhasil direset");
          }}
          className="submit-button"
          style={{
            background: "var(--accent-yellow)",
            color: "var(--black)",
            margin: "0.5rem",
          }}
        >
          🔄 Reset Semua
        </button>
      </div>

      {/* Scan Message */}
      {scanMessage && (
        <div
          className={
            scanMessage.includes("❌") || scanMessage.includes("🔄")
              ? "error-message"
              : "success-message"
          }
        >
          {scanMessage}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-text loading-pulse">
          🔄 Sedang memuat data siswa...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          ❌ {error}
          <button
            onClick={handleRetry}
            className="retry-button"
            style={{ marginLeft: "1rem" }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">✅ {successMessage}</div>
      )}

      {/* Empty State */}
      {!loading && !error && formData.length === 0 && (
        <div className="empty-state">
          <p>📭 Tidak ada data siswa ditemukan</p>
          <button onClick={handleRetry} className="retry-button">
            Muat Ulang Data
          </button>
        </div>
      )}

      {/* Form Absensi */}
      {formData.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: "2rem" }}>
            <h2
              style={{
                color: "#000",
                textAlign: "center",
                marginBottom: "1.5rem",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              👥 Daftar Siswa - {formData.length} Siswa
            </h2>

            {formData.map((siswa) => (
              <div
                key={siswa.id_siswa}
                className="siswa-card"
                data-status={siswa.status || ""}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <p className="siswa-nama">{siswa.nama_lengkap}</p>

                  {/* Keterangan Badge */}
                  {siswa.keterangan && (
                    <span
                      className="keterangan-badge"
                      style={{
                        background: "#f0f9ff",
                        color: "#0369a1",
                        border: "1px solid #0369a1",
                        borderRadius: "12px",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.7rem",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        openKeteranganEditor(
                          siswa.id_siswa,
                          siswa.status,
                          siswa.keterangan
                        )
                      }
                      title="Klik untuk edit keterangan"
                    >
                      📝{" "}
                      {siswa.keterangan.length > 20
                        ? siswa.keterangan.substring(0, 20) + "..."
                        : siswa.keterangan}
                    </span>
                  )}

                  {/* Tombol Batalkan Status */}
                  {siswa.status && (
                    <button
                      onClick={() =>
                        handleCancelStatus(siswa.id_siswa, siswa.nama_lengkap)
                      }
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "2px solid #000",
                        borderRadius: "6px",
                        padding: "0.3rem 0.6rem",
                        cursor: "pointer",
                        fontWeight: "600",
                        boxShadow: "1px 1px 0px #000",
                        fontSize: "0.7rem",
                        whiteSpace: "nowrap",
                      }}
                      title={`Batalkan status ${siswa.status} untuk ${siswa.nama_lengkap}`}
                    >
                      ❌ Batalkan
                    </button>
                  )}
                </div>

                <div className="status-options">
                  {["Hadir", "Izin", "Sakit", "Alpa"].map((statusOption) => (
                    <label
                      key={statusOption}
                      className={`status-option status-${statusOption.toLowerCase()}`}
                    >
                      <input
                        type="radio"
                        name={`status-${siswa.id_siswa}`}
                        value={statusOption}
                        checked={siswa.status === statusOption}
                        onChange={(e) =>
                          handleStatusChange(siswa.id_siswa, e.target.value)
                        }
                        className="status-radio"
                      />
                      {statusOption}

                      {/* Tombol Keterangan untuk status yang dipilih */}
                      {siswa.status === statusOption && (
                        <button
                          type="button"
                          onClick={() =>
                            openKeteranganEditor(
                              siswa.id_siswa,
                              statusOption,
                              siswa.keterangan
                            )
                          }
                          className="keterangan-button"
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            marginLeft: "0.3rem",
                            padding: "0.2rem",
                            borderRadius: "4px",
                          }}
                          title="Tambah keterangan"
                        >
                          {siswa.keterangan ? "📝" : "✏️"}
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            {!formData.filter((item) => !item.status).length > 0 && (
              <button
                type="submit"
                disabled={submitLoading}
                className="submit-button"
              >
                {submitLoading ? "💾 Menyimpan..." : "📤 Bagikan ke WhatsApp"}
              </button>
            )}
          </div>
        </form>
      )}

      {isShareModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
          onClick={(e) =>
            e.target === e.currentTarget && setIsShareModalOpen(false)
          }
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>
              📤 Preview Pesan WhatsApp
            </h3>

            <textarea
              readOnly
              value={whatsappMessage}
              style={{
                width: "100%",
                minHeight: "250px",
                marginBottom: "1rem",
                padding: "0.8rem",
                fontSize: "0.85rem",
              }}
            />
            <p>
              Silahkan tekan "Salin Teks" jika tombol "Kirim Ke Whatsapp" tidak
              berfungsi, dan paste manual ke dalam grub Whatsapp.{" "}
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button onClick={copyToClipboard} className="submit-button">
                📋 Salin Teks
              </button>

              <button
                onClick={sendToWhatsapp}
                className="submit-button"
                style={{ background: "#25D366" }}
              >
                📤 Kirim ke WhatsApp
              </button>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="submit-button"
                style={{ background: "#6b7280" }}
              >
                ✖ Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function untuk contoh keterangan
const getKeteranganContoh = (status) => {
  switch (status) {
    case "Izin":
      return "pulang lebih awal, ada keperluan keluarga, izin sakit";
    case "Sakit":
      return "demam, batuk pilek, sakit perut";
    case "Alpa":
      return "tidak ada kabar, terlambat terlalu lama, bolos";
    case "Hadir":
      return "hadir tepat waktu, hadir terlambat 15 menit";
    default:
      return "tulis keterangan tambahan...";
  }
};
