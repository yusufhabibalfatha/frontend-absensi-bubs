import { useNavigate } from "react-router-dom";

useNavigate;
function AbsensiSiswaNavigationControl() {
  const navigate = useNavigate();

  return (
    <div className="navigation-controls">
      <button
        onClick={() => navigate("/pilih")}
        className="nav-button btn-back"
      >
        ← Kembali
      </button>

      <h1 className="absensi-header">📋 Absensi Siswa</h1>
      <div style={{ width: "100px" }}></div>
    </div>
  );
}

export default AbsensiSiswaNavigationControl;
