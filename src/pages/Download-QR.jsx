import { useNavigate } from "react-router-dom";
import { handleBackToHome } from "../utility/pilihMapelUtils";

function DownloadQR() {
  const navigate = useNavigate();

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "https://apibubs.sdit.web.id/wp-json/absensi-bubs/v1/download-qr"
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.json();

      if (!data.success || !data.zip_path) {
        throw new Error("Zip path tidak ditemukan");
      }

      /**
       * zip_path dari backend:
       * /home/sditwebi/apibubs.sdit.web.id/wp-content/uploads/qr/qr.zip
       */

      // 1. Hilangkan server path
      const publicPath = data.zip_path.replace(/^\/home\/sditwebi\//, "");

      // 2. Tambahkan protocol
      const zipUrl = `https://${publicPath}`;

      // Trigger download
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = "qr.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
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
