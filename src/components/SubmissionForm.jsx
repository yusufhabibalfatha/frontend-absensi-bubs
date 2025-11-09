// components/SubmissionForm.jsx
import { useState } from "react";

const SubmissionForm = ({ tugas, user, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    jawaban_text: "",
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("id_tugas", tugas.id);
    submitData.append("id_siswa", user.id);
    submitData.append("jawaban_text", formData.jawaban_text);

    if (file) {
      submitData.append("file_jawaban", file);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/submission/create`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Tugas berhasil dikumpulkan!");
        onSuccess();
      } else {
        alert("Gagal mengumpulkan tugas: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting tugas:", error);
      alert("Error mengumpulkan tugas");
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

  const isLate = new Date() > new Date(tugas.deadline_datetime);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1.5rem",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ margin: 0 }}>📤 Kumpulkan Tugas</h3>
        {isLate && (
          <span
            style={{
              background: "#ef4444",
              color: "white",
              padding: "0.25rem 0.5rem",
              borderRadius: "12px",
              fontSize: "0.8rem",
            }}
          >
            ⚠️ Terlambat
          </span>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h4 style={{ margin: "0 0 0.5rem 0" }}>{tugas.judul_tugas}</h4>
        <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
          <strong>Mata Pelajaran:</strong> {tugas.mata_pelajaran}
        </p>
        <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
          <strong>Guru:</strong> {tugas.nama_guru}
        </p>
        <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
          <strong>Deadline:</strong>{" "}
          {new Date(tugas.deadline_datetime).toLocaleString()}
        </p>
        {tugas.deskripsi_text && (
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            <strong>Deskripsi:</strong> {tugas.deskripsi_text}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Jawaban Teks
          </label>
          <textarea
            name="jawaban_text"
            value={formData.jawaban_text}
            onChange={handleChange}
            rows="6"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Tulis jawaban tugas Anda di sini..."
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            File Jawaban (Optional)
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
          <small
            style={{ color: "#666", display: "block", marginTop: "0.25rem" }}
          >
            Upload file jika jawaban memerlukan dokumen, gambar, dll.
          </small>
        </div>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "6px",
            padding: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem" }}>
            <strong>Perhatian:</strong> Pastikan jawaban sudah benar sebelum
            mengumpulkan. Tugas tidak dapat diubah setelah dikumpulkan.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: isLate ? "#f59e0b" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Mengumpulkan..."
              : isLate
              ? "📤 Kumpulkan (Terlambat)"
              : "📤 Kumpulkan Tugas"}
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

export default SubmissionForm;
