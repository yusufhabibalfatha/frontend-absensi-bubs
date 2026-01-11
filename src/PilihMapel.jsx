import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import PilihKelas from "./components/PilihKelas";
import PilihMataPelajaran from "./components/PilihMataPelajaran";
import PilihGuru from "./components/PilihGuru";

export default function PilihMapel() {
  const [selectedClass, setSelectedClass] = useState(undefined);
  const [selectedSubject, setSelectedSubject] = useState(undefined);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);

  const navigate = useNavigate();

  function getAngkaKelas(text) {
    return Number(text.replace(/\D/g, ""));
  }

  function getTanggalHariIni() {
    const today = new Date();

    return today.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function pindahHalaman(
    navigate,
    { selectedClass, selectedSubject, selectedTeacher }
  ) {
    if (selectedClass && selectedSubject && selectedTeacher) {
      const dataAbsensi = {
        hari: getTanggalHariIni(),
        kelas: selectedClass,
        mapel: selectedSubject,
        guru: selectedTeacher,
      };
      navigate("/absen", { state: dataAbsensi });
    }
  }

  return (
    <div className="app">
      <h1>📚 Sistem Absensi Sekolah</h1>

      <button onClick={() => navigate("/")} className="btn-back-home">
        ← Kembali ke Beranda
      </button>

      <div className="components-container">
        <PilihKelas
          setSelectedClass={setSelectedClass}
          selectedClass={selectedClass}
        />

        <PilihMataPelajaran
          setSelectedSubject={setSelectedSubject}
          selectedSubject={selectedSubject}
          selectedClass={selectedClass}
        />

        <PilihGuru
          setSelectedTeacher={setSelectedTeacher}
          selectedTeacher={selectedTeacher}
          selectedSubject={selectedSubject}
        />

        {(selectedClass || selectedSubject || selectedTeacher) && (
          <div className="selection-preview">
            <h3>✅ Data yang Dipilih:</h3>
            <p>
              <strong>Kelas:</strong>{" "}
              {/* {selectedClass ? selectedClass.replace("_", " ") : "-"} */}
              {getAngkaKelas(selectedClass?.nama) || "-"}
            </p>

            <p>
              <strong>Mata Pelajaran:</strong> {selectedSubject?.nama || "-"}
            </p>
            <p>
              <strong>Guru Mata Pelajaran:</strong>{" "}
              {selectedTeacher?.nama || "-"}
            </p>

            <div className="navigation-section">
              <button
                className="navigation-button"
                onClick={() =>
                  pindahHalaman(navigate, {
                    selectedClass,
                    selectedSubject,
                    selectedTeacher,
                  })
                }
              >
                📋 Lanjut ke Absensi
              </button>
              <p className="navigation-hint">
                Klik untuk melanjutkan ke halaman absensi
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
