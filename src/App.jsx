// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PilihMapel from './PilihMapel';
import AbsensiSiswa from './AbsensiSiswa';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/pilih">Pilih Mapel</Link></li>
            <li><Link to="/absen">Absensi Siswa</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/pilih" element={<PilihMapel />} />
          <Route path="/absen" element={<AbsensiSiswa />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
