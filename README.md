# 🩺 Dr. AI — Intelligent Medical Assistant

> **Hack2Skill PromptWars Submission** | Vertical: **Healthcare AI**

---

## 🎯 Chosen Vertical

**Healthcare / Medical Assistant** — An AI-powered doctor assistant that enables users to chat about symptoms, get medication info, book appointments, and access lab test information — powered by Google Gemini AI.

---

## 💡 Approach & Logic

Dr. AI is a full-stack intelligent medical assistant built with:

- **React 19** (Frontend) with multi-page routing via React Router
- **Flask** (Python Backend) with REST API endpoints
- **Google Gemini 2.5 Flash** (AI Model via Gemini API)
- **JWT Authentication** for secure user sessions

The core AI logic uses a carefully crafted medical system prompt that:
1. Keeps all responses health-focused and compassionate
2. Maintains conversation history (last 10 messages) for context-aware replies
3. Always reminds users to consult real healthcare professionals
4. Uses Gemini's built-in safety settings to block harmful content

---

## 🏗️ How the Solution Works

```
User Input
   ↓
React Frontend (Auth + UI)
   ↓
Flask REST API (/chat-with-history)
   ↓
Google Gemini 2.5 Flash (AI with medical context prompt)
   ↓
Structured Response → Rendered in Chat UI
```

### Key Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Signup / Login with JWT tokens |
| 💬 AI Medical Chat | Context-aware Q&A with 10-message history |
| 📋 Patient Info | Collect and display patient health details |
| 💊 Medication Info | AI-powered medication information lookup |
| 🧪 Lab Info | Access and understand lab test results |
| 📅 Appointment Booking | Schedule doctor appointments |
| 🌙 Dark / Light Theme | Accessible UI with theme toggle |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7 |
| Backend | Python Flask, Flask-CORS |
| AI Model | Google Gemini 2.5 Flash |
| Auth | JWT (JSON Web Tokens) |
| Styling | Custom CSS |
| PDF Export | jsPDF |

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dr-ai.git
cd dr-ai
```

### 2. Frontend Setup

```bash
npm install
```

Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

### 3. Backend Setup

```bash
cd Backend
pip install -r requirements.txt
```

Create a `Backend/.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_jwt_secret_key_here
```

```bash
python app.py
```

The app runs at `http://localhost:5173` and the API at `http://localhost:5000`.

---

## 📌 Assumptions Made

- Users understand this is an AI assistant and **not a replacement** for real medical advice
- The app targets general health Q&A — not emergency medical situations
- Authentication is demo-grade (password hashing recommended for production)
- Conversation history is session-based (not persisted across browser sessions)
- `users.json` acts as a lightweight database for the demo

---

## 📊 Evaluation Alignment

| Criteria | Implementation |
|----------|---------------|
| ✅ Code Quality | Component-based React architecture, modular Flask routes |
| ✅ Security | JWT auth, `.env` secrets excluded, CORS configured, safety filters |
| ✅ Efficiency | Gemini Flash model, only last 10 messages sent as context |
| ✅ Accessibility | Dark/Light theme toggle, clean readable UI |
| ✅ Problem Alignment | Healthcare vertical, smart dynamic AI assistant |
| ✅ Smart Decision Making | Contextual prompting, conversation history, medical safety guardrails |

---

## 📁 Project Structure

```
dr-ai/
├── src/
│   ├── Components/       # Navbar, ChatBox, Hero, Footer, etc.
│   ├── Pages/            # Home, ChatPage, AuthPage, PatientInfo, etc.
│   ├── context/          # ThemeContext
│   └── utils/            # geminiApi.js
├── Backend/
│   ├── app.py            # Flask API (chat, auth, models)
│   └── requirements.txt
├── public/
├── index.html
└── package.json
```
