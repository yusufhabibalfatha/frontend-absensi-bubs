import { useEffect, useState } from "react";

function PilihMataPelajaran({
  setSelectedSubject,
  selectedSubject,
  selectedClass,
}) {
  const [subjectSchool, setSubjectSchool] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMataPelajaran = async () => {
    setLoading(true);
    setError(false);

    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/mata_pelajaran.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        setError(true);
        return;
      }

      setSubjectSchool(data.data);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMataPelajaran();
  }, []);

  return (
    <div className="component">
      <h2>2. Pilih Mata Pelajaran</h2>

      {selectedClass && (
        <>
          {loading && (
            <p className="try">
              ⏳ Mengambil data mata pelajaran...
              <button
                className="retry-btn"
                onClick={fetchMataPelajaran}
                style={{ marginLeft: "10px" }}
              >
                Retry
              </button>
            </p>
          )}

          {error && (
            <p className="try">
              ❌ Gagal mengambil data mata pelajaran
              <button
                className="retry-btn"
                onClick={fetchMataPelajaran}
                style={{ marginLeft: "10px" }}
              >
                Coba Lagi
              </button>
            </p>
          )}

          {!loading && !error && (
            <div className="button-grid">
              {subjectSchool &&
                subjectSchool.map((subjectEach) => (
                  <button
                    key={subjectEach.id}
                    className={`subject-button ${
                      selectedSubject === subjectEach ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSubject(subjectEach)}
                  >
                    {subjectEach.nama}
                  </button>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PilihMataPelajaran;
