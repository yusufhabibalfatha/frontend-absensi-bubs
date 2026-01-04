// components/MateriSiswa.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MateriSiswa = () => {
  const [user, setUser] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);

    // Ambil id_kelas dari user data atau fetch dari API
    const idKelas = userObj.id_kelas; // Fallback ke 1 jika tidak ada

    fetchMateriSiswa(idKelas);
  }, [navigate]);

  const fetchMateriSiswa = async (idKelas) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bubs/v1/materi/siswa/${idKelas}`
      );
      const data = await response.json();

      setMateriList(data);
    } catch (error) {
      console.error("Error fetching materi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/classroom/siswa");
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-text">🔄 Loading materi...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="navigation-controls">
        <button onClick={handleBack} className="nav-button btn-back">
          ← Dashboard
        </button>
        <h1 className="absensi-header">📚 Materi Pelajaran</h1>
        <div style={{ width: "100px" }}></div> {/* Spacer */}
      </div>

      <div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <p>
            Total Materi Tersedia: <strong>{materiList.length}</strong>
          </p>
        </div>

        {materiList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3>Belum ada materi</h3>
            <p>Guru belum mengupload materi untuk kelas Anda</p>
          </div>
        ) : (
          <div>
            {materiList.map((materi) => (
              <div
                key={materi.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                      {materi.judul_materi}
                    </h3>
                    <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                      Mata Pelajaran: {materi.mata_pelajaran}
                    </p>
                    <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                      Guru: {materi.nama_guru}
                    </p>
                    {materi.deskripsi && (
                      <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                        {materi.deskripsi}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "#666",
                        fontSize: "0.9rem",
                      }}
                    >
                      Diupload:{" "}
                      {new Date(materi.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        background: "#6b7280",
                        color: "white",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {materi.tipe_file?.toUpperCase() || "FILE"}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => window.open(materi.file_path, "_blank")}
                    style={{
                      padding: "0.5rem 1rem",
                      border: "1px solid #3b82f6",
                      background: "#3b82f6",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    📥 Download Materi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MateriSiswa;
