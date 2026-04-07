# Formo - Конструктор Форм и Опросов

## Описание проекта

**Formo** — это веб-приложение для создания, редактирования и управления формами и опросами, а также отслеживания ответов пользователей.

**Основное назначение**: Предоставить простой инструмент для создания профессиональных опросов с интуитивным интерфейсом, аналогично Google Forms.

Проект разработан как курсовая работа по дисциплине **ПМ04 "Проектирование и обеспечение бесперебойной работы web-сайта"**.

## Функциональность

- ✓ **Регистрация и аутентификация** — создание аккаунта, вход в систему с JWT токенами
- ✓ **Создание опросов** — использование 6 предустановленных шаблонов или создание с нуля
- ✓ **Редактирование форм** — добавление, удаление и изменение вопросов
- ✓ **Просмотр ответов** — статистика по каждому опросу с анимированным интерфейсом
- ✓ **Поиск форм** — быстрый поиск по названию в реальном времени
- ✓ **Управление профилем** — отображение информации пользователя, выход
- ✓ **Полная адаптивность** — работает на десктопе, планшете и смартфоне
- ✓ **Безопасность** — хеширование паролей (bcrypt), защита маршрутов (JWT)

## Стек Технологий

### Frontend
| Технология | Версия | Назначение |
|-----------|--------|-----------|
| React | 19.2.4 | Библиотека для создания пользовательского интерфейса |
| React Router | v6.x | Навигация между страницами приложения |
| HTML5 | - | Семантическая разметка документа |
| CSS3 | - | Стилизация с встроенными стилями (CSS-in-JS) |
| JavaScript ES6+ | - | Логика приложения с асинхронными операциями |
| React Testing Library | 16.3.2 | Тестирование компонентов |

### Backend
| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Node.js | 14+ | Среда выполнения JavaScript |
| Express.js | 5.2.1 | REST API сервер |
| MongoDB | - | NoSQL база данных |
| Mongoose | 7.0.0 | Object Data Mapper для MongoDB |
| JSON Web Token | 9.0.0 | Аутентификация пользователей |
| bcryptjs | 2.4.3 | Хеширование паролей |
| CORS | 2.8.6 | Кроссдоменные запросы |
| dotenv | 16.0.3 | Переменные окружения |
| Nodemon | 3.1.14 | Автоперезагрузка при разработке |

### Инструменты разработки
- npm — менеджер пакетов
- Git/GitHub — контроль версий
- Chrome DevTools — отладка
- Lighthouse — оптимизация производительности

## Архитектура проекта

```
fromo/
├── client/ (Frontend - React)
│   ├── public/
│   │   ├── index.html — главная HTML страница
│   │   ├── fromo.png — логотип приложения
│   │   └── manifest.json
│   ├── src/
│   │   ├── features/ — модули функциональности
│   │   │   ├── auth/ — аутентификация
│   │   │   │   └── pages/
│   │   │   │       ├── Login.jsx — страница входа
│   │   │   │       └── Register.jsx — страница регистрации
│   │   │   ├── home/ — главная страница
│   │   │   │   └── pages/
│   │   │   │       └── Home.jsx — список опросов, поиск, шаблоны
│   │   │   ├── surveys/ — работа с опросами
│   │   │   │   └── pages/
│   │   │   │       ├── SurveyEditor.jsx — создание/редактирование форм
│   │   │   │       └── SurveyAnswers.jsx — просмотр ответов и статистики
│   │   │   ├── forms/ — формы обратной связи
│   │   │   │   └── pages/
│   │   │   │       └── FormSubmitted.jsx — страница подтверждения
│   │   │   └── shared/ — общие компоненты
│   │   │       ├── api/
│   │   │       │   └── client.js — API клиент для запросов
│   │   │       ├── components/ — переиспользуемые компоненты
│   │   │       ├── hooks/ — React hooks
│   │   │       └── utils/ — служебные функции
│   │   ├── App.js — корневой компонент с Router
│   │   ├── index.js — точка входа
│   │   ├── App.css — базовые стили
│   │   └── index.css — глобальные стили
│   ├── package.json — зависимости и скрипты
│   └── README.md — документация клиента, DOCUMENTATION.MD - техническая документация и API
│
├── server/ (Backend - Node.js)
│   ├── config/
│   │   └── db.js — конфигурация MongoDB
│   ├── models/ — Mongoose схемы БД
│   │   ├── User.js — схема пользователя
│   │   ├── Survey.js — схема опроса/формы
│   │   └── Answer.js — схема ответов
│   ├── routes/ — API маршруты
│   │   ├── auth.js — эндпоинты аутентификации
│   │   ├── surveys.js — эндпоинты форм (CRUD)
│   │   └── answers.js — эндпоинты ответов
│   ├── index.js — главный файл сервера
│   ├── package.json — зависимости и скрипты
│   ├── .env.example — пример переменных окружения
│   └── node_modules/ — установленные пакеты
│
└── README.md — этот файл
```

## Установка и Запуск (Инструкция)

### Требования
- **Node.js** версии 14 или выше
- **npm** (идет в комплекте с Node.js)
- **MongoDB** (локально или облачно)

### Пошаговая установка

#### Шаг 1: Клонирование репозитория
```bash
git clone <URL-репозитория>
cd fromo
```

#### Шаг 2: Установка зависимостей Backend
```bash
cd server
npm install
```
Это установит все пакеты из `package.json`:
- express, cors, mongoose, bcryptjs, jsonwebtoken, dotenv, nodemon

#### Шаг 3: Конфигурация Backend
Создайте файл `.env` в папке `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/formo
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

Или скопируйте из примера:
```bash
cp .env.example .env
```

#### Шаг 4: Запуск Backend
```bash
npm run dev
```
Вывод должен быть:
```
Сервер запущен на http://localhost:5000
```

#### Шаг 5: Установка зависимостей Frontend (новый терминал)
```bash
cd client
npm install
```
Это установит React, React Router и другие необходимые пакеты.

#### Шаг 6: Запуск Frontend
```bash
npm start
```
Приложение откроется автоматически на `http://localhost:3002`

### Готово!
Теперь вы можете:
1. Зарегистрировать новый аккаунт
2. Войти в систему
3. Создать первый опрос
4. Добавлять вопросы
5. Просматривать ответы

## 📡 REST API Документация

### Base URL
```
http://localhost:5000/api
```

### Аутентификация

#### Регистрация
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Иван",
  "lastName": "Иванов",
  "email": "ivan@example.com",
  "password": "securePassword123"
}

Ответ (201 Created):
{
  "success": true,
  "message": "Регистрация успешна",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com"
  }
}
```

#### Вход в систему
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ivan@example.com",
  "password": "securePassword123"
}

Ответ (200 OK):
{
  "success": true,
  "message": "Вход успешен",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com"
  }
}
```

### Опросы (Surveys)

#### Получить все опросы пользователя
```http
GET /api/surveys
Authorization: Bearer <JWT_TOKEN>

Ответ (200 OK):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Опрос о качестве сервиса",
      "description": "Пожалуйста оцените...",
      "createdBy": "507f1f77bcf86cd799439010",
      "questions": [...],
      "createdAt": "2024-04-06T10:30:00Z"
    }
  ]
}
```

#### Создать новый опрос
```http
POST /api/surveys
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Новый опрос",
  "description": "Описание опроса",
  "questions": [
    {
      "title": "Ваше имя?",
      "type": "text",
      "required": true
    }
  ]
}

Ответ (201 Created):
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Новый опрос",
  ...
}
```

#### Получить опрос по ID
```http
GET /api/surveys/:id
Authorization: Bearer <JWT_TOKEN>

Ответ (200 OK):
{ опрос с полной информацией }
```

#### Обновить опрос
```http
PUT /api/surveys/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Обновленное название",
  "description": "Новое описание"
}

Ответ (200 OK):
{ обновленный опрос }
```

#### Удалить опрос
```http
DELETE /api/surveys/:id
Authorization: Bearer <JWT_TOKEN>

Ответ (200 OK):
{
  "message": "Опрос удален успешно"
}
```

### Ответы (Answers)

#### Сохранить ответ на опрос
```http
POST /api/answers
Content-Type: application/json

{
  "surveyId": "507f1f77bcf86cd799439011",
  "answers": [
    {
      "questionId": "1",
      "answer": "Отличный сервис"
    }
  ]
}

Ответ (201 Created):
{
  "_id": "507f1f77bcf86cd799439013",
  "surveyId": "507f1f77bcf86cd799439011",
  "answers": [...],
  "submittedAt": "2024-04-06T10:35:00Z"
}
```

#### Получить все ответы по опросу
```http
GET /api/answers/survey/:id
Authorization: Bearer <JWT_TOKEN>

Ответ (200 OK):
{
  "data": [
    { ответ 1 },
    { ответ 2 },
    ...
  ]
}
```

## Типы вопросов

В редакторе опросов поддерживаются следующие типы вопросов:
- **Текст (короткий ответ)** — однострочный ввод текста
- **Текст (развёрнутый ответ)** — многострочный ввод текста
- **Один из списка (Radio)** — ровно один выбор из предложенных вариантов
- **Несколько из списка (Checkbox)** — множественный выбор из вариантов
- **Раскрывающийся список (Dropdown)** — выбор из выпадающего списка
- **Шкала** — оценка по шкале от 1 до 5

## Интерфейс и Дизайн

### Цветовая схема
- **Основной цвет**: `#4f46e5` (фиолетовый) — для кнопок, активных элементов
- **Цвет ошибок**: `#ef4444` (красный) — для уведомлений об ошибках
- **Цвет успеха**: `#4ade80` (зеленый) — для успешных операций
- **Нейтральные**: `#111` (черный), `#6b7280` (серый средний), `#9ca3af` (серый светлый)

### Шрифты
- **DM Sans** (Google Fonts) — основной шрифт приложения
- Размеры: заголовки 24-32px, текст 14px, мета-информация 13px

### Анимации
- **fadeIn** — появление элементов (0.3-0.4s)
- **slideIn** — скольжение сверху (0.3s)
- **pulse** — пульсание при клике (0.4s)
- **spin** — вращение спиннера загрузки (1.5s)

### Адаптивность
- **Десктопы** (1024px и больше) — полный функционал
- **Планшеты** (768px - 1024px) — масштабированные элементы
- **Смартфоны** (480px - 768px) — сжатая навигация
- **Мобильные** (<480px, включая мини-телефоны) — минималистичный вид

## Безопасность

### Защита паролей
```javascript
Пароли хешируются с помощью bcryptjs (соль: 10 раундов)
Пароли никогда не хранятся в открытом виде
Минимальная длина: 6 символов
```

### Аутентификация
```javascript
JWT токены (действительны 7 дней)
Токены хранятся в localStorage (только у авторизованного пользователя)
Protected Routes на фронтенде (перенаправление на /login)
```

### CORS защита
```javascript
CORS включен для запросов с localhost:3002
Backend проверяет origin запроса
Без CORS приложение не может отправлять запросы
```

## Производительность

### Core Web Vitals (по Lighthouse)
- **LCP (Largest Contentful Paint)**: ~2-3 секунды
- **FID (First Input Delay)**: <100ms (отличный)
- **CLS (Cumulative Layout Shift)**: <0.1 (отличный)

### Оптимизация
- CSS-in-JS (нет дополнительных загрузок)
- Компоненты загружаются only when needed (код разбит)
- Правильная обработка асинхронности (loading states)
- Нет производительности утечек памяти

## Тестирование

### Установлены инструменты:
- React Testing Library (16.3.2)
- Jest (встроен в react-scripts)

### Запуск тестов:
```bash
cd client
npm test
```

Тесты можно писать для:
- Компонентов (рендер, события)
- Хуков (useState, useEffect)
- Интеграции (вся страница целиком)

## Решение проблем

### MongoDB не подключается
**Ошибка**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Решение**:
```bash
# Запустите MongoDB локально
mongod

# Или используйте облачную БД в .env:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/formo
```

### Порт уже занят
**Ошибка**: `Error: EADDRINUSE: address already in use :::5000`

**Решение**:
```bash
# Найдите и убейте процесс на порту 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Или используйте другой порт в .env
PORT=5001
```

### Frontend не соединяется с Backend
**Ошибка**: `Failed to fetch http://localhost:5000/api/...`

**Решение**:
1. Проверьте, что Backend запущен: `npm run dev` в папке `server/`
2. Проверьте правильность URL в `client/src/shared/api/client.js`
3. Очистите браузер кеш (Ctrl+Shift+Delete)
4. Проверьте CORS в `server/index.js`

### npm install зависает
**Решение**:
```bash
# Очистите npm кеш
npm cache clean --force

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

## Полезные Команды

```bash
# Frontend
cd client
npm start              # Запуск в режиме разработки
npm run build         # Сборка для production
npm test              # Запуск тестов
npm eject             # Выброс конфигурации (опасно!)

# Backend
cd server
npm run dev           # Запуск с автоперезагрузкой (nodemon)
npm start             # Запуск в production режиме

# Git
git status            # Проверить статус файлов
git add .            # Добавить все файлы
git commit -m "сообщение"  # Коммит
git push             # Отправить на сервер
```

## gКлючевые Файлы

| Файл | Описание |
|------|---------|
| `client/src/App.js` | Конфигурация роутов и Protected Routes |
| `client/src/features/home/pages/Home.jsx` | Главная страница, поиск, шаблоны |
| `client/src/features/auth/pages/Login.jsx` | Форма входа с валидацией |
| `client/src/shared/api/client.js` | API клиент для запросов |
| `server/index.js` | Главный файл сервера |
| `server/models/User.js` | Схема пользователя с хешированием |
| `server/routes/auth.js` | Эндпоинты регистрации и входа |
| `server/config/db.js` | Подключение к MongoDB |

## Окружение переменные (.env)

```env
# Backend (.env в папке server/)
PORT=5000                                    # Порт сервера
MONGODB_URI=mongodb://localhost:27017/formo # Строка подключения MongoDB
JWT_SECRET=your-secret-key-here             # Секретный ключ для JWT
NODE_ENV=development                        # Режим: development или production
```

```env
# Frontend — использует REACT_APP_API_URL в файле client/src/shared/api/client.js
# По умолчанию: http://localhost:5000/api
```

## Развертывание (Production)

### Frontend на Vercel
```bash
cd client
npm run build
# Загрузите папку `build/` на Vercel (https://vercel.com)
```

### Backend на Render
```bash
# Создайте .env на сервере:
MONGODB_URI=<облачная MongoDB>
JWT_SECRET=<случайный ключ>
NODE_ENV=production

# Развернется автоматически
```

## Лицензия

MIT License — проект распространяется свободно для коммерческого и личного использования.

## Информация о Проекте

- **Курс**: ПМ04 "Проектирование и обеспечение бесперебойной работы web-сайта"
- **Группа**: ПО 2403
- **Дата создания**: 03.04.2026
- **Статус**: Завершен и готов к оценке

## Поддержка

Если у вас есть вопросы:
1. Проверьте раздел **"Решение проблем"** выше
2. Создайте Issue в GitHub репозитории
3. Посмотрите примеры в папке `examples/` (если есть)
4. Напишите мне в тг @accursed_soul

---

**Сделано с большой любовью!**
Спасибо, что используете **Formo**! 

