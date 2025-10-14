import React, { useEffect, useState } from 'react';

export default function AbsensiSekolahRekap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://absensi-bubs.local/wp-json/bubs/absen/hariini')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleShare = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let message = `📅 Rekap Absensi Hari Ini - ${today}\n\n`;

    data.forEach((item, index) => {
      message += `${index + 1}. ${item.nama_pengguna} - ${item.nama_kelas} - ${item.status}\n`;
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Absensi Sekolah Rekap</h2>
      <p>Halaman ini menampilkan rekap absensi sekolah hari ini.</p>

      {loading && <p>Memuat data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <button onClick={handleShare} style={buttonStyle}>
            📤 Bagikan ke WhatsApp
          </button>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Kelas</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Metode</th>
                <th style={thStyle}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.absensi_id}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{item.nama_pengguna}</td>
                  <td style={tdStyle}>{item.email}</td>
                  <td style={tdStyle}>{item.nama_kelas}</td>
                  <td style={tdStyle}>{item.status}</td>
                  <td style={tdStyle}>{item.metode}</td>
                  <td style={tdStyle}>{item.waktu_input}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// Styling
const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#25D366',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  marginBottom: '15px'
};
