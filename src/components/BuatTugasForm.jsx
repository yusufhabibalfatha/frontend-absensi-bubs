// components/BuatTugasForm.jsx
import { useState, useEffect } from "react";

const BuatTugasForm = ({ user, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    judul_tugas: "",
    deskripsi_text: "",
    id_mata_pelajaran: "",
    deadline_datetime: "",
    bobot_nilai: 100,
  });
  const [mataPelajaranList, setMataPelajaranList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMataPelajaranGuru();
  }, []);

  const fetchMataPelajaranGuru = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/kelas-guru?id_guru=${
          user.id_guru
        }`
      );
      const data = await response.json();
      setMataPelajaranList(data);
    } catch (error) {
      console.error("Error fetching mata pelajaran:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("id_guru", user.id_guru);
    submitData.append("judul_tugas", formData.judul_tugas);
    submitData.append("deskripsi_text", formData.deskripsi_text);
    submitData.append("id_mata_pelajaran", formData.id_mata_pelajaran);
    submitData.append("deadline_datetime", formData.deadline_datetime);
    submitData.append("bobot_nilai", formData.bobot_nilai);

    if (file) {
      submitData.append("file_tugas", file);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/tugas/create`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Tugas berhasil dibuat!");
        onSuccess();
      } else {
        alert("Gagal membuat tugas: " + result.message);
      }
    } catch (error) {
      console.error("Error creating tugas:", error);
      alert("Error creating tugas");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1.5rem",
        background: "#f9fafb",
      }}
    >
      <h3 style={{ marginTop: 0 }}>📝 Buat Tugas Baru</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Judul Tugas *
          </label>
          <input
            type="text"
            name="judul_tugas"
            value={formData.judul_tugas}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Mata Pelajaran *
          </label>
          <select
            name="id_mata_pelajaran"
            value={formData.id_mata_pelajaran}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">Pilih Mata Pelajaran</option>
            {mataPelajaranList.map((mapel) => (
              <option key={mapel.id} value={mapel.id}>
                {mapel.mata_pelajaran} - {mapel.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Deskripsi Tugas
          </label>
          <textarea
            name="deskripsi_text"
            value={formData.deskripsi_text}
            onChange={handleChange}
            rows="4"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Deadline *
          </label>
          <input
            type="datetime-local"
            name="deadline_datetime"
            value={formData.deadline_datetime}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Bobot Nilai
          </label>
          <input
            type="number"
            name="bobot_nilai"
            value={formData.bobot_nilai}
            onChange={handleChange}
            min="0"
            max="100"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            File Tugas (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Membuat..." : "Buat Tugas"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.5rem",
              background: "transparent",
              border: "1px solid #6b7280",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuatTugasForm;
