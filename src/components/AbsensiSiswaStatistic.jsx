function AbsensiSiswaStatistic({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "0.5rem",
        margin: "1.5rem 0",
      }}
    >
      <div
        style={{
          background: "#d1fae5",
          border: "2px solid #10b981",
          borderRadius: "8px",
          padding: "0.8rem",
          textAlign: "center",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", fontWeight: "800", color: "#065f46" }}
        >
          {stats.hadir}
        </div>
        <div
          style={{ fontSize: "0.7rem", fontWeight: "600", color: "#065f46" }}
        >
          ✅ Hadir
        </div>
      </div>
      <div
        style={{
          background: "#fef3c7",
          border: "2px solid #f59e0b",
          borderRadius: "8px",
          padding: "0.8rem",
          textAlign: "center",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", fontWeight: "800", color: "#92400e" }}
        >
          {stats.izin}
        </div>
        <div
          style={{ fontSize: "0.7rem", fontWeight: "600", color: "#92400e" }}
        >
          📋 Izin
        </div>
      </div>
      <div
        style={{
          background: "#fee2e2",
          border: "2px solid #ef4444",
          borderRadius: "8px",
          padding: "0.8rem",
          textAlign: "center",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", fontWeight: "800", color: "#991b1b" }}
        >
          {stats.sakit + stats.alpa}
        </div>
        <div
          style={{ fontSize: "0.7rem", fontWeight: "600", color: "#991b1b" }}
        >
          ❌ Tidak Hadir
        </div>
      </div>
      <div
        style={{
          background: "#faf7f5ff",
          border: "2px solid #987051ff",
          borderRadius: "8px",
          padding: "0.8rem",
          textAlign: "center",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", fontWeight: "800", color: "#b45309" }}
        >
          {stats.terlambat}
        </div>
        <div
          style={{ fontSize: "0.7rem", fontWeight: "600", color: "#b45309" }}
        >
          🐢 Terlambat
        </div>
      </div>
      <div
        style={{
          background: "#f3f4f6",
          border: "2px solid #6b7280",
          borderRadius: "8px",
          padding: "0.8rem",
          textAlign: "center",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", fontWeight: "800", color: "#374151" }}
        >
          {stats.belum}
        </div>
        <div
          style={{ fontSize: "0.7rem", fontWeight: "600", color: "#374151" }}
        >
          ⏳ Belum
        </div>
      </div>
    </div>
  );
}

export default AbsensiSiswaStatistic;
