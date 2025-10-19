// layouts/BerandaLayout.jsx
import { Outlet } from 'react-router-dom';
import '../style/styles.css';

const BerandaLayout = () => {
  return (
    <div className="beranda-layout">
      <Outlet />
    </div>
  );
};

export default BerandaLayout;