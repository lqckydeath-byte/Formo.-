import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../shared/api/client";

const TEMPLATES = [
  { id: 1, label: "Пустая форма", icon: "+", bg: "#fff", border: "#e5e7eb" },
  { id: 2, label: "Контактная информация", icon: "👤", bg: "#d1fae5", questions: [
    { title: "Ваше имя", type: "text", options: [], required: true },
    { title: "Ваша электронная почта", type: "text", options: [], required: true },
    { title: "Ваш номер телефона", type: "text", options: [], required: true },
    { title: "Название компании", type: "text", options: [], required: false },
    { title: "Должность", type: "text", options: [], required: false },
    { title: "Дополнительная информация", type: "textarea", options: [], required: false },
    { title: "Как вы о нас узнали?", type: "dropdown", options: ["Поиск", "Рекомендация", "Социальные сети", "Другое"], required: false },
    { title: "Могли ли мы улучшить?", type: "scale", options: [], required: false },
  ]},
  { id: 3, label: "Ответ на приглашение", icon: "✓", bg: "#fef9c3", questions: [
    { title: "Ваше полное имя", type: "text", options: [], required: true },
    { title: "Электронная почта", type: "text", options: [], required: true },
    { title: "Вы посетите мероприятие?", type: "radio", options: ["Да", "Возможно", "Нет"], required: true },
    { title: "Количество гостей", type: "dropdown", options: ["1", "2", "3", "4", "5+"], required: false },
    { title: "Особые пожелания по питанию", type: "checkbox", options: ["Вегетарианское", "Безглютеновое", "Без молочного"], required: false },
    { title: "Есть ли у вас пищевые аллергии?", type: "textarea", options: [], required: false },
    { title: "Какой ваш любимый цвет?", type: "radio", options: ["Красный", "Синий", "Зеленый", "Другой"], required: false },
    { title: "Дополнительные комментарии", type: "textarea", options: [], required: false },
  ]},
  { id: 4, label: "Приглашение на событие", icon: "🎉", bg: "#fce7f3", questions: [
    { title: "Ваше имя", type: "text", options: [], required: true },
    { title: "Email адрес", type: "text", options: [], required: true },
    { title: "Вы приходили раньше?", type: "radio", options: ["Да", "Нет"], required: true },
    { title: "Сколько человек вы приведете?", type: "dropdown", options: ["1", "2", "3", "4", "5+"], required: false },
    { title: "Интересующие вас темы", type: "checkbox", options: ["Технология", "Бизнес", "Дизайн", "Маркетинг"], required: false },
    { title: "Как вы узнали о событии?", type: "radio", options: ["От друга", "Социальные сети", "Реклама", "Другое"], required: false },
    { title: "Отзыв о прошлых событиях", type: "textarea", options: [], required: false },
    { title: "Насколько вы заинтересованы?", type: "scale", options: [], required: false },
  ]},
  { id: 5, label: "Заказ футболки", icon: "👕", bg: "#ede9fe", questions: [
    { title: "Ваше имя", type: "text", options: [], required: true },
    { title: "Email адрес", type: "text", options: [], required: true },
    { title: "Выберите размер", type: "radio", options: ["XS", "S", "M", "L", "XL", "XXL"], required: true },
    { title: "Выберите цвет", type: "dropdown", options: ["Черный", "Белый", "Синий", "Красный", "Зеленый"], required: true },
    { title: "Дополнительные варианты", type: "checkbox", options: ["Рукава", "Капюшон", "Значок"], required: false },
    { title: "Какой дизайн принта вас интересует?", type: "textarea", options: [], required: false },
    { title: "Количество футболок", type: "text", options: [], required: false },
    { title: "Насколько вы довольны качеством?", type: "scale", options: [], required: false },
  ]},
  { id: 6, label: "Регистрация на событие", icon: "📝", bg: "#fef3c7", questions: [
    { title: "Полное имя", type: "text", options: [], required: true },
    { title: "Email адрес", type: "text", options: [], required: true },
    { title: "Номер телефона", type: "text", options: [], required: true },
    { title: "Организация", type: "text", options: [], required: false },
    { title: "Должность", type: "dropdown", options: ["Менеджер", "Разработчик", "Дизайнер", "Другое"], required: false },
    { title: "Опыт работы в отрасли", type: "radio", options: ["0-2 года", "2-5 лет", "5-10 лет", "Более 10 лет"], required: false },
    { title: "Как вы хотите участвовать?", type: "checkbox", options: ["Слушатель", "Докладчик", "Спонсор", "Волонтер"], required: false },
    { title: "Почему вы интересуетесь событием?", type: "textarea", options: [], required: false },
  ]}
];

export default function Home() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSurveys();
  }, []);

  const createNewForm = (template = null) => {
    if (template?.questions) {
      localStorage.setItem("templateQuestions", JSON.stringify(template.questions));
      localStorage.setItem("templateTitle", template.label);
    }
    navigate("/editor");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadSurveys = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await apiClient.surveys.getAll();
      setSurveys(data.data || []);
    } catch (error) {
      console.error("Error loading surveys:", error);
      setError(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const filteredSurveys = surveys.filter(s => 
    !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #fff; }

        /* NEW NAVBAR STYLE - WHITE WITH CENTERED SEARCH */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          background: #fff;
          border-bottom: 1px solid #dadce0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 2px rgba(60,64,67,0.3);
          gap: 32px;
        }

        .nav-logo {
          position: absolute;
          left: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }

        .nav-logo img {
          width: 40px;
          height: 40px;
        }

        .nav-logo-text {
          font-size: 22px;
          font-weight: 500;
          color: #1f1f1f;
          font-family: 'DM Sans', sans-serif;
        }

        .search-container {
          flex: 0 0 500px;
          max-width: 500px;
          position: relative;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: #f8f9fa;
          padding: 10px 16px;
          border-radius: 24px;
          border: 1px solid #dadce0;
          transition: all 0.2s;
          animation: fadeIn 0.3s ease-out;
        }

        .search-box:focus-within {
          border-color: #dadce0;
          box-shadow: 0 1px 4px rgba(32,33,36,0.1);
          background: #fff;
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1f2937;
          font-family: 'DM Sans', sans-serif;
        }

        .search-box input::placeholder { color: #9aa0a6; }
        .search-icon { color: #9aa0a6; font-size: 16px; }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          position: absolute;
          right: 32px;
        }

        .nav-user {
          font-size: 14px;
          color: #5f6368;
          min-width: 100px;
          text-align: right;
        }

        .logout-btn {
          background: #ef4444;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .logout-btn:hover {
          background: #dc2626;
          color: #fff;
        }

        /* OLD PURPLE THEME CONTENT */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 32px;
          animation: fadeIn 0.4s ease-out;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 13px;
          border: 1px solid #fecaca;
          animation: slideIn 0.3s ease-out;
        }

        .templates-section {
          margin-bottom: 48px;
        }

        .templates-title {
          font-size: 18px;
          font-weight: 600;
          color: #111;
          margin-bottom: 20px;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        .template-card {
          aspect-ratio: 1;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          font-size: 13px;
          text-align: center;
          padding: 16px;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
          animation: fadeIn 0.4s ease-out;
        }

        .template-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: #4f46e5;
        }

        .template-card:active {
          transform: scale(0.98);
        }

        .template-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .recent-section {
          margin-top: 48px;
        }

        .recent-title {
          font-size: 18px;
          font-weight: 600;
          color: #111;
          margin-bottom: 20px;
        }

        .recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .survey-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          animation: fadeIn 0.4s ease-out;
        }

        .survey-card:hover {
          box-shadow: 0 4px 12px rgba(79,70,229,0.2);
          transform: translateY(-4px);
          border-color: #4f46e5;
        }

        .survey-title {
          font-size: 15px;
          font-weight: 600;
          color: #111;
          margin-bottom: 8px;
          word-break: break-word;
        }

        .survey-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .survey-actions {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .survey-action-btn {
          flex: 1;
          padding: 8px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .survey-action-btn:hover {
          background: #4338ca;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .navbar {
            gap: 16px;
            padding: 12px 16px;
            flex-wrap: wrap;
          }

          .nav-logo {
            position: static;
            width: 100%;
            order: 1;
          }

          .search-container {
            flex: 0 0 100%;
            order: 3;
            max-width: 100%;
          }

          .nav-actions {
            position: static;
            order: 2;
          }

          .container {
            padding: 20px 12px;
          }

          .templates-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
          }

          .template-card {
            font-size: 11px;
          }

          .template-icon {
            font-size: 32px;
            margin-bottom: 4px;
          }

          .recent-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* NEW NAVBAR WITH CENTERED SEARCH */}
      <nav className="navbar">
        <div className="nav-logo">
          <img src="/fromo.png" alt="Formo" />
          <span className="nav-logo-text">Formo</span>
        </div>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск форм..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-actions">
          <div className="nav-user">
            {user?.firstName && `${user.firstName} ${user.lastName || ''}`}
          </div>
          <button className="logout-btn" onClick={logout}>Выйти</button>
        </div>
      </nav>

      {/* OLD PURPLE THEME CONTENT */}
      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <section className="templates-section">
          <h2 className="templates-title">Создать форму</h2>
          <div className="templates-grid">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                className="template-card"
                onClick={() => createNewForm(template)}
                style={{ backgroundColor: template.bg }}
              >
                <span className="template-icon">{template.icon}</span>
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        </section>

        {(surveys.length > 0 || searchQuery) && (
          <section className="recent-section">
            <h2 className="recent-title">
              {searchQuery ? 'Результаты поиска' : 'Недавние формы'}
            </h2>

            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : filteredSurveys.length > 0 ? (
              <div className="recent-grid">
                {filteredSurveys.map(survey => (
                  <div
                    key={survey._id}
                    className="survey-card"
                    onClick={() => navigate(`/answers/${survey._id}`)}
                  >
                    <div className="survey-title">{survey.title}</div>
                    <div className="survey-meta">
                      <span>{survey.questions?.length || 0} вопросов</span>
                      <span>
                        {new Date(survey.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="survey-actions">
                      <button
                        className="survey-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editor/${survey._id}`);
                        }}
                      >
                        Редактировать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>Формы не найдены</p>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
