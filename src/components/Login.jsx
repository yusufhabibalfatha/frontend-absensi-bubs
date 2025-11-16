import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parseUser = JSON.parse(user);

      // Redirect based on role
      if (parseUser.role === "GURU") {
        navigate("/classroom/guru");
      } else {
        navigate("/classroom/siswa");
      }
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `${import.meta.env.VITE_API_URL}/absensi-bubs/v1/login`;

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.success) {
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("isLoggedIn", "true");

        // Redirect based on role
        if (result.user.role === "GURU") {
          navigate("/classroom/guru");
        } else {
          navigate("/classroom/siswa");
        }
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button
          onClick={handleBackToHome}
          className="back-button"
          style={{
            background: "var(--accent-yellow)",
            color: "var(--black)",
            border: "2px solid var(--black)",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "2px 2px 0px var(--black)",
            marginBottom: "1rem",
          }}
        >
          ← Kembali ke Beranda
        </button>

        <div className="login-header">
          <h1>🎓 Classroom Login</h1>
          <p>Masuk ke sistem classroom sekolah</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 Memproses..." : "🔐 Masuk"}
          </button>
        </form>

        <div className="login-info">
          <p>
            <strong>Info Login:</strong>
          </p>
          <p>
            • Guru: username nama lengkap guru tanpa spasi, password: guru123
          </p>
          <p>
            • Siswa: username nama lengkap siswa tanpa spasi, password: siswa123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
