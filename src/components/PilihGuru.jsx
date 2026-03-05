import { useEffect, useState } from "react";

function PilihGuru({ setSelectedTeacher, selectedTeacher, selectedSubject }) {
  const [teacher, setTeacher] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuru = async () => {
    setLoading(true);
    setError(false);

    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/guru_sekolah.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        setError(true);
        return;
      }

      setTeacher(data.data);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  return (
    <div className="component">
      <h2>3. Pilih Guru Mata Pelajaran</h2>

      {selectedSubject && (
        <>
          {loading && (
            <p className="try">
              ⏳ Mengambil data guru...
              <button
                className="retry-btn"
                onClick={fetchGuru}
                style={{ marginLeft: "10px" }}
              >
                Retry
              </button>
            </p>
          )}

          {error && (
            <p className="try">
              ❌ Gagal mengambil data guru
              <button
                className="retry-btn"
                onClick={fetchGuru}
                style={{ marginLeft: "10px" }}
              >
                Coba Lagi
              </button>
            </p>
          )}

          {!loading && !error && (
            <div className="subject-grid">
              {teacher &&
                teacher.map((teacherEach) => (
                  <button
                    key={teacherEach.id}
                    className={`day-button ${
                      selectedTeacher === teacherEach ? "selected" : ""
                    }`}
                    onClick={() => setSelectedTeacher(teacherEach)}
                  >
                    {teacherEach.nama}
                  </button>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PilihGuru;
