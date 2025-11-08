import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSubjects,
  getAvailableClasses,
  pindahHalaman,
  handleBackToHome,
} from "./utility/pilihMapelUtils";
import "./App.css";

export default function PilihMapel() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const navigate = useNavigate();

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const schools = ["SMP", "SMA"];

  // handler lokal (khusus untuk update state)
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSchool(null);
    setSelectedSubject(null);
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSelectedSubject(null);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
  };

  // Auto-select kelas jika hanya ada satu
  const availableClasses = getAvailableClasses(
    selectedDay,
    selectedSchool,
    selectedSubject
  );
  if (availableClasses.length === 1 && !selectedClass) {
    setSelectedClass(availableClasses[0]);
  }

  return (
    <div className="app">
      <h1>📚 Sistem Absensi Sekolah</h1>

      <button
        onClick={() => handleBackToHome(navigate)}
        className="btn-back-home"
      >
        ← Kembali ke Beranda
      </button>

      <div className="components-container">
        {PilihHari()}
        {PilihSekolah()}
        {selectedSchool && PilihMataPelajaran()}
        {selectedSubject && PilihKelasBerdasarkanMapel()}

        {(selectedDay ||
          selectedSchool ||
          selectedSubject ||
          selectedClass) && (
          <div className="selection-preview">
            <h3>✅ Data yang Dipilih:</h3>
            <p>
              <strong>Hari:</strong> {selectedDay || "-"}
            </p>
            <p>
              <strong>Sekolah:</strong> {selectedSchool || "-"}
            </p>
            <p>
              <strong>Mata Pelajaran:</strong> {selectedSubject || "-"}
            </p>
            <p>
              <strong>Kelas:</strong>{" "}
              {selectedClass ? selectedClass.replace("_", " ") : "-"}
            </p>

            {selectedDay &&
              selectedSchool &&
              selectedSubject &&
              selectedClass && (
                <div className="navigation-section">
                  <button
                    className="navigation-button"
                    onClick={() =>
                      pindahHalaman(navigate, {
                        selectedDay,
                        selectedSchool,
                        selectedSubject,
                        selectedClass,
                      })
                    }
                  >
                    📋 Lanjut ke Absensi
                  </button>
                  <p className="navigation-hint">
                    Klik untuk melanjutkan ke halaman absensi
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );

  // --- Komponen kecil (bisa dipisah juga nanti kalau mau) ---
  function PilihHari() {
    return (
      <div className="component">
        <h2>1. Pilih Hari</h2>
        <div className="button-grid">
          {days.map((day) => (
            <button
              key={day}
              className={`day-button ${selectedDay === day ? "selected" : ""}`}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function PilihSekolah() {
    return (
      <div className="component">
        <h2>2. Pilih Jenjang Sekolah</h2>
        <div className="school-grid">
          {schools.map((school) => (
            <button
              key={school}
              className={`school-button ${
                selectedSchool === school ? "selected" : ""
              } ${!selectedDay ? "disabled" : ""}`}
              onClick={() => handleSchoolSelect(school)}
              disabled={!selectedDay}
            >
              {school}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function PilihMataPelajaran() {
    return (
      <div className="component">
        <h2>3. Pilih Mata Pelajaran Hari {selectedDay}</h2>
        <div className="subject-grid">
          {getSubjects(selectedDay, selectedSchool).map((subject, index) => (
            <button
              key={index}
              className={`subject-button ${
                selectedSubject === subject ? "selected" : ""
              }`}
              onClick={() => handleSubjectSelect(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function PilihKelasBerdasarkanMapel() {
    return (
      <div className="component">
        <h2>4. Pilih Kelas Mapel {selectedSubject}</h2>
        <div className="class-grid">
          {availableClasses.map((className, index) => (
            <button
              key={index}
              className={`class-button ${
                selectedClass === className ? "selected" : ""
              }`}
              onClick={() => handleClassSelect(className)}
            >
              {className.replace("_", " ")}
            </button>
          ))}
        </div>

        {availableClasses.length === 1 && (
          <p className="auto-selected-text">
            ✅ {availableClasses[0].replace("_", " ")} otomatis dipilih
          </p>
        )}
      </div>
    );
  }
}
