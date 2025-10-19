// layouts/AbsenLayout.jsx
import { Outlet } from 'react-router-dom';

const AbsenLayout = () => {
  return (
    <div className="absen-layout">
      {/* Layout khusus untuk halaman "Absensi Siswa" */}
      <Outlet />
    </div>
  );
};

export default AbsenLayout;
