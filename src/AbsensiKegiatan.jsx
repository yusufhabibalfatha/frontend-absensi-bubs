import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRScanner from "./components/QRScanner";
import "./style/AbsensiSiswa.css";

const AbsensiKegiatan = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState([]);
  const [scanMessage, setScanMessage] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingKeterangan, setEditingKeterangan] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [waMessage, setWaMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { kegiatan, kelas, kamar, tipe } = location.state || {};

  useEffect(() => {
    if (!kegiatan || !tipe) {
      navigate("/kegiatan");
      return;
    }
    window.scrollTo(0, 0);
    fetchData();
  }, [kegiatan, tipe, navigate]);

  const fetchData = async () => {
    if (!kegiatan) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setScanMessage(null);

    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/siswa-kegiatan?`;

      if (tipe === "SEKOLAH" && kelas) {
        url += `kegiatan=${kegiatan.id}&kelas=${kelas.id}`;
      } else if (tipe === "PONDOK" && kamar) {
        url += `kegiatan=${kegiatan.id}&kamar=${kamar.id}`;
      } else {
        throw new Error("Data tidak lengkap");
      }

      const response = await axios.get(url);

      const result = response.data;

      if (result.success) {
        setFormData(result.data);
      } else {
        throw new Error(result.message || "Data siswa tidak ditemukan");
      }

      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
          keterangan: item.status === newStatus ? item.keterangan : null,
        };
      }
      return item;
    });
    setFormData(updatedData);
    setScanMessage(null);
  };

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

  const handleQRScan = (nik) => {
    const student = formData.find((item) => item.nik === nik);

    if (student) {
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
      setScanMessage("❌ Siswa tidak ditemukan");

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

  const handleKeteranganChange = (id_siswa, keterangan) => {
    const updatedData = formData.map((item) => {
      if (item.id_siswa === id_siswa) {
        return { ...item, keterangan: keterangan || null };
      }
      return item;
    });
    setFormData(updatedData);
  };

  const openKeteranganEditor = (id_siswa, status, currentKeterangan) => {
    setEditingKeterangan({
      id_siswa,
      status,
      keterangan: currentKeterangan || "",
    });
  };

  const closeKeteranganEditor = () => {
    setEditingKeterangan(null);
  };

  const saveKeterangan = () => {
    if (editingKeterangan) {
      handleKeteranganChange(
        editingKeterangan.id_siswa,
        editingKeterangan.keterangan
      );
      setEditingKeterangan(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage(null);
    setScanMessage(null);

    try {
      // Prepare data for submission
      const submissionData = formData
        .filter((item) => item.status) // Only include students with status
        .map((item) => ({
          id_siswa: item.id_siswa,
          id_kegiatan: item.id_kegiatan,
          id_kelas: tipe === "SEKOLAH" ? item.id_kelas : null,
          id_kamar: tipe === "PONDOK" ? item.id_kamar : null,
          status: item.status,
          keterangan: item.keterangan || "",
        }));

      if (submissionData.length === 0) {
        throw new Error("Tidak ada data absensi yang akan disimpan");
      }

      const url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/insert/absensi-kegiatan`;

      const response = await axios.post(url, submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.success) {
        setSuccessMessage("Absensi kegiatan berhasil disimpan!");

        const text = generateWhatsAppText();
        setWaMessage(text);
        setIsPreviewOpen(true);
      } else {
        throw new Error(result.message || "Gagal menyimpan absensi");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // const handleShare = () => {
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

  //   let message = `📅 *Rekap Absensi ${kegiatan.nama_kegiatan}*\n`;
  //   message += `*Tanggal:* ${tanggalLengkap}\n`;

  //   if (tipe === "SEKOLAH" && kelas) {
  //     message += `*Kelas:* ${kelas.nama_kelas}\n`;
  //   } else if (tipe === "PONDOK" && kamar) {
  //     message += `*Kamar:* ${kamar.nama_kamar}\n`;
  //   }

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
  //           message += `- ${item.nama} (${item.keterangan})\n`;
  //         } else {
  //           message += `- ${item.nama}\n`;
  //         }
  //       });
  //       message += `\n`;
  //       totalAbsensi += list.length;
  //     }
  //   });

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
  //   window.open(whatsappUrl, "_blank");
  // };

  const generateWhatsAppText = () => {
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

    let message = `📅 *Rekap Absensi ${kegiatan.nama_kegiatan}*\n`;
    message += `*Tanggal:* ${tanggalLengkap}\n`;

    if (tipe === "SEKOLAH" && kelas) {
      message += `*Kelas:* ${kelas.nama_kelas}\n`;
    } else if (tipe === "PONDOK" && kamar) {
      message += `*Kamar:* ${kamar.nama_kamar}\n`;
    }

    message += `\n`;

    const order = ["Hadir", "Izin", "Sakit", "Alpa"];
    let totalAbsensi = 0;

    order.forEach((kategori) => {
      const list = groups[kategori];
      if (list.length > 0) {
        const emoji =
          kategori === "Hadir"
            ? "✅"
            : kategori === "Izin"
            ? "📋"
            : kategori === "Sakit"
            ? "🤒"
            : "❌";

        message += `${emoji} *${kategori}*\n`;
        list.forEach((item) => {
          message += item.keterangan
            ? `- ${item.nama} (${item.keterangan})\n`
            : `- ${item.nama}\n`;
        });
        message += `\n`;
        totalAbsensi += list.length;
      }
    });

    const belum = formData.filter((i) => !i.status).length;
    if (belum > 0) {
      message += `📭 *Belum Diabsen:* ${belum} siswa\n\n`;
    }

    message += `📊 *Ringkasan:*\n`;
    message += order.map((k) => `${k}: ${groups[k].length}`).join(" | ");
    message += `\nTotal Diabsen: ${totalAbsensi} dari ${formData.length} siswa`;

    return message;
  };

  const handleSendWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      waMessage
    )}`;
    window.open(url, "_blank"); // USER gesture → Safari aman
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(waMessage);
    alert("📋 Teks berhasil disalin");
  };

  const handleBack = () => {
    if (tipe === "SEKOLAH") {
      navigate("/kegiatan/kelas");
    } else {
      navigate("/kegiatan/kamar");
    }
  };

  const handleRetry = () => {
    fetchData();
  };

  const getStats = () => {
    const hadir = formData.filter((item) => item.status === "Hadir").length;
    const izin = formData.filter((item) => item.status === "Izin").length;
    const sakit = formData.filter((item) => item.status === "Sakit").length;
    const alpa = formData.filter((item) => item.status === "Alpa").length;
    const belum = formData.filter((item) => !item.status).length;

    return { hadir, izin, sakit, alpa, belum };
  };

  const stats = getStats();

  if (!kegiatan || !tipe) {
    return (
      <div className="absensi-container">
        <div className="error-message">❌ Data tidak lengkap</div>
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

        <h1 className="absensi-header">📋 Absensi {kegiatan.nama_kegiatan}</h1>

        <div style={{ width: "100px" }}></div>
      </div>

      {/* Info Card */}
      <div className="info-card">
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

        {tipe === "SEKOLAH" && kelas && (
          <div className="info-item">
            <div className="info-icon">🏫</div>
            <div className="info-content">
              <div className="info-label">Kelas</div>
              <div className="info-value">{kelas.nama_kelas}</div>
            </div>
          </div>
        )}

        {tipe === "PONDOK" && kamar && (
          <div className="info-item">
            <div className="info-icon">🏠</div>
            <div className="info-content">
              <div className="info-label">Kamar</div>
              <div className="info-value">{kamar.nama_kamar}</div>
            </div>
          </div>
        )}

        <div className="info-item teacher-info">
          <div className="info-icon">👥</div>
          <div className="info-content">
            <div className="info-label">Jenis</div>
            <div className="info-value">
              {tipe === "SEKOLAH"
                ? "Siswa Boarding"
                : "Siswa Boarding & Reguler"}
            </div>
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
            <button
              type="submit"
              disabled={submitLoading}
              className="submit-button"
            >
              {submitLoading ? "💾 Menyimpan..." : "📤 Bagikan ke WhatsApp"}
            </button>
          </div>
        </form>
      )}

      {/* modal */}
      {isPreviewOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
          onClick={(e) =>
            e.target === e.currentTarget && setIsPreviewOpen(false)
          }
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              padding: "1.5rem",
              boxShadow: "8px 8px 0 #000",
              border: "3px solid #000",
            }}
          >
            <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>
              📤 Preview Pesan WhatsApp
            </h3>

            <textarea
              readOnly
              value={waMessage}
              style={{
                width: "100%",
                minHeight: "250px",
                padding: "0.8rem",
                border: "2px solid #000",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                resize: "vertical",
              }}
            />
            <p>
              Silahkan tekan "Salin Teks" jika tombol "Kirim Ke Whatsapp" tidak
              berfungsi, dan paste manual ke dalam grub Whatsapp.{" "}
            </p>

            {/* <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleSendWhatsApp}
                style={{
                  background: "#25D366",
                  color: "#fff",
                  border: "2px solid #000",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📲 Kirim ke WhatsApp
              </button>

              <button
                onClick={handleCopyText}
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  border: "2px solid #000",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📋 Salin Teks
              </button>

              <button
                onClick={() => setIsPreviewOpen(false)}
                style={{
                  background: "#6b7280",
                  color: "#fff",
                  border: "2px solid #000",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ❌ Tutup
              </button>
            </div> */}

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button onClick={handleCopyText} className="submit-button">
                📋 Salin Teks
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="submit-button"
                style={{ background: "#25D366" }}
              >
                📤 Kirim ke WhatsApp
              </button>

              <button
                onClick={() => setIsPreviewOpen(false)}
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
};

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

export default AbsensiKegiatan;
