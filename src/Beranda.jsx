// Beranda.jsx
import { useNavigate } from 'react-router-dom';
import './style/styles.css';

function Beranda() {
  const navigate = useNavigate();

  const handleMasuk = () => {
    navigate('/pilih');
  };

  return (
    <div className="card">
      <div className="school-decoration">
        <div className="decoration-item">📚</div>
        <div className="decoration-item">✏️</div>
        <div className="decoration-item">🎓</div>
      </div>
      
      <h1>Selamat Datang di Aplikasi Sekolah</h1>
      <p>Platform digital untuk mendukung kegiatan belajar mengajar dengan fitur-fitur yang memudahkan siswa dan guru.</p>
      
      <div className="button-group">
        <button className="btn btn-primary" onClick={handleMasuk}>
          Absen Sekolah
        </button>
        
        {/* <button className="btn btn-secondary" disabled> */}
        <button className="btn btn-disabled" disabled>
          Absen Kegiatan
        </button>
        
        <button className="btn btn-disabled" disabled>
          Classroom
        </button>
      </div>
      
      <div style={{marginTop: '2rem', padding: '1rem', background: '#fef3c7', border: '3px solid #000', borderRadius: '8px'}}>
        <p style={{margin: 0, fontSize: '0.9rem', color: '#92400e'}}>
          <strong>Info:</strong> Fitur "Absen Kegiatan" dan "Classroom" sedang dalam pengembangan.
        </p>
      </div>
    </div>
  );
}

export default Beranda;