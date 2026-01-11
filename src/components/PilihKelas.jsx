import { useEffect, useState } from "react";

function PilihKelas({ setSelectedClass, selectedClass }) {
  const [classSchool, setClassSchool] = useState(undefined);

  const fetchKelasSekolah = async () => {
    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/kelas_sekolah.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        alert("Gagal mengambil data kelas sekolah");
        return;
      }

      setClassSchool(data.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    }
  };

  useEffect(() => {
    fetchKelasSekolah();
  }, []);

  return (
    <div className="component">
      <h2>1. Pilih Kelas</h2>

      <div className="button-grid">
        {classSchool &&
          classSchool.map((classEach) => (
            <button
              key={classEach.id}
              className={`class-button ${
                selectedClass === classEach ? "selected" : ""
              } `}
              onClick={() => setSelectedClass(classEach)}
            >
              {classEach.nama}
            </button>
          ))}
      </div>
    </div>
  );
}

export default PilihKelas;
