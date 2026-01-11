import { useEffect, useState } from "react";

function PilihJenjangSekolah({ setSelectedSchool, selectedSchool }) {
  const [schools, setSchools] = useState(undefined);

  const fetchJenjangSekolah = async () => {
    try {
      const url = `${import.meta.env.VITE_NEW_API_URL}/jenjang_sekolah.php`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status) {
        alert("Gagal mengambil data jenjang sekolah");
        return;
      }

      setSchools(data.data);
      // onFetchJenjangSekolah(data.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    }
  };

  useEffect(() => {
    fetchJenjangSekolah();
  }, []);

  return (
    <div className="component">
      <h2>1. Pilih Jenjang Sekolah</h2>

      <div className="school-grid">
        {schools &&
          schools.map((school) => (
            <button
              key={school.id}
              className={`school-button ${
                selectedSchool === school ? "selected" : ""
              } `}
              onClick={() => setSelectedSchool(school)}
            >
              {school.nama}
            </button>
          ))}
      </div>
    </div>
  );
}

export default PilihJenjangSekolah;
