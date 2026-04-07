import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../shared/api/client";

export default function RespondentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [answered, setAnswered] = useState(false);
  
  // Состояние ответов - соответствие id вопроса к ответу
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadSurvey();
  }, [id]);

  const loadSurvey = async () => {
    try {
      setLoading(true);
      const data = await apiClient.surveys.getById(id);
      setSurvey(data.data);
      
      // Проверяем есть ли уже ответ от текущего пользователя
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) {
        const answersData = await apiClient.answers.getBySurvey(id);
        const userAlreadyAnswered = answersData.data?.some(a => a.respondentId === user.id);
        if (userAlreadyAnswered && !data.data.settings?.allowMultipleAnswers) {
          setError("Вы уже ответили на этот опрос");
          setAnswered(true);
          return;
        }
      }
      
      // Инициализируем ответы для каждого вопроса
      const initialAnswers = {};
      data.data.questions.forEach((q, idx) => {
        initialAnswers[idx] = q.type === 'checkbox' ? [] : '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(`Ошибка при загрузке опроса: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIdx, value) => {
    const question = survey.questions[questionIdx];
    if (question.type === 'checkbox') {
      setAnswers(prev => ({
        ...prev,
        [questionIdx]: Array.isArray(prev[questionIdx]) ? prev[questionIdx] : []
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionIdx]: value
      }));
    }
  };

  const handleCheckboxChange = (questionIdx, option) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionIdx]) ? prev[questionIdx] : [];
      if (current.includes(option)) {
        return {
          ...prev,
          [questionIdx]: current.filter(o => o !== option)
        };
      } else {
        return {
          ...prev,
          [questionIdx]: [...current, option]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setSubmitting(true);
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setError("Вы не авторизованы");
        navigate("/login");
        return;
      }

      // Проверяем что все обязательные вопросы заполнены
      for (let i = 0; i < survey.questions.length; i++) {
        const q = survey.questions[i];
        const answer = answers[i];
        if (q.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
          setError(`Вопрос "${q.title}" обязательный`);
          return;
        }
      }

      // Формируем ответы для отправки
      const formattedAnswers = survey.questions.map((q, idx) => ({
        questionId: idx.toString(),
        questionTitle: q.title,
        answer: answers[idx]
      }));

      await apiClient.answers.submit({
        surveyId: id,
        respondentId: user.id,
        answers: formattedAnswers
      });

      setAnswered(true);
    } catch (err) {
      setError(`Ошибка при отправке ответов: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Загрузка опроса...</div>;
  }

  if (!survey) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Опрос не найден</div>;
  }

  if (answered) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          maxWidth: "480px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>
            {error ? "⚠️" : "✓"}
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: error ? "#dc2626" : "#111", marginBottom: "12px" }}>
            {error ? "Не удается ответить" : "Спасибо за ответы!"}
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px" }}>
            {error ? error : `Ваши ответы на опрос "${survey?.title}" были успешно сохранены.`}
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f9fafb; }

        .navbar {
          display: flex; align-items: center;
          padding: 0 24px;
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky; top: 0; z-index: 100;
        }

        .nav-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; cursor: pointer;
        }

        .nav-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #d1fae5, #6ee7b7);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .nav-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; color: #4ade80;
        }

        .back-btn {
          margin-left: 40px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .back-btn:hover { background: #f3f4f6; }

        .container {
          max-width: 760px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        .header {
          margin-bottom: 40px;
          background: #fff;
          border-top: 4px solid #4f46e5;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }

        .header-title {
          font-size: 28px;
          font-weight: 600;
          color: #111;
          margin-bottom: 8px;
        }

        .header-desc {
          font-size: 16px;
          color: #6b7280;
        }

        .form-section {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }

        .question-title {
          font-size: 16px;
          font-weight: 600;
          color: #111;
          margin-bottom: 12px;
        }

        .question-required {
          color: #ef4444;
          font-size: 12px;
          margin-left: 4px;
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        input[type="radio"],
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .option-label {
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          flex: 1;
        }

        .text-input,
        .textarea-input,
        select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
        }

        .text-input:focus,
        .textarea-input:focus,
        select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .scale-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .scale-btn {
          width: 44px;
          height: 44px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s;
        }

        .scale-btn:hover {
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .scale-btn.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #fff;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }

        .submit-btn:hover { background: #4338ca; }
        .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      `}</style>

      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src="/fromo.png" alt="Formo" style={{ width: "80px", height: "80px" }} />
        </div>
        <button className="back-btn" onClick={() => navigate("/")}>← Назад</button>
      </nav>

      <div className="container">
        <div className="header">
          <h1 className="header-title">{survey.title}</h1>
          {survey.description && <p className="header-desc">{survey.description}</p>}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {survey.questions.map((question, qIdx) => (
            <div key={qIdx} className="form-section">
              <div className="question-title">
                {question.title}
                {question.required && <span className="question-required">*</span>}
              </div>

              {/* Radio buttons */}
              {question.type === 'radio' && (
                <div>
                  {question.options.map((option, oIdx) => (
                    <div key={oIdx} className="option-row">
                      <input
                        type="radio"
                        id={`q${qIdx}-o${oIdx}`}
                        name={`question-${qIdx}`}
                        value={option}
                        checked={answers[qIdx] === option}
                        onChange={(e) => handleAnswerChange(qIdx, e.target.value)}
                      />
                      <label htmlFor={`q${qIdx}-o${oIdx}`} className="option-label">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkboxes */}
              {question.type === 'checkbox' && (
                <div>
                  {question.options.map((option, oIdx) => (
                    <div key={oIdx} className="option-row">
                      <input
                        type="checkbox"
                        id={`q${qIdx}-o${oIdx}`}
                        checked={Array.isArray(answers[qIdx]) && answers[qIdx].includes(option)}
                        onChange={() => handleCheckboxChange(qIdx, option)}
                      />
                      <label htmlFor={`q${qIdx}-o${oIdx}`} className="option-label">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Text input */}
              {question.type === 'text' && (
                <input
                  type="text"
                  className="text-input"
                  placeholder="Введите ответ"
                  value={answers[qIdx] || ''}
                  onChange={(e) => handleAnswerChange(qIdx, e.target.value)}
                />
              )}

              {/* Textarea */}
              {question.type === 'textarea' && (
                <textarea
                  className="textarea-input"
                  placeholder="Введите ответ"
                  rows={4}
                  value={answers[qIdx] || ''}
                  onChange={(e) => handleAnswerChange(qIdx, e.target.value)}
                  style={{ resize: 'none' }}
                />
              )}

              {/* Dropdown */}
              {question.type === 'dropdown' && (
                <select
                  value={answers[qIdx] || ''}
                  onChange={(e) => handleAnswerChange(qIdx, e.target.value)}
                >
                  <option value="">-- Выберите вариант --</option>
                  {question.options.map((option, oIdx) => (
                    <option key={oIdx} value={option}>{option}</option>
                  ))}
                </select>
              )}

              {/* Scale */}
              {question.type === 'scale' && (
                <div className="scale-options">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`scale-btn ${answers[qIdx] === num ? 'active' : ''}`}
                      onClick={() => handleAnswerChange(qIdx, num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="form-section">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить ответы'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
