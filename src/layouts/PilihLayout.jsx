// layouts/PilihLayout.jsx
import { Outlet } from 'react-router-dom';

const PilihLayout = () => {
  return (
    <div className="pilih-layout">
      {/* Layout khusus untuk halaman "Pilih Mapel" */}
      <Outlet />
    </div>
  );
};

export default PilihLayout;
