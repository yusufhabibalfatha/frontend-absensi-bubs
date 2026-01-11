import { useEffect, useState } from "react";

function PilihMataPelajaran({
  setSelectedSubject,
  selectedSubject,
  selectedClass,
}) {
  const [subjectSchool, setSubjectSchool] = useState(undefined);

  const fetchMataPelajaran = async () => {
    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/mata_pelajaran.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        alert("Gagal mengambil data mata pelajaran sekolah");
        return;
      }

      setSubjectSchool(data.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    }
  };

  useEffect(() => {
    fetchMataPelajaran();
  }, []);

  return (
    <div className="component">
      <h2>2. Pilih Mata Pelajaran</h2>

      {selectedClass && (
        <div className="button-grid">
          {subjectSchool &&
            subjectSchool.map((subjectEach) => (
              <button
                key={subjectEach.id}
                className={`subject-button ${
                  selectedSubject === subjectEach ? "selected" : ""
                } `}
                onClick={() => setSelectedSubject(subjectEach)}
              >
                {subjectEach.nama}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default PilihMataPelajaran;
