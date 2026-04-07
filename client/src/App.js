import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './features/home/pages/Home';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import SurveyEditor from './features/surveys/pages/SurveyEditor';
import SurveyAnswers from './features/surveys/pages/SurveyAnswers';
import RespondentForm from './features/surveys/pages/RespondentForm';
import FormSubmitted from './features/forms/pages/FormSubmitted';

// Simple Protected Route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><SurveyEditor /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><SurveyEditor /></ProtectedRoute>} />
        <Route path="/respond/:id" element={<ProtectedRoute><RespondentForm /></ProtectedRoute>} />
        <Route path="/answers/:id" element={<ProtectedRoute><SurveyAnswers /></ProtectedRoute>} />
        <Route path="/submitted" element={<FormSubmitted />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;