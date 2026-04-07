export default function FormSubmitted({ formTitle = "Ответ на приглашение" }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f0f0f0; }

        .page {
          min-height: 100vh;
          background: #f0f0f0;
          display: flex;
          flex-direction: column;
        }

        /* top bar */
        .topbar {
          background: #1f1f1f;
          color: #9ca3af;
          font-size: 12px;
          padding: 7px 14px;
        }

        /* content */
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px 60px;
        }

        /* hero image */
        .hero-image {
          width: 100%;
          max-width: 480px;
          height: 180px;
          object-fit: cover;
          border-radius: 0 0 4px 4px;
          display: block;
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-placeholder {
          width: 100%;
          max-width: 480px;
          height: 180px;
          background: linear-gradient(135deg, #4b5563 0%, #374151 50%, #1f2937 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Simulated party photo with CSS */
        .hero-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 40%, rgba(220,38,38,0.6) 0%, transparent 25%),
            radial-gradient(circle at 50% 60%, rgba(59,130,246,0.5) 0%, transparent 20%),
            radial-gradient(circle at 75% 35%, rgba(234,179,8,0.4) 0%, transparent 22%),
            radial-gradient(circle at 35% 70%, rgba(34,197,94,0.3) 0%, transparent 18%),
            radial-gradient(circle at 65% 75%, rgba(168,85,247,0.4) 0%, transparent 20%),
            radial-gradient(circle at 85% 60%, rgba(249,115,22,0.5) 0%, transparent 18%);
        }

        .hero-label {
          position: relative;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-style: italic;
        }

        /* purple bar */
        .purple-bar {
          width: 100%;
          max-width: 480px;
          height: 8px;
          background: #4f46e5;
          border-radius: 0;
        }

        /* card */
        .card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: 0 0 8px 8px;
          padding: 28px 32px 32px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
        }

        .card-title {
          font-size: 24px;
          font-weight: 400;
          color: #111;
          margin-bottom: 12px;
          font-family: 'DM Sans', sans-serif;
        }

        .card-sub {
          font-size: 14px;
          color: #374151;
          margin-bottom: 20px;
        }

        .change-link {
          font-size: 14px;
          color: #4f46e5;
          text-decoration: none;
          cursor: pointer;
        }
        .change-link:hover { text-decoration: underline; }

        /* footer notice */
        .notice {
          width: 100%;
          max-width: 480px;
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.8;
        }

        .notice a {
          color: #4f46e5;
          text-decoration: none;
        }
        .notice a:hover { text-decoration: underline; }

        .notice-divider { margin: 0 4px; color: #d1d5db; }

        .suspect-line {
          margin-top: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        /* footer logo */
        .footer {
          text-align: center;
          margin-top: 48px;
          padding-bottom: 24px;
        }

        .footer-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #4f46e5;
          opacity: 0.35;
          letter-spacing: 1px;
        }

        /* bottom green bar */
        .bottom-bar {
          height: 5px;
          background: #4ade80;
          margin-top: auto;
        }
      `}</style>

      <div className="page">
        <div className="topbar">Отправка формы</div>

        <div className="content">
          {/* Hero image placeholder */}
          <div className="hero-placeholder">
            <span className="hero-label">фото мероприятия</span>
          </div>

          {/* Purple accent bar */}
          <div className="purple-bar" />

          {/* Card */}
          <div className="card">
            <div className="card-title">{formTitle}</div>
            <div className="card-sub">Thank you for your response.</div>
            <a className="change-link" href="#">Изменить ответ</a>
          </div>

          {/* Legal notice */}
          <div className="notice">
            <div>
              Компания Formo не имеет никакого отношения к этому контенту.
              <span className="notice-divider">·</span>
              <a href="#">Связаться с владельцем формы</a>
            </div>
            <div>
              <a href="#">Условия использования</a>
              <span className="notice-divider">·</span>
              <a href="#">Политика конфиденциальности</a>
            </div>
            <div className="suspect-line">
              Эта форма кажется вам подозрительной? <a href="#">Пожаловаться</a>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <div className="footer-logo">Formo</div>
          </div>
        </div>

        <div className="bottom-bar" />
      </div>
    </>
  );
}
