import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SubmissionList = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [tugas, setTugas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingData, setGradingData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // id tugas

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);
    fetchSubmissionData(id, userObj.id_guru);
  }, [navigate, id]);

  const fetchSubmissionData = async (tugasId, guruId) => {
    try {
      setLoading(true);

      // Fetch submissions
      const submissionResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/bubs/v1/submission/tugas/${tugasId}`
      );

      setSubmissions(submissionResponse.data);

      // Fetch tugas detail
      const tugasResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/bubs/v1/tugas/guru/${guruId}`
      );

      const currentTugas = tugasResponse.data.find((t) => t.id == tugasId);
      setTugas(currentTugas);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/classroom/tugas-guru");
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      nilai: submission.nilai_akhir || "",
      catatan_guru: submission.catatan_guru || "",
    });
  };

  const handleSubmitGrade = async () => {
    if (
      !gradingData.nilai ||
      gradingData.nilai < 0 ||
      gradingData.nilai > 100
    ) {
      alert("Nilai harus antara 0-100");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/nilai/beri`,
        {
          id_submission: selectedSubmission.id,
          id_guru: user.id_guru,
          nilai: parseInt(gradingData.nilai),
          catatan_guru: gradingData.catatan_guru,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.success) {
        alert("Nilai berhasil diberikan!");
        setSelectedSubmission(null);
        fetchSubmissionData(id); // Refresh data
      } else {
        alert("Gagal memberikan nilai: " + result.message);
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Error memberikan nilai");
    }
  };

  const handleDownloadFile = (filePath) => {
    if (filePath) {
      window.open(filePath, "_blank");
    } else {
      alert("Tidak ada file yang diupload");
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-text">🔄 Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="navigation-controls">
        <button onClick={handleBack} className="nav-button btn-back">
          ← Kembali
        </button>
        <h1 className="absensi-header">
          📋 Submissions - {tugas?.judul_tugas || "Tugas"}
        </h1>
        <div style={{ width: "100px" }}></div>
      </div>

      {tugas && (
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #3b82f6",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>{tugas.judul_tugas}</h3>
          <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
            <strong>Mata Pelajaran:</strong> {tugas.mata_pelajaran}
          </p>
          <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
            <strong>Deadline:</strong>{" "}
            {new Date(tugas.deadline_datetime).toLocaleString()}
          </p>
          <p style={{ margin: "0", color: "#666" }}>
            <strong>Total Submissions:</strong> {submissions.length} siswa
          </p>
        </div>
      )}

      {selectedSubmission ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1.5rem",
            background: "#f9fafb",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ marginTop: 0 }}>✏️ Beri Nilai</h3>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ margin: "0 0 0.5rem 0" }}>
              {selectedSubmission.nama_siswa} - {selectedSubmission.kelas_siswa}
            </h4>

            {selectedSubmission.jawaban_text && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Jawaban Teks:</strong>
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedSubmission.jawaban_text}
                </div>
              </div>
            )}

            {selectedSubmission.file_path && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>File Jawaban:</strong>
                <div>
                  <button
                    onClick={() =>
                      handleDownloadFile(selectedSubmission.file_path)
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      border: "1px solid #3b82f6",
                      background: "transparent",
                      color: "#3b82f6",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "0.5rem",
                    }}
                  >
                    📎 Download File
                  </button>
                </div>
              </div>
            )}

            <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
              <strong>Dikumpulkan:</strong>{" "}
              {new Date(selectedSubmission.submitted_at).toLocaleString()}
            </p>
            <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
              <strong>Status:</strong> {selectedSubmission.status}
            </p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Nilai (0-100) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={gradingData.nilai}
              onChange={(e) =>
                setGradingData({
                  ...gradingData,
                  nilai: e.target.value,
                })
              }
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
              Catatan Guru
            </label>
            <textarea
              value={gradingData.catatan_guru}
              onChange={(e) =>
                setGradingData({
                  ...gradingData,
                  catatan_guru: e.target.value,
                })
              }
              rows="3"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              placeholder="Berikan catatan atau feedback untuk siswa..."
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleSubmitGrade}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ✅ Simpan Nilai
            </button>
            <button
              onClick={() => setSelectedSubmission(null)}
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
        </div>
      ) : (
        <div>
          {submissions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <h3>Belum ada submissions</h3>
              <p>Siswa belum mengumpulkan tugas ini</p>
            </div>
          ) : (
            <div>
              {submissions.map((submission) => (
                <div
                  key={submission.id}
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
                      <h4 style={{ margin: "0 0 0.5rem 0" }}>
                        {submission.nama_siswa}
                      </h4>
                      <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
                        Kelas: {submission.kelas_siswa}
                      </p>
                      <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
                        Dikumpulkan:{" "}
                        {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                      <p style={{ margin: "0 0 0.25rem 0", color: "#666" }}>
                        Status: {submission.status}
                      </p>

                      {submission.nilai_akhir && (
                        <div
                          style={{
                            background: "#d1fae5",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            marginTop: "0.5rem",
                          }}
                        >
                          <strong>Nilai: {submission.nilai_akhir}</strong>
                          {submission.catatan_guru && (
                            <p
                              style={{
                                margin: "0.25rem 0 0 0",
                                fontSize: "0.9rem",
                              }}
                            >
                              <em>{submission.catatan_guru}</em>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {submission.nilai_akhir ? (
                        <span
                          style={{
                            background: "#10b981",
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                          }}
                        >
                          ✅ Dinilai
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
                          📝 Perlu Dinilai
                        </span>
                      )}
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
                      onClick={() => handleGradeSubmission(submission)}
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #3b82f6",
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {submission.nilai_akhir ? "Edit Nilai" : "Beri Nilai"}
                    </button>

                    {submission.jawaban_text && (
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradingData({
                            nilai: submission.nilai_akhir || "",
                            catatan_guru: submission.catatan_guru || "",
                          });
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid #6b7280",
                          background: "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        👀 Lihat Jawaban
                      </button>
                    )}

                    {submission.file_path && (
                      <button
                        onClick={() => handleDownloadFile(submission.file_path)}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid #10b981",
                          background: "transparent",
                          color: "#10b981",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        📎 Download File
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

export default SubmissionList;
