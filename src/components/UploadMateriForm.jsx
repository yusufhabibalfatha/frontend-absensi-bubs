// components/UploadMateriForm.jsx
import axios from "axios";
import { useState, useEffect } from "react";

const UploadMateriForm = ({ user, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    judul_materi: "",
    deskripsi: "",
    id_mata_pelajaran: "",
  });
  const [mataPelajaranList, setMataPelajaranList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMataPelajaranGuru();
  }, []);

  const fetchMataPelajaranGuru = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      const url = `${
        import.meta.env.VITE_API_URL
      }/absensi-bubs/v1/kelas-guru?id_guru=${user.id_guru}`;

      const response = await axios.get(url, {
        headers: {
          "X-User-Data": JSON.stringify(userData),
        },
      });

      setMataPelajaranList(response.data.data);
    } catch (error) {
      console.error("Error fetching mata pelajaran:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("File materi harus diupload");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("id_guru", user.id_guru);
    submitData.append("judul_materi", formData.judul_materi);
    submitData.append("deskripsi", formData.deskripsi);
    submitData.append("id_mata_pelajaran", formData.id_mata_pelajaran);
    submitData.append("file_materi", file);

    try {
      const url = `${import.meta.env.VITE_API_URL}/bubs/v1/materi/upload`;

      const response = await axios.post(url, submitData);

      if (response.data.success) {
        alert("Materi berhasil diupload!");
        onSuccess();
      } else {
        alert("Gagal upload materi: " + response.message);
      }
    } catch (error) {
      console.error("Error uploading materi:", error);
      alert("Error uploading materi");
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
      <h3 style={{ marginTop: 0 }}>📤 Upload Materi Baru</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Judul Materi *
          </label>
          <input
            type="text"
            name="judul_materi"
            value={formData.judul_materi}
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
            {mataPelajaranList.map((mapel, index) => (
              <option key={index} value={mapel.id}>
                {mapel.mata_pelajaran} - {mapel.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Deskripsi Materi
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="3"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Deskripsi singkat tentang materi ini..."
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            File Materi *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <small
            style={{ color: "#666", display: "block", marginTop: "0.25rem" }}
          >
            Format yang didukung: PDF, DOC, DOCX, PPT, PPTX, Image
          </small>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Mengupload..." : "Upload Materi"}
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

export default UploadMateriForm;
