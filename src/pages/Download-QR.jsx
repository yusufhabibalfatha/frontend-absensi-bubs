import { useNavigate } from "react-router-dom";
import { handleBackToHome } from "../utility/pilihMapelUtils";

function DownloadQR() {
  const navigate = useNavigate();

  const handleDownload = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/download-qr`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      if (!data.success || !data.zip_path) {
        throw new Error("Zip URL tidak ditemukan");
      }

      const a = document.createElement("a");
      a.href = data.zip_path;
      a.download = "qr.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Gagal mendownload QR");
    }
  };

  return (
    <div className="card">
      <button
        onClick={() => handleBackToHome(navigate)}
        className="btn-back-home"
      >
        ← Kembali ke Beranda
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Silahkan klik tombol dibawah untuk mengunduh file QR Code.</h2>
        <p>
          File yang diunduh adalah file ZIP yang berisi QR Code dalam format
          PNG.
        </p>

        {/* button download qr code */}
        <button className="btn btn-primary" onClick={handleDownload}>
          💾 Download QR Codes
        </button>
      </div>
    </div>
  );
}

export default DownloadQR;
