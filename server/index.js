const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Импортируем routes
const authRoutes = require('./routes/auth');
const surveysRoutes = require('./routes/surveys');
const answersRoutes = require('./routes/answers');

const app = express();

// Подключаемся к MongoDB
connectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/answers', answersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
