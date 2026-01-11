function AbsensiSiswaInfoCard({ location, materi, setMateriModal }) {
  return (
    <div className="info-card">
      <div className="info-item">
        <div className="info-icon">📅</div>
        <div className="info-content">
          <div className="info-label">Hari</div>
          <div className="info-value">{location.state?.hari || "-"}</div>
        </div>
      </div>

      <div className="info-item">
        <div className="info-icon">📚</div>
        <div className="info-content">
          <div className="info-label">Mata Pelajaran</div>
          <div className="info-value">{location.state?.mapel.nama || "-"}</div>
        </div>
      </div>

      <div className="info-item">
        <div className="info-icon">🏫</div>
        <div className="info-content">
          <div className="info-label">Kelas</div>
          <div className="info-value">{location.state?.kelas.nama || "-"}</div>
        </div>
      </div>

      <div className="info-item ">
        <div className="info-icon">📖</div>
        <div className="info-content">
          <div className="info-label">Materi</div>
          <div className="info-value">{materi || "..."}</div>
        </div>
        <span
          className="btn-back-home"
          style={{ backgroundColor: "coral" }}
          onClick={() => setMateriModal(true)}
        >
          {materi == undefined || materi === ""
            ? "Tambah Materi ➕"
            : "Edit Materi ✍️"}
        </span>
      </div>

      <div className="info-item teacher-info">
        <div className="info-icon">👨‍🏫</div>
        <div className="info-content">
          <div className="info-label">Guru Pengajar</div>
          <div className="info-value">
            {location.state?.guru.nama || "Loading..."}
          </div>
        </div>
        <span className="status-badge status-active">Active</span>
      </div>
    </div>
  );
}

export default AbsensiSiswaInfoCard;
