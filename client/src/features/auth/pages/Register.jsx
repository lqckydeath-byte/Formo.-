import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../shared/api/client";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Введите имя";
    if (!form.lastName.trim()) e.lastName = "Введите фамилию";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Некорректный email";
    if (!form.password || form.password.length < 6) e.password = "Минимум 6 символов";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      const data = await apiClient.auth.register(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setErrors({ submit: err.message || "Ошибка сервера" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "#22c55e", marginBottom: "8px" }}>Регистрация успешна!</h2>
          <p style={{ color: "#6b7280" }}>Перенаправляем...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'DM Sans', sans-serif; background: #fff; }

        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          position: relative;
          overflow: hidden;
          padding: 40px 16px;
        }

        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 480px;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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

        .error {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
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
          margin-top: 20px;
        }

        .submit-btn:hover {
          background: #4338ca;
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .login-link {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #6b7280;
        }

        .login-link a {
          color: #4f46e5;
          text-decoration: none;
          cursor: pointer;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        /* Мобильная адаптивность */
        @media (max-width: 768px) {
          .card {
            padding: 32px 24px;
            border-radius: 16px;
          }
          h1 {
            font-size: 20px;
          }
          .subtitle {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .page {
            padding: 24px 12px;
          }
          .card {
            padding: 22px 18px;
            border-radius: 12px;
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
            margin-top: 16px;
          }
          .error {
            font-size: 11px;
            margin-top: 3px;
          }
          .login-link {
            margin-top: 12px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="page">
        <div className="card">
          <div className="logo-section">
            <img src="/fromo.png" alt="Formo" style={{ width: "90px", height: "90px", marginBottom: "16px" }} />
            <h1>Регистрация</h1>
            <p className="subtitle">Создайте новый аккаунт</p>
          </div>

          {errors.submit && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" }}>{errors.submit}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя</label>
              <input type="text" value={form.firstName} onChange={handleChange("firstName")} placeholder="Иван" required disabled={loading} />
              {errors.firstName && <div className="error">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label>Фамилия</label>
              <input type="text" value={form.lastName} onChange={handleChange("lastName")} placeholder="Иванов" required disabled={loading} />
              {errors.lastName && <div className="error">{errors.lastName}</div>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={handleChange("email")} placeholder="your@email.com" required disabled={loading} />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Пароль</label>
              <input type="password" value={form.password} onChange={handleChange("password")} placeholder="••••••••" required disabled={loading} />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Подождите..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="login-link">
            Уже есть аккаунт?{" "}
            <a onClick={() => navigate("/login")}>Войти</a>
          </div>
        </div>
      </div>
    </>
  );
}
