import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QRScanner from "./components/QRScanner";
import AbsensiSiswaStatistic from "./components/AbsensiSiswaStatistic";
import AbsensiSiswaInfoCard from "./components/AbsensiSiswaInfoCard";
import AbsensiSiswaInfoCardModalMateri from "./components/AbsensiSiswaInfoCardModalMateri";
import AbsensiSiswaEditingKeteranganModal from "./components/AbsensiSiswaEditingKeteranganModal";
import AbsensiSiswaNavigationControl from "./components/AbsensiSiswaNavigationControl";
import "./style/AbsensiSiswa.css";
import AbsensiSiswaButtonGroup from "./components/AbsensiSiswaButtonGroup";

export default function AbsensiSiswa() {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState([]);
  const [scanMessage, setScanMessage] = useState(null);

  const [materi, setMateri] = useState(undefined);
  const [materiModal, setMateriModal] = useState(false);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingKeterangan, setEditingKeterangan] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    fetchSiswaAbsensi();
  }, []);

  const fetchSiswaAbsensi = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setScanMessage(null);

    try {
      const params = {
        kelas: location.state.kelas,
        // hari: location.state.hari,
        // mapel: location.state.mapel,
      };
      const url = `${import.meta.env.VITE_NEW_API_URL}/siswa.php?id_kelas=${
        params.kelas.id
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        alert("Gagal mengambil data siswa yang diabsensi");
        return;
      }
      window.scrollTo(0, 0);

      // menghapus nilai aktif pada kolom status disetiap siswa
      data.data.map((siswa) => {
        siswa.status = "";
        siswa.keterangan = "";
      });

      setFormData(data.data);
      setLoading(false);

      // setGuru(result.kriteria.guru);
      // setTeacher(data.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    }
  };

  const openKeteranganEditor = (id, status, currentKeterangan) => {
    setEditingKeterangan({
      id,
      status,
      keterangan: currentKeterangan || "",
    });
  };

  // fungsi-fungsi memilih absensi
  const handleCancelStatus = (id, nama) => {
    const updatedData = formData.map((item) => {
      if (item.id === id) {
        return { ...item, status: null, keterangan: null };
      }
      return item;
    });
    setSubmitLoading(false);
    setFormData(updatedData);
    setScanMessage(`❌ Status ${nama} berhasil dibatalkan`);

    setTimeout(() => {
      setScanMessage(null);
    }, 3000);
  };
  const handleStatusChange = (id, newStatus) => {
    const updatedData = formData.map((item) => {
      if (item.id === id) {
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

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  function diLuarJamPagiTarakan() {
    const sekarang = new Date();

    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Makassar",
      hour: "2-digit",
      hour12: false,
    });

    const jam = parseInt(formatter.format(sekarang), 10);

    // Jika BUKAN di antara jam 07 - 12
    return !(jam >= 7 && jam < 12);
  }

  // fungsi-fungsi submit absensi/form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage(null);

    const params = {
      guru: location.state.guru,
      mapel: location.state.mapel,
    };

    formData.map((siswa) => {
      siswa.tanggal = getTodayDate();
      siswa.id_guru_sekolah = params.guru.id;
      siswa.id_mata_pelajaran = params.mapel.id;
      materi ? (siswa.materi = materi) : (siswa.materi = null);
    });

    const payload = new FormData();
    payload.append("data", JSON.stringify(formData));

    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/absen_sekolah.php`;
      const res = await fetch(url, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      const data = await res.json();

      if (data.status) {
        const message = generateWhatsappMessage();
        setWhatsappMessage(message);
        setIsShareModalOpen(true);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };
  const generateWhatsappMessage = () => {
    const params = {
      guru: location.state.guru,
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
      Terlambat: [],
      Izin: [],
      Sakit: [],
      Alpa: [],
    };

    formData.forEach((item) => {
      if (item.status && groups[item.status]) {
        groups[item.status].push({
          nama: item.nama,
          keterangan: item.keterangan,
        });
      }
    });

    // let message = `📅 *Absensi Siswa ${tanggalLengkap}*\n`;
    let message = `📅 *Absensi Siswa ${params.kelas.nama}*\n`;
    message += `*Tanggal:* ${tanggalLengkap}\n`;

    if (params.mapel.nama) {
      message += `*Mapel:* ${params.mapel.nama}\n`;
    }

    if (materi) {
      message += `*Materi:* ${materi}\n`;
    }

    if (params.guru.nama) {
      message += `*Guru:* ${params.guru.nama}\n`;
    }

    message += `\n`;

    const order = ["Hadir", "Terlambat", "Izin", "Sakit", "Alpa"];
    let totalAbsensi = 0;

    order.forEach((kategori) => {
      const list = groups[kategori];
      if (list.length > 0) {
        const emojiMap = {
          Hadir: "✅",
          Terlambat: "🕐",
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

    const benarDiluarJam = diLuarJamPagiTarakan();

    if (benarDiluarJam) {
      message += `Total Diabsen: ${totalAbsensi} dari ${formData.length} siswa\n\n`;
      message += `_via Bubs Absensi Digital_`;
    } else {
      message += `Total Diabsen: ${totalAbsensi} dari ${formData.length} siswa`;
    }

    return message;
  };

  // fungsi-fungsi scanner qr
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
      setScanMessage("❌ Siswa tidak ditemukan dalam kelas ini");

      setTimeout(() => {
        setScanMessage(null);
      }, 3000);
    }
  };

  // fungsi-fungsi modal tambah keterangan
  const handleKeteranganChange = (id, keterangan) => {
    const updatedData = formData.map((item) => {
      if (item.id === id) {
        return { ...item, keterangan: keterangan || null };
      }
      return item;
    });
    setFormData(updatedData);
  };
  const saveKeterangan = () => {
    if (editingKeterangan) {
      handleKeteranganChange(
        editingKeterangan.id,
        editingKeterangan.keterangan
      );
      setEditingKeterangan(null);
    }
  };

  // fungsi-fungsi modal preview teks whatsapp
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

  // Hitung statistik
  const getStats = () => {
    const hadir = formData.filter((item) => item.status === "Hadir").length;
    const izin = formData.filter((item) => item.status === "Izin").length;
    const sakit = formData.filter((item) => item.status === "Sakit").length;
    const alpa = formData.filter((item) => item.status === "Alpa").length;
    const terlambat = formData.filter(
      (item) => item.status === "Terlambat"
    ).length;
    const belum = formData.filter((item) => !item.status).length;

    return { hadir, izin, sakit, alpa, terlambat, belum };
  };
  const stats = getStats();

  return (
    <div className="absensi-container">
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScan}
        onError={() => setScanMessage("Scanner QR sedang error")}
      />

      {editingKeterangan && (
        <AbsensiSiswaEditingKeteranganModal
          setEditingKeterangan={setEditingKeterangan}
          editingKeterangan={editingKeterangan}
          getKeteranganContoh={getKeteranganContoh}
          saveKeterangan={saveKeterangan}
        />
      )}

      {materiModal && (
        <AbsensiSiswaInfoCardModalMateri
          setMateri={setMateri}
          materi={materi}
          setMateriModal={setMateriModal}
        />
      )}

      <AbsensiSiswaNavigationControl />
      <AbsensiSiswaInfoCard
        location={location}
        materi={materi}
        setMateriModal={setMateriModal}
      />
      <AbsensiSiswaStatistic stats={stats} />

      <AbsensiSiswaButtonGroup
        setIsScannerOpen={setIsScannerOpen}
        formData={formData}
        setFormData={setFormData}
        setScanMessage={setScanMessage}
      />

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

      {loading && (
        <div className="loading-text loading-pulse">
          🔄 Sedang memuat data siswa...
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
          <button
            onClick={() => fetchSiswaAbsensi()}
            className="retry-button"
            style={{ marginLeft: "1rem" }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">✅ {successMessage}</div>
      )}

      {!loading && !error && formData.length === 0 && (
        <div className="empty-state">
          <p>📭 Tidak ada data siswa ditemukan</p>
          <button onClick={() => fetchSiswaAbsensi()} className="retry-button">
            Muat Ulang Data
          </button>
        </div>
      )}

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
              👥 Terdaftar {formData.length} Siswa
            </h2>

            {formData.map((siswa) => (
              <div
                key={siswa.id}
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
                  <p className="siswa-nama">{siswa.nama}</p>

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
                          siswa.id,
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
                      onClick={() => handleCancelStatus(siswa.id, siswa.nama)}
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
                      title={`Batalkan status ${siswa.status} untuk ${siswa.nama}`}
                    >
                      ❌ Batalkan
                    </button>
                  )}
                </div>

                <div className="status-options">
                  {["Hadir", "Izin", "Sakit", "Alpa", "Terlambat"].map(
                    (statusOption) => (
                      <label
                        key={statusOption}
                        className={`status-option status-${statusOption.toLowerCase()}`}
                      >
                        <input
                          type="radio"
                          name={`status-${siswa.id}`}
                          value={statusOption}
                          checked={siswa.status === statusOption}
                          onChange={(e) =>
                            handleStatusChange(siswa.id, e.target.value)
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
                                siswa.id,
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
                    )
                  )}
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
              <button
                onClick={copyToClipboard}
                className="submit-button"
                style={{ background: "#7e80f4ff" }}
              >
                📋 Salin Teks
              </button>

              <button onClick={sendToWhatsapp} className="submit-button">
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
    case "Terlambat":
      return "hadir terlambat 30 menit, hadir terlambat 1 jam";
    default:
      return "tulis keterangan tambahan...";
  }
};
