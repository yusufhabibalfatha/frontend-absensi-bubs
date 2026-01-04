// components/TugasSiswa.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmissionForm from "./SubmissionForm";

const TugasSiswa = () => {
  const [user, setUser] = useState(null);
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTugas, setSelectedTugas] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    console.log("use effect");
    const userObj = JSON.parse(userData);
    setUser(userObj);
    fetchTugasSiswa(userObj.id_siswa);
  }, [navigate]);

  const fetchTugasSiswa = async (idSiswa) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bubs/v1/tugas/siswa/${idSiswa}`
      );
      const data = await response.json();

      setTugasList(data);
    } catch (error) {
      console.error("Error fetching tugas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/classroom/siswa");
  };

  const handleSubmitTugas = (tugas) => {
    setSelectedTugas(tugas);
  };

  const handleSubmissionSuccess = () => {
    setSelectedTugas(null);
    fetchTugasSiswa(user.id_siswa);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-text">🔄 Loading tugas...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="navigation-controls">
        <button onClick={handleBack} className="nav-button btn-back">
          ← Dashboard
        </button>
        <h1 className="absensi-header">📝 Tugas Saya</h1>
        <div style={{ width: "100px" }}></div> {/* Spacer */}
      </div>

      {selectedTugas ? (
        <SubmissionForm
          tugas={selectedTugas}
          user={user}
          onCancel={() => setSelectedTugas(null)}
          onSuccess={handleSubmissionSuccess}
        />
      ) : (
        <div>
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <p>
              Total Tugas: <strong>{tugasList.length}</strong>
            </p>
          </div>

          {tugasList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
              <h3>Tidak ada tugas</h3>
              <p>Belum ada tugas yang diberikan untuk Anda</p>
            </div>
          ) : (
            <div>
              {tugasList.map((tugas) => (
                <div
                  key={tugas.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    background: "#fff",
                    opacity: tugas.status_submission ? 0.8 : 1,
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
                        {tugas.judul_tugas}
                      </h3>
                      <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                        Mata Pelajaran: {tugas.mata_pelajaran}
                      </p>
                      <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                        Guru: {tugas.nama_guru}
                      </p>
                      <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                        Deadline:{" "}
                        {new Date(tugas.deadline_datetime).toLocaleString()}
                      </p>
                      {tugas.deskripsi_text && (
                        <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                          {tugas.deskripsi_text}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {tugas.status_submission ? (
                        <span
                          style={{
                            background: "#10b981",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                          }}
                        >
                          ✅ Sudah dikumpulkan
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#f59e0b",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                          }}
                        >
                          📝 Belum dikumpulkan
                        </span>
                      )}
                    </div>
                  </div>

                  {tugas.nilai_akhir && (
                    <div
                      style={{
                        background: "#dbeafe",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        marginTop: "0.5rem",
                      }}
                    >
                      <strong>Nilai: {tugas.nilai_akhir}</strong>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    {!tugas.status_submission && (
                      <button
                        onClick={() => handleSubmitTugas(tugas)}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid #3b82f6",
                          background: "#3b82f6",
                          color: "white",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Kumpulkan Tugas
                      </button>
                    )}
                    {tugas.file_path && (
                      <button
                        onClick={() => window.open(tugas.file_path, "_blank")}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid #6b7280",
                          background: "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        📎 Download Soal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TugasSiswa;
