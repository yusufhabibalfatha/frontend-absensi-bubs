import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './style/AbsensiSiswa.css'; // Import file CSS

const AbsensiSiswa = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState([]);
  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        kelas: location.state.kelas,
        hari: location.state.hari,
        mapel: location.state.mapel,
      });

      const response = await fetch(
        `http://absensi-bubs.local/wp-json/absensi-bubs/v1/jadwal-siswa?${params}`
      );

      console.log('params ', params)
      console.log('data absensi ', location.state)

      if (!response.ok) {
        throw new Error('Gagal mengambil data');
      }

      const result = await response.json();

      console.log('result ', result)
      setFormData(result.data);
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
      const response = await fetch('http://absensi-bubs.local/wp-json/absensi-bubs/insert/absensi-sekolah', {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleShare = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let message = `📅 Rekap Absensi Hari Ini - ${today}\n\n`;

    console.log('data ke wa ', formData)

    formData.forEach((item, index) => {
      message += `${index + 1}. ${item.nama_lengkap} - ${item.status}\n`;
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="absensi-container">
      <h1 className="absensi-header">Sistem Absensi Siswa</h1>

      {loading && <p className="loading-text loading-pulse">Sedang memuat data...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {formData && formData.map((siswa) => (
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

        {formData.length > 0 && (
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={submitLoading}
              className="submit-button"
            >
              {submitLoading ? 'Menyimpan...' : 'Simpan Absensi'}
            </button>
            
            <button 
              type="button" 
              onClick={handleShare}
              className="share-button"
            >
              📤 Bagikan ke WhatsApp
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AbsensiSiswa;