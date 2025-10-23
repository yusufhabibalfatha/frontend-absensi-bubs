import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style/AbsensiSiswa.css';

const AbsensiSiswa = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState([]);
  const [guru, setGuru] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Scroll to top when component mounts or data loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (formData.length > 0 && containerRef.current) {
  //     containerRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [formData]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const params = new URLSearchParams({
        kelas: location.state.kelas,
        hari: location.state.hari,
        mapel: location.state.mapel,
      });

      const response = await fetch(
        // `http://absensi-bubs.local/wp-json/absensi-bubs/v1/jadwal-siswa?${params}`
        `https://apibubs.sdit.web.id/wp-json/absensi-bubs/v1/jadwal-siswa?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data');
      }

      const result = await response.json();
      setFormData(result.data);
      setGuru(result.kriteria.guru);
      
      // Scroll to top after data loads
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (id_siswa, newStatus) => {
    const updatedData = formData.map((item) => {
      if (item.id_siswa === id_siswa) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // const response = await fetch('http://absensi-bubs.local/wp-json/absensi-bubs/insert/absensi-sekolah', {
      const response = await fetch('https://apibubs.sdit.web.id/wp-json/absensi-bubs/insert/absensi-sekolah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan absensi');
      }

      setSuccessMessage('Absensi berhasil disimpan!');
      handleShare();
      // navigate('/')
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleShare = () => {
      const dataTambahan = {
        guruMapel: guru,
        kelas: location.state.kelas,
        hari: location.state.hari,
        mapel: location.state.mapel,
      };

      const today = new Date();
      const tanggalLengkap = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const groups = {
        Hadir: [],
        Izin: [],
        Sakit: [],
        Alpa: [],
      };

      formData.forEach((item) => {
        const status = item.status || "Lainnya";
        if (groups[status]) {
          groups[status].push(item.nama_lengkap);
        }
      });

      let message = `📅 *Rekap Absensi Siswa ${dataTambahan.kelas}*\n`;
      message += `*Tanggal:* ${tanggalLengkap}\n`;

      if (dataTambahan.guruMapel) {
        message += `*Guru Mapel:* ${dataTambahan.guruMapel}\n`;
      }
      if (dataTambahan.mapel) {
        message += `*Mapel:* ${dataTambahan.mapel}\n`;
      }

      message += `\n`;

      const order = ['Hadir', 'Izin', 'Sakit', 'Alpa'];
      order.forEach((kategori) => {
        const list = groups[kategori];
        if (list.length > 0) {
          let emoji = '📋';
          switch (kategori) {
            case 'Hadir': emoji = '✅'; break;
            case 'Izin': emoji = '📋'; break;
            case 'Sakit': emoji = '🤒'; break;
            case 'Alpa': emoji = '❌'; break;
          }

          message += `${emoji} *${kategori}*\n`;
          list.forEach((nama) => {
            message += `- ${nama}\n`;
          });
          message += `\n`;
        }
      });

      const summary = order.map(kategori => {
        const count = groups[kategori].length;
        return `${kategori}: ${count}`;
      }).join(' | ');

      message += `📊 *Ringkasan:*\n${summary}`;

      // ✅ Ganti URL WhatsApp & gunakan redirect langsung
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappUrl;
    };


  const handleBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  const handleForward = () => {
    navigate(1); // Maju ke halaman berikutnya (jika ada)
  };

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div className="absensi-container" ref={containerRef}>
      {/* Navigation Controls */}
      <div className="navigation-controls">
        <button 
          onClick={handleBack}
          className="nav-button btn-back"
          title="Kembali ke halaman sebelumnya"
        >
          ← Kembali
        </button>
        
        <h1 className="absensi-header">📋 Absensi Siswa</h1>
        
        <button 
          onClick={handleForward}
          className="nav-button btn-forward"
          title="Maju ke halaman berikutnya"
          disabled
        >
          Maju →
        </button>
      </div>

      {/* Info Card */}
      <div className="info-card">
        <div className="info-item">
          <div className="info-icon">📅</div>
          <div className="info-content">
            <div className="info-label">Hari</div>
            <div className="info-value">{location.state?.hari || '-'}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">📚</div>
          <div className="info-content">
            <div className="info-label">Mata Pelajaran</div>
            <div className="info-value">{location.state?.mapel || '-'}</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">🏫</div>
          <div className="info-content">
            <div className="info-label">Kelas</div>
            <div className="info-value">{location.state?.kelas || '-'}</div>
          </div>
        </div>

        <div className="info-item teacher-info">
          <div className="info-icon">👨‍🏫</div>
          <div className="info-content">
            <div className="info-label">Guru Pengajar</div>
            <div className="info-value">{guru || 'Loading...'}</div>
          </div>
          <span className="status-badge status-active">Active</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-text loading-pulse">
          🔄 Sedang memuat data siswa...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          ❌ {error}
          <button onClick={handleRetry} className="retry-button" style={{marginLeft: '1rem'}}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && formData.length === 0 && (
        <div className="empty-state">
          <p>📭 Tidak ada data siswa ditemukan</p>
          <button onClick={handleRetry} className="retry-button">
            Muat Ulang Data
          </button>
        </div>
      )}

      {/* Form Absensi */}
      {formData.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div style={{marginTop: '2rem'}}>
            <h2 style={{
              color: '#000',
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              👥 Daftar Siswa - {formData.length} Siswa
            </h2>
            
            {formData.map((siswa) => (
              <div key={siswa.id_siswa} className="siswa-card">
                <p className="siswa-nama">{siswa.nama_lengkap}</p>
                <div className="status-options">
                  {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((statusOption) => (
                    <label 
                      key={statusOption} 
                      className={`status-option status-${statusOption.toLowerCase()}`}
                    >
                      <input
                        type="radio"
                        name={`status-${siswa.id_siswa}`}
                        value={statusOption}
                        checked={siswa.status === statusOption}
                        onChange={(e) => handleStatusChange(siswa.id_siswa, e.target.value)}
                        className="status-radio"
                      />
                      {statusOption}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={submitLoading}
              className="submit-button"
            >
              {submitLoading ? '💾 Menyimpan...' : '📤 Bagikan ke WhatsApp'}
            </button>
            
            {/* <button 
              type="button" 
              onClick={handleShare}
              className="share-button"
            >
              📤 Bagikan ke WhatsApp
            </button> */}
          </div>
        </form>
      )}
    </div>
  );
};

export default AbsensiSiswa;