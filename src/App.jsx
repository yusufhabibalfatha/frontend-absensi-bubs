// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PilihLayout from './layouts/PilihLayout';
import AbsenLayout from './layouts/AbsenLayout';
import PilihMapel from './PilihMapel';
import AbsensiSiswa from './AbsensiSiswa';
import BerandaLayout from './layouts/BerandaLayout';
import Beranda from './Beranda'
import './style/styles.css'; // Import CSS global

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman Beranda*/}
        <Route path="/" element={<BerandaLayout />}>
          <Route index element={<Beranda />} />
        </Route>

        {/* Route untuk halaman Pilih */}
        <Route path="/pilih" element={<PilihLayout />}>
          <Route index element={<PilihMapel />} />
        </Route>

        {/* Route untuk halaman Absen */}
        <Route path="/absen" element={<AbsenLayout />}>
          <Route index element={<AbsensiSiswa />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;