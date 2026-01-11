import { useEffect, useState } from "react";

function PilihGuru({ setSelectedTeacher, selectedTeacher, selectedSubject }) {
  const [teacher, setTeacher] = useState(undefined);

  const fetchGuru = async () => {
    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/guru_sekolah.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        alert("Gagal mengambil data guru sekolah");
        return;
      }

      setTeacher(data.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  return (
    <div className="component">
      <h2>3. Pilih Guru Mata Pelajaran</h2>

      {selectedSubject && (
        <div className="subject-grid">
          {teacher &&
            teacher.map((teacherEach) => (
              <button
                key={teacherEach.id}
                className={`day-button ${
                  selectedTeacher === teacherEach ? "selected" : ""
                } `}
                onClick={() => setSelectedTeacher(teacherEach)}
              >
                {teacherEach.nama}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default PilihGuru;
