import { useEffect, useState } from "react";

function PilihKelas({ setSelectedClass, selectedClass }) {
  const [classSchool, setClassSchool] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchKelasSekolah = async () => {
    setLoading(true);
    setError(false);

    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/kelas_sekolah.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        setError(true);
        return;
      }

      setClassSchool(data.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelasSekolah();
  }, []);

  return (
    <div className="component">
      <h2>1. Pilih Kelas</h2>

      {loading && (
        <p className="try">
          ⏳ Mengambil data kelas...
          <button onClick={fetchKelasSekolah} className="retry-btn">
            Retry
          </button>
        </p>
      )}

      {error && (
        <p className="try">
          ❌ Gagal mengambil data kelas
          <button onClick={fetchKelasSekolah} className="retry-btn">
            Coba Lagi
          </button>
        </p>
      )}

      {!loading && !error && (
        <div className="button-grid">
          {classSchool.map((classEach) => (
            <button
              key={classEach.id}
              className={`class-button ${
                selectedClass === classEach ? "selected" : ""
              }`}
              onClick={() => setSelectedClass(classEach)}
            >
              {classEach.nama}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PilihKelas;
