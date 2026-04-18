import { useNavigate } from "react-router-dom";
import "./style/styles.css";
import VersionApp from "./components/VersionApp";

export default function Beranda() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <HeadBeranda />

      <div className="button-group">
        <button className="btn btn-primary" onClick={() => navigate("/pilih")}>
          Absen Sekolah
        </button>
        <a
          className="btn btn-secondary"
          href="https://php.bubstarakan.com/absen-guru"
        >
          Absen Guru
        </a>

        <button
          disabled
          className="btn btn-disabled"
          onClick={() => navigate("/kegiatan")}
        >
          Absen Kegiatan
        </button>

        <button
          disabled
          className="btn btn-secondary"
          onClick={() => navigate("/login")}
        >
          Classroom
        </button>

        <button
          disabled
          onClick={() => navigate("/download-qr")}
          className="btn btn-disabled"
        >
          QR Code Siswa
        </button>
      </div>
      <VersionApp />
    </div>
  );
}

function HeadBeranda() {
  return (
    <>
      <h1>Selamat Datang di Aplikasi Sekolah</h1>

      <div className="school-decoration">
        <div className="decoration-item">📚</div>
        <div className="decoration-item">✏️</div>
        <div className="decoration-item">🎓</div>
      </div>
      <p>
        Platform digital untuk mendukung kegiatan belajar mengajar dengan
        fitur-fitur yang memudahkan siswa dan guru.
      </p>
    </>
  );
}
