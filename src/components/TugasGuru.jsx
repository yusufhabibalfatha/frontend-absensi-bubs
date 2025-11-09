// components/TugasGuru.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BuatTugasForm from "./BuatTugasForm";

const TugasGuru = () => {
  const [user, setUser] = useState(null);
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);
    fetchTugasGuru(userObj.id_guru);
  }, [navigate]);

  const fetchTugasGuru = async (idGuru) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/tugas/guru/${idGuru}`
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
    navigate("/classroom/guru");
  };

  const handleCreateTugas = () => {
    setShowForm(true);
  };

  const handleTugasCreated = () => {
    setShowForm(false);
    fetchTugasGuru(user.id_guru);
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
        <h1 className="absensi-header">📝 Manage Tugas</h1>
        <button onClick={handleCreateTugas} className="nav-button">
          ➕ Buat Tugas
        </button>
      </div>

      {showForm ? (
        <BuatTugasForm
          user={user}
          onCancel={() => setShowForm(false)}
          onSuccess={handleTugasCreated}
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
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
              <h3>Belum ada tugas</h3>
              <p>Mulai dengan membuat tugas pertama Anda</p>
              <button onClick={handleCreateTugas} className="nav-button">
                Buat Tugas Pertama
              </button>
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
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>
                    {tugas.judul_tugas}
                  </h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                    Mata Pelajaran: {tugas.mata_pelajaran}
                  </p>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                    Deadline:{" "}
                    {new Date(tugas.deadline_datetime).toLocaleString()}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/classroom/submissions/${tugas.id}`)
                      }
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #3b82f6",
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Lihat Submission
                    </button>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #6b7280",
                        background: "transparent",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
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

export default TugasGuru;
