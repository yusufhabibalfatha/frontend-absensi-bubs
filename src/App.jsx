import { Routes, Route } from "react-router-dom";
import BerandaLayout from "./layouts/BerandaLayout";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import DashboardGuru from "./components/DashboardGuru";
import DashboardSiswa from "./components/DashboardSiswa";
import ProtectedRoute from "./components/ProtectedRoute";
import PresensiSiswa from "./components/PresensiSiswa";
import RekapPresensiGuru from "./components/RekapPresensiGuru";
import TugasGuru from "./components/TugasGuru";
import MateriGuru from "./components/MateriGuru";
import TugasSiswa from "./components/TugasSiswa";
import MateriSiswa from "./components/MateriSiswa";
import SubmissionList from "./components/SubmissionList";
import PilihMapel from "./PilihMapel";
import AbsensiSiswa from "./AbsensiSiswa";
import Beranda from "./Beranda";
import PilihKegiatan from "./PilihKegiatan";
import PilihKelas from "./PilihKelas";
import PilihKamar from "./PilihKamar";
import AbsensiKegiatan from "./AbsensiKegiatan";
import DownloadQR from "./pages/Download-QR";
import "./style/styles.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BerandaLayout />}>
        <Route index element={<Beranda />} />
      </Route>

      <Route path="/pilih" element={<BerandaLayout />}>
        <Route index element={<PilihMapel />} />
      </Route>

      <Route path="/absen" element={<BerandaLayout />}>
        <Route index element={<AbsensiSiswa />} />
      </Route>

      <Route path="/kegiatan" element={<BerandaLayout />}>
        <Route index element={<PilihKegiatan />} />
      </Route>

      <Route path="/kegiatan/kelas" element={<BerandaLayout />}>
        <Route index element={<PilihKelas />} />
      </Route>

      <Route path="/kegiatan/kamar" element={<BerandaLayout />}>
        <Route index element={<PilihKamar />} />
      </Route>

      <Route path="/kegiatan/absen" element={<BerandaLayout />}>
        <Route index element={<AbsensiKegiatan />} />
      </Route>

      <Route path="/download-qr" element={<BerandaLayout />}>
        <Route index element={<DownloadQR />} />
      </Route>

      {/* Route untuk Classroom System */}
      <Route path="/login" element={<Login />} />

      <Route
        path="/classroom/guru"
        element={
          <ProtectedRoute role="GURU">
            <DashboardGuru />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classroom/siswa"
        element={
          <ProtectedRoute role="SISWA">
            <DashboardSiswa />
          </ProtectedRoute>
        }
      />

      <Route
        path="/presensi-siswa"
        element={
          <ProtectedRoute role="SISWA">
            <PresensiSiswa />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rekap-presensi-guru"
        element={
          <ProtectedRoute role="GURU">
            <RekapPresensiGuru />
          </ProtectedRoute>
        }
      />
      {/* ROUTES BARU UNTUK TUGAS & MATERI */}
      <Route
        path="/classroom/tugas-guru"
        element={
          <ProtectedRoute role="GURU">
            <TugasGuru />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classroom/materi-guru"
        element={
          <ProtectedRoute role="GURU">
            <MateriGuru />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classroom/tugas-siswa"
        element={
          <ProtectedRoute role="SISWA">
            <TugasSiswa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classroom/materi-siswa"
        element={
          <ProtectedRoute role="SISWA">
            <MateriSiswa />
          </ProtectedRoute>
        }
      />

      <Route
        path="/classroom/submissions/:id"
        element={
          <ProtectedRoute role="GURU">
            <SubmissionList />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
