import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../shared/api/client";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClient.auth.login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
        }

        .container {
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
        }

        .card {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 32px;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo {
          font-size: 32px;
          margin-bottom: 8px;
        }

        h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .subtitle {
          color: #6b7280;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
        }

        input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 10px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }

        .submit-btn:hover {
          background: #4338ca;
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 16px;
          padding: 10px;
          background: #fee2e2;
          border-radius: 6px;
        }

        .signup-link {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #6b7280;
        }

        .signup-link a {
          color: #4f46e5;
          text-decoration: none;
          cursor: pointer;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        /* Мобильная адаптивность */
        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }
          .card {
            padding: 24px;
          }
          h1 {
            font-size: 20px;
          }
          .subtitle {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 12px;
          }
          .card {
            padding: 18px;
            border-radius: 6px;
          }
          .logo-section {
            margin-bottom: 24px;
          }
          .logo-section img {
            width: 70px;
            height: 70px;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 18px;
            margin-bottom: 6px;
          }
          .subtitle {
            font-size: 12px;
          }
          .form-group {
            margin-bottom: 16px;
          }
          label {
            font-size: 13px;
            margin-bottom: 6px;
          }
          input {
            padding: 8px 10px;
            font-size: 13px;
          }
          .submit-btn {
            padding: 8px;
            font-size: 13px;
            margin-top: 8px;
          }
          .error {
            font-size: 12px;
            padding: 8px;
            margin-bottom: 12px;
          }
          .signup-link {
            margin-top: 12px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <div className="card">
            <div className="logo-section">
              <img src="/fromo.png" alt="Formo" style={{ width: "90px", height: "90px", marginBottom: "16px" }} />
              <h1>Вход</h1>
              <p className="subtitle">Введите ваши данные для входа</p>
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Подождите..." : "Войти"}
              </button>
            </form>

            <div className="signup-link">
              Нет аккаунта?{" "}
              <a onClick={() => navigate("/register")}>Зарегистрироваться</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
