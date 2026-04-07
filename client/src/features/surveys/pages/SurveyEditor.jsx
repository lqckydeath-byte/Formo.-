import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../shared/api/client";

const QUESTION_TYPES = [
  { value: "radio", label: "Один из списка" },
  { value: "checkbox", label: "Несколько из списка" },
  { value: "text", label: "Текст (короткий ответ)" },
  { value: "textarea", label: "Текст (развёрнутый ответ)" },
  { value: "dropdown", label: "Раскрывающийся список" },
  { value: "scale", label: "Шкала" },
];

function Question({ q, index, isActive, onChange, onDelete, onDuplicate, onClick }) {
  const updateOption = (i, val) => {
    const opts = [...q.options];
    opts[i] = val;
    onChange({ ...q, options: opts });
  };

  const addOption = () => onChange({ ...q, options: [...q.options, `Вариант ${q.options.length + 1}`] });
  const removeOption = (i) => onChange({ ...q, options: q.options.filter((_, idx) => idx !== i) });

  return (
    <div
      className={`question-card ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: isActive ? "default" : "pointer" }}
    >
      {isActive && <div className="drag-handle">⋮⋮</div>}

      <div className="question-top">
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
          <input
            className="question-title-input"
            value={q.title}
            onChange={e => onChange({ ...q, title: e.target.value })}
            placeholder="Вопрос без заголовка"
            onClick={e => e.stopPropagation()}
          />
          {q.required && <span style={{ color: "#ef4444", fontSize: "18px", fontWeight: "bold" }}>*</span>}
        </div>
        <button className="img-btn" title="Добавить изображение">🖼</button>
        <select
          className="type-select"
          value={q.type}
          onChange={e => onChange({ ...q, type: e.target.value })}
          onClick={e => e.stopPropagation()}
        >
          {QUESTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {(q.type === "radio" || q.type === "checkbox" || q.type === "dropdown") && (
        <div className="options-list">
          {q.options.map((opt, i) => (
            <div key={i} className="option-row">
              {q.type === "radio" && <span className="radio-circle" />}
              {q.type === "checkbox" && <span className="check-box" />}
              {q.type === "dropdown" && <span className="dropdown-num">{i + 1}.</span>}
              <input
                className="option-input"
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              {q.options.length > 1 && (
                <button className="remove-opt" onClick={e => { e.stopPropagation(); removeOption(i); }}>✕</button>
              )}
            </div>
          ))}
          <div className="option-row">
            {q.type === "radio" && <span className="radio-circle muted" />}
            {q.type === "checkbox" && <span className="check-box muted" />}
            {q.type === "dropdown" && <span className="dropdown-num muted">{q.options.length + 1}.</span>}
            <span className="add-option-btn" onClick={e => { e.stopPropagation(); addOption(); }}>
              Добавить вариант
            </span>
          </div>
        </div>
      )}

      {q.type === "text" && (
        <div className="text-preview">
          <input className="text-preview-input" placeholder="Текст ответа" disabled />
        </div>
      )}

      {q.type === "textarea" && (
        <div className="text-preview">
          <textarea className="text-preview-input" placeholder="Текст ответа" disabled rows={3} style={{resize:"none"}} />
        </div>
      )}

      {q.type === "scale" && (
        <div className="scale-preview">
          {[1,2,3,4,5].map(n => (
            <div key={n} className="scale-item">
              <span className="scale-num">{n}</span>
              <span className="radio-circle" />
            </div>
          ))}
        </div>
      )}

      {isActive && (
        <div className="question-footer">
          <button className="footer-icon-btn" title="Дублировать" onClick={e => { e.stopPropagation(); onDuplicate(); }}>⧉</button>
          <button className="footer-icon-btn" title="Удалить" onClick={e => { e.stopPropagation(); onDelete(); }}>🗑</button>
          <div className="required-toggle">
            <span>Обязательный вопрос</span>
            <div
              className={`toggle ${q.required ? "on" : ""}`}
              onClick={e => { e.stopPropagation(); onChange({ ...q, required: !q.required }); }}
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

let nextId = 2;
const makeQuestion = () => ({
  id: nextId++,
  title: "",
  type: "radio",
  options: ["Вариант 1"],
  required: false,
});

export default function SurveyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState("questions");
  const [title, setTitle] = useState("Новый опрос");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, title: "Вопрос без заголовка", type: "radio", options: ["Вариант 1"], required: false }
  ]);
  const [activeId, setActiveId] = useState(1);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState("light");
  const [settings, setSettings] = useState({
    allowMultipleAnswers: false,
    showProgressBar: true,
    randomizeQuestions: false
  });
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (id) {
      loadSurvey();
      loadResponses();
    } else {
      // Проверяем есть ли шаблон вопросов из Home
      const templateQuestions = localStorage.getItem("templateQuestions");
      const templateTitle = localStorage.getItem("templateTitle");
      
      if (templateQuestions) {
        try {
          const parsed = JSON.parse(templateQuestions);
          const withIds = parsed.map((q, idx) => ({
            ...q,
            id: idx + 1
          }));
          setQuestions(withIds);
          nextId = withIds.length + 1;
          setTitle(templateTitle || "Новый опрос");
          
          // Очищаем localStorage
          localStorage.removeItem("templateQuestions");
          localStorage.removeItem("templateTitle");
        } catch (e) {
          console.error("Error parsing template questions:", e);
        }
      }
    }
  }, [id]);

  const loadSurvey = async () => {
    try {
      setLoading(true);
      const data = await apiClient.surveys.getById(id);
      setTitle(data.data.title);
      setDescription(data.data.description || "");
      
      // Добавляем временные 'id' к вопросам для управления состоянием UI
      const questionsWithIds = data.data.questions.map((q, idx) => ({
        ...q,
        id: idx + 1
      }));
      setQuestions(questionsWithIds);
      nextId = questionsWithIds.length + 1;
    } catch (error) {
      console.error("Error loading survey:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async () => {
    try {
      if (!id) return;
      const data = await apiClient.answers.getBySurvey(id);
      setResponses(data.data || []);
    } catch (error) {
      console.error("Error loading responses:", error);
    }
  };

  const saveSurvey = async () => {
    try {
      setSaving(true);
      
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Вы не авторизованы! Пожалуйста, войдите в аккаунт.");
        navigate("/login");
        return;
      }
      
      const user = JSON.parse(userStr);
      if (!user.id) {
        alert("Ошибка: ID пользователя не найден. Попробуйте переавторизоваться.");
        navigate("/login");
        return;
      }
      
      // Удаляем временные 'id' из вопросов перед отправкой (они нужны только для UI)
      const cleanedQuestions = questions.map(({ id, ...rest }) => rest);
      
      if (id) {
        await apiClient.surveys.update(id, {
          title,
          description,
          questions: cleanedQuestions
        });
        alert("Опрос обновлён!");
      } else {
        const data = await apiClient.surveys.create({
          title,
          description,
          questions: cleanedQuestions,
          userId: user.id
        });
        alert("Опрос создан!");
        navigate(`/editor/${data.data._id}`);
      }
    } catch (error) {
      console.error("Error saving survey:", error);
      alert(`Ошибка при сохранении опроса: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateQuestion = (qId, data) => setQuestions(qs => qs.map(q => q.id === qId ? data : q));
  const deleteQuestion = (qId) => setQuestions(qs => qs.filter(q => q.id !== qId));
  const duplicateQuestion = (qId) => {
    const q = questions.find(q => q.id === qId);
    const copy = { ...q, id: nextId++, title: q.title + " (копия)" };
    setQuestions(qs => {
      const i = qs.findIndex(q => q.id === qId);
      return [...qs.slice(0, i + 1), copy, ...qs.slice(i + 1)];
    });
    setActiveId(copy.id);
  };
  const addQuestion = () => {
    const q = makeQuestion();
    setQuestions(qs => [...qs, q]);
    setActiveId(q.id);
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Загрузка...</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #ebe8f5; }

        .navbar {
          display: flex; align-items: center;
          padding: 0 20px;
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky; top: 0; z-index: 100;
          gap: 12px;
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; cursor: pointer; }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #d1fae5, #6ee7b7);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .nav-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; color: #4ade80;
        }
        .nav-spacer { flex: 1; }
        .nav-tabs { display: flex; gap: 0; margin-left: 40px; }
        .nav-tab {
          padding: 18px 20px;
          font-size: 14px; font-weight: 500;
          color: #6b7280;
          border: none; background: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 3px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .nav-tab:hover { color: #4f46e5; }
        .nav-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .nav-icon-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: none; background: none;
          border-radius: 50%; cursor: pointer;
          font-size: 16px; color: #6b7280;
          transition: background 0.2s;
        }
        .nav-icon-btn:hover { background: #f3f4f6; }
        .publish-btn {
          background: #4f46e5; color: #fff;
          border: none; border-radius: 6px;
          padding: 8px 18px;
          font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .publish-btn:hover { background: #4338ca; }
        .publish-btn:disabled { background: #9ca3af; cursor: not-allowed; }

        .main {
          max-width: 760px; margin: 0 auto;
          padding: 32px 16px 80px;
          display: flex; flex-direction: column; gap: 12px;
        }

        .title-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border-top: 8px solid #4f46e5;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .title-inner { padding: 24px 28px; }
        .title-input {
          font-size: 28px; font-weight: 600; color: #111;
          border: none; outline: none;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 2px solid transparent;
          background: transparent;
        }
        .title-input:focus { border-bottom-color: #4f46e5; }
        .desc-input {
          margin-top: 10px;
          font-size: 14px; color: #6b7280;
          border: none; outline: none;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 1px solid transparent;
          background: transparent;
        }
        .desc-input:focus { border-bottom-color: #4f46e5; }

        .question-card {
          background: #fff;
          border-radius: 12px;
          padding: 22px 24px 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          border-left: 4px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .question-card.active {
          border-left-color: #4f46e5;
          box-shadow: 0 2px 10px rgba(79,70,229,0.1);
        }
        .drag-handle {
          position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
          color: #d1d5db; font-size: 13px; letter-spacing: 2px;
          cursor: grab; user-select: none;
        }
        .question-top {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .question-title-input {
          flex: 1;
          font-size: 15px; font-weight: 600; color: #111;
          border: none; outline: none;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 6px;
          font-family: 'DM Sans', sans-serif;
          background: transparent;
        }
        .question-title-input:focus { border-bottom-color: #4f46e5; }
        .img-btn {
          width: 32px; height: 32px;
          border: none; background: none;
          border-radius: 6px; cursor: pointer;
          font-size: 16px; color: #9ca3af;
          transition: background 0.2s;
        }
        .img-btn:hover { background: #f3f4f6; color: #4f46e5; }
        .type-select {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 7px 28px 7px 12px;
          font-size: 13px; color: #374151;
          font-family: 'DM Sans', sans-serif;
          outline: none; cursor: pointer;
          appearance: none; min-width: 160px;
        }
        .type-select:focus { border-color: #4f46e5; }

        .options-list { display: flex; flex-direction: column; gap: 10px; padding-left: 4px; }
        .option-row { display: flex; align-items: center; gap: 10px; }
        .radio-circle {
          width: 18px; height: 18px; flex-shrink: 0;
          border: 2px solid #9ca3af; border-radius: 50%;
        }
        .radio-circle.muted { border-color: #d1d5db; }
        .check-box {
          width: 18px; height: 18px; flex-shrink: 0;
          border: 2px solid #9ca3af; border-radius: 3px;
        }
        .check-box.muted { border-color: #d1d5db; }
        .dropdown-num { font-size: 13px; color: #6b7280; min-width: 20px; }
        .dropdown-num.muted { color: #d1d5db; }
        .option-input {
          flex: 1; border: none; outline: none;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 4px; font-size: 14px; color: #374151;
          font-family: 'DM Sans', sans-serif; background: transparent;
        }
        .option-input:focus { border-bottom-color: #4f46e5; }
        .remove-opt {
          width: 22px; height: 22px;
          border: none; background: none;
          cursor: pointer; color: #9ca3af; font-size: 12px;
        }
        .remove-opt:hover { color: #ef4444; }
        .add-option-btn {
          font-size: 14px; color: #6b7280; cursor: pointer;
        }
        .add-option-btn:hover { color: #4f46e5; }

        .text-preview { padding-left: 4px; }
        .text-preview-input {
          width: 60%; border: none;
          border-bottom: 1px dashed #9ca3af;
          outline: none; font-size: 14px; color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
          background: transparent; padding-bottom: 4px;
        }

        .scale-preview {
          display: flex; gap: 20px; padding-left: 4px;
        }
        .scale-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .scale-num { font-size: 12px; color: #6b7280; }

        .question-footer {
          display: flex; align-items: center; gap: 4px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }
        .footer-icon-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: none; background: none;
          border-radius: 6px; cursor: pointer;
          font-size: 16px; color: #6b7280;
        }
        .footer-icon-btn:hover { background: #f3f4f6; color: #374151; }
        .required-toggle {
          margin-left: auto;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #6b7280;
        }
        .toggle {
          width: 38px; height: 22px;
          background: #d1d5db; border-radius: 11px;
          position: relative; cursor: pointer;
        }
        .toggle.on { background: #4f46e5; }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px;
          background: #fff; border-radius: 50%;
          transition: transform 0.2s;
        }
        .toggle.on .toggle-thumb { transform: translateX(16px); }

        .add-q-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          margin: 4px auto 0;
          padding: 10px 24px;
          border-radius: 24px;
          border: 2px dashed #c4b5fd;
          background: transparent;
          font-size: 14px; color: #4f46e5;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; font-weight: 500;
        }
        .add-q-btn:hover { background: #f5f3ff; border-color: #4f46e5; }

        .page-footer {
          text-align: center; padding: 32px 0 0;
        }
        .footer-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 28px; color: #4f46e5; opacity: 0.3;
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src="/fromo.png" alt="Formo" style={{ width: "80px", height: "80px" }} />
        </div>

        <div className="nav-tabs">
          {["questions","answers","settings"].map(t => (
            <button
              key={t}
              className={`nav-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "questions" && "Вопросы"}
              {t === "answers" && "Ответы"}
              {t === "settings" && "Настройки"}
            </button>
          ))}
        </div>

        <div className="nav-spacer" />

        <div className="nav-actions">
          {id && <button className="publish-btn" onClick={() => navigate(`/respond/${id}`)}>
            Ответить
          </button>}
          <button className="publish-btn" onClick={saveSurvey} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </nav>

      <div className="main" style={{ paddingBottom: "80px" }}>
        {tab === "questions" && (
          <>
            <div className="title-card">
              <div className="title-inner">
                <input
                  className="title-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Название опроса"
                />
                <input
                  className="desc-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Описание"
                />
              </div>
            </div>

            {questions.map((q, index) => (
              <Question
                key={q.id}
                q={q}
                index={index}
                isActive={activeId === q.id}
                onClick={() => setActiveId(q.id)}
                onChange={data => updateQuestion(q.id, data)}
                onDelete={() => {
                  deleteQuestion(q.id);
                  setActiveId(questions.find(x => x.id !== q.id)?.id || null);
                }}
                onDuplicate={() => duplicateQuestion(q.id)}
              />
            ))}

            <button className="add-q-btn" onClick={addQuestion}>
              ＋ Добавить вопрос
            </button>

            <div className="page-footer">
              <div className="footer-logo">Formo</div>
            </div>
          </>
        )}

        {tab === "settings" && (
          <div style={{ maxWidth: "600px" }}>
            <div className="title-card" style={{ borderTop: "8px solid #4f46e5" }}>
              <div className="title-inner">
                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px", color: "#111" }}>Настройки опроса</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Setting 1: Allow Multiple Answers */}
                  <div style={{ paddingBottom: "20px", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "15px", fontWeight: "500", color: "#111" }}>
                        Разрешить множественные ответы
                      </label>
                      <div
                        className={`toggle ${settings.allowMultipleAnswers ? "on" : ""}`}
                        onClick={() => setSettings(s => ({ ...s, allowMultipleAnswers: !s.allowMultipleAnswers }))}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b7280" }}>
                      Один пользователь может ответить на опрос несколько раз
                    </p>
                  </div>

                  {/* Setting 2: Show Progress Bar */}
                  <div style={{ paddingBottom: "20px", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "15px", fontWeight: "500", color: "#111" }}>
                        Показывать прогресс-бар
                      </label>
                      <div
                        className={`toggle ${settings.showProgressBar ? "on" : ""}`}
                        onClick={() => setSettings(s => ({ ...s, showProgressBar: !s.showProgressBar }))}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b7280" }}>
                      Показывать прогресс заполнения опроса respondentам
                    </p>
                  </div>

                  {/* Setting 3: Randomize Questions */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "15px", fontWeight: "500", color: "#111" }}>
                        Перемешивать вопросы
                      </label>
                      <div
                        className={`toggle ${settings.randomizeQuestions ? "on" : ""}`}
                        onClick={() => setSettings(s => ({ ...s, randomizeQuestions: !s.randomizeQuestions }))}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b7280" }}>
                      Показывать вопросы в случайном порядке каждому respondentу
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "answers" && id && (
          <div>
            {responses.length === 0 ? (
              <div className="title-card">
                <div className="title-inner" style={{ textAlign: "center", padding: "60px 24px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                  <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "8px" }}>На этот опрос еще нет ответов</p>
                  <p style={{ fontSize: "14px", color: "#9ca3af" }}>Начните собирать ответы, поделившись с командой</p>
                </div>
              </div>
            ) : (
              <>
                <div className="title-card" style={{ marginBottom: "24px", borderTop: "8px solid #4f46e5" }}>
                  <div className="title-inner">
                    <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Статистика ответов</h2>
                    <div style={{ display: "flex", gap: "24px" }}>
                      <div style={{ paddingBottom: "16px", borderBottom: "2px solid #e5e7eb" }}>
                        <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>Всего ответов</div>
                        <div style={{ fontSize: "24px", fontWeight: "700", marginTop: "4px" }}>{responses.length}</div>
                      </div>
                      <div style={{ paddingBottom: "16px", borderBottom: "2px solid #e5e7eb" }}>
                        <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>Вопросов</div>
                        <div style={{ fontSize: "24px", fontWeight: "700", marginTop: "4px" }}>{questions.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="title-card" style={{ marginBottom: "16px" }}>
                    <div className="title-inner">
                      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>{q.title}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {(q.options || []).map((opt, oIdx) => {
                          const cnt = responses.filter(r => r.answers && r.answers[qIdx] && r.answers[qIdx].answer === opt).length;
                          const pct = responses.length > 0 ? ((cnt / responses.length) * 100).toFixed(1) : 0;
                          return (
                            <div key={oIdx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>{opt}</span>
                                <span style={{ fontSize: "13px", color: "#6b7280" }}>{cnt} ({pct}%)</span>
                              </div>
                              <div style={{ width: "100%", height: "24px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                                <div style={{ width: `${(cnt / Math.max(...(q.options || []).map(opt => responses.filter(r => r.answers && r.answers[qIdx] && r.answers[qIdx].answer === opt).length), 1)) * 100}%`, height: "100%", background: ["#4f46e5","#ef4444","#f59e0b","#22c55e","#06b6d4","#ec4899","#8b5cf6","#14b8a6"][qIdx % 8] }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {tab === "answers" && !id && (
          <div className="title-card">
            <div className="title-inner" style={{ textAlign: "center", padding: "60px 24px" }}>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>
                Сохраните форму, чтобы увидеть ответы
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
