// App.jsx (tambahkan import dan routes baru)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PilihLayout from "./layouts/PilihLayout";
import AbsenLayout from "./layouts/AbsenLayout";
import PilihMapel from "./PilihMapel";
import AbsensiSiswa from "./AbsensiSiswa";
import BerandaLayout from "./layouts/BerandaLayout";
import Beranda from "./Beranda";
import PilihKegiatan from "./PilihKegiatan";
import PilihKelas from "./PilihKelas";
import PilihKamar from "./PilihKamar";
import AbsensiKegiatan from "./AbsensiKegiatan";
import Login from "./components/Login";
import DashboardGuru from "./components/DashboardGuru";
import DashboardSiswa from "./components/DashboardSiswa";
import ProtectedRoute from "./components/ProtectedRoute";
import PresensiSiswa from "./components/PresensiSiswa";
import "./style/styles.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman Beranda */}
        <Route path="/" element={<BerandaLayout />}>
          <Route index element={<Beranda />} />
        </Route>

        {/* Route untuk halaman Pilih Mapel */}
        <Route path="/pilih" element={<PilihLayout />}>
          <Route index element={<PilihMapel />} />
        </Route>

        {/* Route untuk halaman Absen Sekolah */}
        <Route path="/absen" element={<AbsenLayout />}>
          <Route index element={<AbsensiSiswa />} />
        </Route>

        {/* Route untuk halaman Absensi Kegiatan */}
        <Route path="/kegiatan" element={<BerandaLayout />}>
          <Route index element={<PilihKegiatan />} />
        </Route>

        <Route path="/kegiatan/kelas" element={<BerandaLayout />}>
          <Route index element={<PilihKelas />} />
        </Route>

        <Route path="/kegiatan/kamar" element={<BerandaLayout />}>
          <Route index element={<PilihKamar />} />
        </Route>

        <Route path="/kegiatan/absen" element={<AbsenLayout />}>
          <Route index element={<AbsensiKegiatan />} />
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
      </Routes>
    </Router>
  );
}

export default App;
