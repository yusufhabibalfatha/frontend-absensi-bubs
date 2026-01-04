// src/utils/pilihMapelUtils.js
import { jadwalSMP, jadwalSMA } from "../data/jadwal";

// 🔹 Ambil daftar mata pelajaran berdasarkan hari & sekolah
export function getSubjects(selectedDay, selectedSchool) {
  if (!selectedDay || !selectedSchool) return [];

  const allSubjects = [];
  const jadwal = selectedSchool === "SMP" ? jadwalSMP : jadwalSMA;

  Object.values(jadwal).forEach((kelas) => {
    if (kelas[selectedDay]) {
      allSubjects.push(...kelas[selectedDay]);
    }
  });

  return [...new Set(allSubjects)];
}

// 🔹 Ambil kelas yang memiliki mapel tertentu
export function getAvailableClasses(
  selectedDay,
  selectedSchool,
  selectedSubject
) {
  if (!selectedDay || !selectedSchool || !selectedSubject) return [];

  const availableClasses = [];
  const jadwal = selectedSchool === "SMP" ? jadwalSMP : jadwalSMA;

  Object.entries(jadwal).forEach(([className, schedule]) => {
    if (
      schedule[selectedDay] &&
      schedule[selectedDay].includes(selectedSubject)
    ) {
      availableClasses.push(className);
    }
  });

  return availableClasses;
}

// 🔹 Handler untuk navigasi ke halaman absen
export function pindahHalaman(
  navigate,
  { selectedDay, selectedSchool, selectedSubject, selectedClass }
) {
  if (selectedDay && selectedSchool && selectedSubject && selectedClass) {
    const dataAbsensi = {
      hari: selectedDay,
      sekolah: selectedSchool,
      mapel: selectedSubject,
      kelas: selectedClass,
    };
    navigate("/absen", { state: dataAbsensi });
  }
}

// 🔹 Handler navigasi kembali ke beranda
export function handleBackToHome(navigate) {
  navigate("/");
}
