import React, { useState } from 'react';
import './App.css';
import { jadwalSMP, jadwalSMA } from './data/jadwal';

const PilihMapel = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null); // NEW STATE

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const schools = ['SMP', 'SMA'];

  const pindahHalaman = () => {
    
  }

  const getSubjects = () => {
    if (!selectedDay || !selectedSchool) return [];
    
    if (selectedSchool === 'SMP') {
      // Untuk SMP, kita gabungkan semua kelas dan ambil unique subjects
      const allSubjects = [];
      Object.values(jadwalSMP).forEach(kelas => {
        if (kelas[selectedDay]) {
          allSubjects.push(...kelas[selectedDay]);
        }
      });
      return [...new Set(allSubjects)];
    } else {
      // return [...new Set(jadwalSMA.kelas_X[selectedDay])];
      // Untuk SMA, kita gabungkan semua kelas dan ambil unique subjects
      const allSubjects = [];
      Object.values(jadwalSMA).forEach(kelas => {
        if (kelas[selectedDay]) {
          allSubjects.push(...kelas[selectedDay]);
        }
      });
      return [...new Set(allSubjects)];
    }
  };

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
    // Di sini nanti akan navigasi ke halaman absensi
    console.log('Data yang dipilih:', {
      hari: selectedDay,
      sekolah: selectedSchool,
      mapel: subject
    });
  };

  const getAvailableClasses = () => {
    if (!selectedDay || !selectedSchool || !selectedSubject) return [];
    
    const availableClasses = [];
    
    if (selectedSchool === 'SMP') {
      Object.entries(jadwalSMP).forEach(([className, schedule]) => {
        if (schedule[selectedDay] && schedule[selectedDay].includes(selectedSubject)) {
          availableClasses.push(className);
        }
      });
    } else {
      Object.entries(jadwalSMA).forEach(([className, schedule]) => {
        if (schedule[selectedDay] && schedule[selectedDay].includes(selectedSubject)) {
          availableClasses.push(className);
        }
      });
    }
    
    return availableClasses;
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    // Di sini nanti akan navigasi ke halaman absensi dengan data lengkap
    console.log('Data lengkap yang dipilih:', {
      hari: selectedDay,
      sekolah: selectedSchool,
      mapel: selectedSubject,
      kelas: className
    });
  };

  // Auto-select jika hanya ada satu kelas
  const availableClasses = getAvailableClasses();
  if (availableClasses.length === 1 && !selectedClass) {
    setSelectedClass(availableClasses[0]);
  }

  return (
    <div className="app">
      <h1>📚 Sistem Absensi Sekolah</h1>
      
      <div className="components-container">
        {/* Komponen 1: Pilih Hari */}
        <div className="component">
          <h2>1. Pilih Hari</h2>
          <div className="button-grid">
            {days.map(day => (
              <button
                key={day}
                className={`day-button ${selectedDay === day ? 'selected' : ''}`}
                onClick={() => handleDaySelect(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Komponen 2: Pilih Sekolah */}
        <div className="component">
          <h2>2. Pilih Jenjang Sekolah</h2>
          <div className="school-grid">
            {schools.map(school => (
              <button
                key={school}
                className={`school-button ${selectedSchool === school ? 'selected' : ''} ${
                  !selectedDay ? 'disabled' : ''
                }`}
                onClick={() => handleSchoolSelect(school)}
                disabled={!selectedDay}
              >
                {school}
              </button>
            ))}
          </div>
        </div>

        {/* Komponen 3: Pilih Mata Pelajaran */}
        {selectedSchool && (
          <div className="component">
            <h2>3. Pilih Mata Pelajaran - {selectedDay}</h2>
            <div className="subject-grid">
              {getSubjects().map((subject, index) => (
                <button
                  key={index}
                  className={`subject-button ${selectedSubject === subject ? 'selected' : ''}`}
                  onClick={() => handleSubjectSelect(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && (
          <div className="component">
            <h2>4. Pilih Kelas - {selectedSubject}</h2>
            <div className="class-grid">
              {getAvailableClasses().map((className, index) => (
                <button
                  key={index}
                  className={`class-button ${selectedClass === className ? 'selected' : ''}`}
                  onClick={() => handleClassSelect(className)}
                >
                  {className.replace('_', ' ')}
                </button>
              ))}
            </div>
            
            {/* Auto-select notification */}
            {getAvailableClasses().length === 1 && (
              <p style={{ textAlign: 'center', color: '#27ae60', fontStyle: 'italic', marginTop: '10px' }}>
                ✅ Kelas {getAvailableClasses()[0].replace('_', ' ')} otomatis dipilih
              </p>
            )}
          </div>
        )}

        {/* Preview Data yang Dipilih */}
        {(selectedDay || selectedSchool || selectedSubject || selectedClass) && (
          <div className="selection-preview">
            <h3>✅ Data yang Dipilih:</h3>
            <p><strong>Hari:</strong> {selectedDay || '-'}</p>
            <p><strong>Sekolah:</strong> {selectedSchool || '-'}</p>
            <p><strong>Mata Pelajaran:</strong> {selectedSubject || '-'}</p>
            <p><strong>Kelas:</strong> {selectedClass ? selectedClass.replace('_', ' ') : '-'}</p>
            {selectedClass && (
              <p onClick={pindahHalaman} style={{ marginTop: '10px', fontStyle: 'italic', color: '#27ae60' }}>
                Klik untuk lanjut ke halaman absensi...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PilihMapel;