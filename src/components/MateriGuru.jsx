// components/MateriGuru.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadMateriForm from "./UploadMateriForm";

const MateriGuru = () => {
  const [user, setUser] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);
    fetchMateriGuru(userObj.id_guru);
  }, [navigate]);

  const fetchMateriGuru = async (idGuru) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/materi/guru/${idGuru}`
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
    navigate("/classroom/guru");
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    fetchMateriGuru(user.id_guru);
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
        <h1 className="absensi-header">📚 Manage Materi</h1>
        <button onClick={() => setShowUploadForm(true)} className="nav-button">
          📤 Upload Materi
        </button>
      </div>

      {showUploadForm ? (
        <UploadMateriForm
          user={user}
          onCancel={() => setShowUploadForm(false)}
          onSuccess={handleUploadSuccess}
        />
      ) : (
        <div>
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <p>
              Total Materi: <strong>{materiList.length}</strong>
            </p>
          </div>

          {materiList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
              <h3>Belum ada materi</h3>
              <p>Mulai dengan mengupload materi pertama Anda</p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="nav-button"
              >
                Upload Materi Pertama
              </button>
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

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
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
                      📥 Download
                    </button>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #ef4444",
                        background: "transparent",
                        color: "#ef4444",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Hapus
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

export default MateriGuru;
