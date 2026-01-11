function AbsensiSiswaEditingKeteranganModal({
  setEditingKeterangan,
  editingKeterangan,
  getKeteranganContoh,
  saveKeterangan,
}) {
  return (
    <div
      className="keterangan-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1001,
        padding: "1rem",
      }}
      onClick={(e) =>
        e.target === e.currentTarget && setEditingKeterangan(null)
      }
    >
      <div
        className="keterangan-editor"
        style={{
          background: "white",
          border: "3px solid #000",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "8px 8px 0px #000",
        }}
      >
        <h3
          style={{
            margin: "0 0 1rem 0",
            color: "#000",
            fontSize: "1.3rem",
            fontWeight: "800",
          }}
        >
          📝 Tambah Keterangan
        </h3>

        <p
          style={{
            margin: "0 0 1rem 0",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          Tambahkan keterangan untuk status{" "}
          <strong>{editingKeterangan.status}</strong>
        </p>

        <textarea
          value={editingKeterangan.keterangan}
          onChange={(e) =>
            setEditingKeterangan({
              ...editingKeterangan,
              keterangan: e.target.value,
            })
          }
          placeholder={`Contoh: ${getKeteranganContoh(
            editingKeterangan.status
          )}`}
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "0.8rem",
            border: "2px solid #000",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            resize: "vertical",
            marginBottom: "1rem",
          }}
          autoFocus
        />

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setEditingKeterangan(null)}
            style={{
              background: "#6b7280",
              color: "white",
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "0.6rem 1.2rem",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "2px 2px 0px #000",
            }}
          >
            Batal
          </button>

          <button
            onClick={saveKeterangan}
            style={{
              background: "#10b981",
              color: "white",
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "0.6rem 1.2rem",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "2px 2px 0px #000",
            }}
          >
            💾 Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default AbsensiSiswaEditingKeteranganModal;
