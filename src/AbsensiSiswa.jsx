import React, { useState, useEffect } from 'react';

const AbsensiSiswa = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // loading submit
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState([]);

  const [inputKelas, setInputKelas] = useState('Kelas 7');
  const [inputHari, setInputHari] = useState('Sabtu');
  const [inputMapel, setInputMapel] = useState('Informatika');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        kelas: inputKelas,
        hari: inputHari,
        mapel: inputMapel,
      });

      const response = await fetch(
        `http://absensi-bubs.local/wp-json/absensi-bubs/v1/jadwal-siswa?${params}`
      );

      if (!response.ok) {
        throw new Error('Gagal mengambil data');
      }

      const result = await response.json();
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
    e.preventDefault(); // prevent reload
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://absensi-bubs.local/wp-json/absensi-bubs/insert/absensi-sekolah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Kirim seluruh formData
      });

      const result = await response.json();

      console.log('data kirim ', formData)
      console.log('response backend ', result)

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

    formData.forEach((item, index) => {
      message += `${index + 1}. ${item.nama_lengkap} - ${item.status}\n`;
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <h1>Sistem Absensi Siswa</h1>

      {loading && <p>Sedang memuat data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {formData && formData.map((siswa) => (
          <div key={siswa.id_siswa} style={{ marginBottom: '1rem' }}>
            <p>{siswa.nama_lengkap}</p>
            {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((statusOption) => (
              <label key={statusOption} style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name={`status-${siswa.id_siswa}`}
                  value={statusOption}
                  checked={siswa.status === statusOption}
                  onChange={(e) => handleStatusChange(siswa.id_siswa, e.target.value)}
                />
                {statusOption}
              </label>
            ))}
          </div>
        ))}

        {formData.length > 0 && (
          <button type="submit" disabled={submitLoading}>
            {submitLoading ? 'Menyimpan...' : 'Simpan Absensi'}
          </button>
        )}
      </form>

      <button onClick={handleShare}>
        📤 Bagikan ke WhatsApp
      </button>
    </div>
  );
};

export default AbsensiSiswa;
