function AbsensiSiswaButtonGroup({
  setIsScannerOpen,
  formData,
  setFormData,
  setScanMessage,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "1.5rem 0",
      }}
    >
      <button
        onClick={() => setIsScannerOpen(true)}
        className="submit-button"
        style={{
          background: "var(--primary-blue)",
          margin: "0.5rem",
        }}
      >
        📷 Scan QR Code Siswa
      </button>

      <button
        onClick={() => {
          const updatedData = formData.map((item) => ({
            ...item,
            status: null,
            keterangan: null,
          }));
          setFormData(updatedData);
          setScanMessage("🔄 Status semua siswa berhasil direset");
        }}
        className="submit-button"
        style={{
          background: "var(--accent-yellow)",
          color: "var(--black)",
          margin: "0.5rem",
        }}
      >
        🔄 Reset Semua
      </button>
    </div>
  );
}

export default AbsensiSiswaButtonGroup;
