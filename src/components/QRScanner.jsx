// components/QRScanner.jsx
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ isOpen, onClose, onScan, onError }) => {
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        startScanner();
      }, 100);
    } else {
      stopScanner();
      setScanResult(null);
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    if (!scannerRef.current) {
      console.error("Scanner ref not found");
      return;
    }

    if (html5QrcodeScannerRef.current) {
      await stopScanner();
    }

    setIsScanning(true);
    setCameraError(null);
    setScanResult(null);

    try {
      await testCameraAccess();

      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        "qr-scanner",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          supportedScanTypes: [],
        },
        false
      );

      html5QrcodeScannerRef.current.render(
        (decodedText) => {
          console.log("QR Code detected:", decodedText);

          const nik = extractNIKFromQR(decodedText);

          if (nik) {
            handleSuccessfulScan(nik);
          } else {
            handleFailedScan(
              "QR Code tidak valid. Format harus berupa URL yang berisi NIK 16 digit."
            );
          }
        },
        (errorMessage) => {
          if (
            !errorMessage.includes("No MultiFormat Readers") &&
            !errorMessage.includes("NotFoundException")
          ) {
            console.log("Scan error (non-fatal):", errorMessage);
          }
        }
      );
    } catch (error) {
      console.error("Error starting scanner:", error);
      handleCameraError(error);
    }
  };

  const handleSuccessfulScan = (nik) => {
    setScanResult({
      type: "success",
      message: "QR Code berhasil di-scan!",
      nik: nik,
    });

    // Kirim hasil scan ke parent component TANPA menutup modal
    onScan(nik);

    // Auto-clear success message setelah 2 detik
    setTimeout(() => {
      setScanResult(null);
    }, 2000);
  };

  const handleFailedScan = (errorMessage) => {
    setScanResult({
      type: "error",
      message: errorMessage,
    });

    onError(errorMessage);

    // Auto-clear error message setelah 3 detik
    setTimeout(() => {
      setScanResult(null);
    }, 3000);
  };

  const testCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      throw new Error(`Camera access denied: ${error.message}`);
    }
  };

  const extractNIKFromQR = (decodedText) => {
    try {
      const urlParts = decodedText.split("/");
      const lastPart = urlParts[urlParts.length - 1];

      if (lastPart && /^\d{16}$/.test(lastPart)) {
        return lastPart;
      }

      if (/^\d{16}$/.test(decodedText)) {
        return decodedText;
      }

      return null;
    } catch (error) {
      console.error("Error extracting NIK:", error);
      return null;
    }
  };

  const handleCameraError = (error) => {
    let errorMessage = "Gagal mengakses kamera. ";

    if (error.name === "NotAllowedError") {
      errorMessage += "Izin kamera ditolak. Silakan berikan izin akses kamera.";
    } else if (error.name === "NotFoundError") {
      errorMessage +=
        "Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.";
    } else if (error.name === "NotSupportedError") {
      errorMessage += "Browser tidak mendukung akses kamera.";
    } else if (error.name === "NotReadableError") {
      errorMessage += "Kamera sedang digunakan oleh aplikasi lain.";
    } else {
      errorMessage += `Error: ${error.message}`;
    }

    setCameraError(errorMessage);
    onError(errorMessage);
    setIsScanning(false);
  };

  const stopScanner = async () => {
    if (html5QrcodeScannerRef.current) {
      try {
        await html5QrcodeScannerRef.current.clear();
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
      html5QrcodeScannerRef.current = null;
    }
    setIsScanning(false);
    setCameraError(null);
    setScanResult(null);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const handleRetry = () => {
    setCameraError(null);
    setScanResult(null);
    startScanner();
  };

  if (!isOpen) return null;

  return (
    <div
      className="qr-scanner-modal"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "inherit",
        padding: "1rem",
      }}
    >
      <div
        className="qr-scanner-container"
        style={{
          background: "white",
          border: "3px solid #000",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "95vw",
          maxHeight: "95vh",
          width: "450px",
          boxShadow: "8px 8px 0px #000",
          position: "relative",
        }}
      >
        <div
          className="qr-scanner-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid #000",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#000",
              fontSize: "1.3rem",
              fontWeight: "800",
            }}
          >
            📷 Scan QR Code Siswa
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "#ef4444",
              color: "white",
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "0.5rem 0.8rem",
              cursor: "pointer",
              fontWeight: "700",
              boxShadow: "2px 2px 0px #000",
              fontSize: "0.9rem",
            }}
          >
            ✕ Tutup
          </button>
        </div>

        {/* Scan Result Message */}
        {scanResult && (
          <div
            style={{
              background: scanResult.type === "success" ? "#d1fae5" : "#fee2e2",
              border: `2px solid ${
                scanResult.type === "success" ? "#10b981" : "#ef4444"
              }`,
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: scanResult.type === "success" ? "#065f46" : "#dc2626",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {scanResult.type === "success" ? "✅ " : "❌ "}
              {scanResult.message}
              {scanResult.nik && (
                <span
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    marginTop: "0.5rem",
                  }}
                >
                  NIK: {scanResult.nik}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Error Message */}
        {cameraError && (
          <div
            style={{
              background: "#fee2e2",
              border: "2px solid #ef4444",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 1rem 0",
                color: "#dc2626",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {cameraError}
            </p>
            <button
              onClick={handleRetry}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "2px solid #000",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "2px 2px 0px #000",
              }}
            >
              🔄 Coba Lagi
            </button>
          </div>
        )}

        {/* Scanner Container */}
        <div
          id="qr-scanner"
          ref={scannerRef}
          style={{
            width: "100%",
            minHeight: "300px",
            border: cameraError ? "2px dashed #ef4444" : "2px solid #000",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "1rem",
            background: cameraError ? "#fef2f2" : "#f3f4f6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {cameraError ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#dc2626",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📵</div>
              <p style={{ margin: 0, fontWeight: "600" }}>Kamera Error</p>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem" }}>
                Tidak dapat mengakses kamera
              </p>
            </div>
          ) : !isScanning ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📱</div>
              <p style={{ margin: 0, fontWeight: "600" }}>
                Menyiapkan scanner...
              </p>
            </div>
          ) : null}
        </div>

        {/* Instructions */}
        {!cameraError && (
          <>
            <div
              className="qr-scanner-instructions"
              style={{
                background: "#f0f9ff",
                border: "2px solid #3b82f6",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#1e40af",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                📋 Arahkan kamera ke QR Code siswa
              </p>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  color: "#1e40af",
                  fontWeight: "500",
                  fontSize: "0.8rem",
                }}
              >
                Scanner aktif - modal tetap terbuka untuk scan berulang
              </p>
            </div>

            <div
              className="qr-scanner-tips"
              style={{
                textAlign: "center",
                padding: "0.5rem",
                background: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#92400e",
                  fontWeight: "500",
                }}
              >
                💡 Scan berhasil? Lanjutkan scan siswa berikutnya tanpa menutup
                modal
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {!cameraError && (
            <button
              onClick={handleRetry}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "2px solid #000",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "2px 2px 0px #000",
                fontSize: "0.8rem",
              }}
            >
              🔄 Restart Scanner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
