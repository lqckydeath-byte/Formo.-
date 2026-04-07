import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../../shared/api/client";

const COLORS = ["#4f46e5","#ef4444","#f59e0b","#22c55e","#06b6d4","#ec4899","#8b5cf6","#14b8a6"];

function StatCard({ item }) {
  const dataWithPercent = item.data
    .filter(d => d.value > 0)
    .map(d => ({
      ...d,
      pct: ((d.value / item.totalAnswers) * 100).toFixed(1)
    }));

  const maxValue = Math.max(...dataWithPercent.map(d => d.value), 1);

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", color: "#111" }}>
        {item.question}
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {dataWithPercent.map((d, i) => (
          <div key={`${item.question}-option-${i}`} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                {d.name}
              </span>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                {d.value} ({d.pct}%)
              </span>
            </div>
            <div style={{
              width: "100%",
              height: "24px",
              background: "#f3f4f6",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${(d.value / maxValue) * 100}%`,
                height: "100%",
                background: d.color,
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SurveyAnswers() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [surveyData, answersData] = await Promise.all([
        apiClient.surveys.getById(id),
        apiClient.answers.getBySurvey(id)
      ]);
      setSurvey(surveyData.data);
      setResponses(answersData.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb"
      }}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #4f46e5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontSize: "16px", color: "#6b7280" }}>Загрузка ответов...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Опрос не найден</div>;
  }

  // Prepare data for charts
  const chartData = survey.questions && survey.questions.length > 0 ? survey.questions.map((q, idx) => {
    const options = q.options || [];
    const data = options.map((opt, optIdx) => ({
      name: opt,
      value: responses.filter(r => r.answers && r.answers[idx] && r.answers[idx].answer === opt).length,
      color: COLORS[optIdx % COLORS.length]
    }));

    return {
      question: q.title,
      totalAnswers: responses.length,
      data
    };
  }) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f9fafb; }
        
        .page-content { animation: fadeIn 0.4s ease-out; }

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

        .nav-spacer { flex: 1; }

        .nav-actions { display: flex; align-items: center; gap: 8px; }

        .nav-btn {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #fff;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .nav-btn:hover { background: #f3f4f6; }

        .container {
          max-width: 880px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .header {
          margin-bottom: 32px;
        }

        .header-title {
          font-size: 28px;
          font-weight: 600;
          color: #111;
          margin-bottom: 8px;
        }

        .stats {
          display: flex; gap: 24px; margin-top: 16px;
        }

        .stat-box {
          padding: 16px 20px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 3px solid #4f46e5;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #111;
          margin-top: 4px;
        }

        .charts-container {
          display: flex; flex-direction: column; gap: 24px;
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-logo" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>
          <img src="/fromo.png" alt="Formo" style={{ width: "80px", height: "80px" }} />
          <span className="nav-logo-text" style={{ marginLeft: "8px" }}>Ответы</span>
        </div>
        <div className="nav-spacer" />
      </nav>

      <div className="page-content">
        <div className="container">
        <div className="header">
          <h1 className="header-title">{survey?.title}</h1>
          <div className="stats">
            <div className="stat-box">
              <div className="stat-label">Всего ответов</div>
              <div className="stat-value">{responses.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Вопросов</div>
              <div className="stat-value">{survey?.questions?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="charts-container">
          {responses.length === 0 ? (
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "40px 24px",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "16px" }}>
                На этот опрос еще нет ответов
              </p>
              <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                Поделитесь ссылкой на опрос, чтобы получить ответы от респондентов
              </p>
            </div>
          ) : (
            chartData && chartData.length > 0 ? chartData.map((item, idx) => (
              <StatCard key={`survey-stat-${idx}`} item={item} />
            )) : (
              <div style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "40px 24px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
              }}>
                <p style={{ fontSize: "16px", color: "#6b7280" }}>Нет вопросов в этом опросе</p>
              </div>
            )
          )}
        </div>
        </div>
      </div>
    </>
  );
}
