import { useNavigate } from "react-router-dom";
import {
  handleMasuk,
  handleKegiatan,
  handleClassroom,
} from "./utility/BerandaUtility";
import "./style/styles.css";

export default function Beranda() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h1>Selamat Datang di Aplikasi Sekolah</h1>
      <SchoolList />

      <p>
        Platform digital untuk mendukung kegiatan belajar mengajar dengan
        fitur-fitur yang memudahkan siswa dan guru.
      </p>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={() => handleMasuk(navigate)}
        >
          Absen Sekolah
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => handleKegiatan(navigate)}
        >
          Absen Kegiatan
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => handleClassroom(navigate)}
        >
          Classroom
        </button>
      </div>
    </div>
  );
}

function SchoolList() {
  return (
    <div className="school-decoration">
      <div className="decoration-item">📚</div>
      <div className="decoration-item">✏️</div>
      <div className="decoration-item">🎓</div>
    </div>
  );
}
