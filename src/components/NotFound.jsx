import { useNavigate } from "react-router-dom";
import clsx from "clsx";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const containerClass = clsx(
    "min-h-screen",
    "flex flex-col items-center justify-center",
    "text-center",
    "p-10",
  );

  const buttonClass = clsx(
    "px-6 py-3 mt-6",
    "text-white text-base",
    "bg-blue-600 hover:bg-blue-700",
    "rounded-lg",
    "transition duration-200",
    "cursor-pointer",
  );

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold">404</h1>
      <h1>Halaman Tidak Ditemukan</h1>

      <p className="mt-3 text-gray-600">
        Maaf, halaman yang Anda cari tidak ditemukan.
      </p>

      <button onClick={handleGoHome} className={buttonClass}>
        Kembali ke Halaman Utama
      </button>
    </div>
  );
}

export default NotFound;
