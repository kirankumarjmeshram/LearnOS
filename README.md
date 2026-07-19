<div align="center">

---

# 📖 Overview

Learning online is overwhelming.

Thousands of courses...
No clear roadmap...
No personalized guidance...
No mentor.

**LearnOS** solves this by generating a complete AI-powered learning experience tailored to every learner.

Simply enter your learning goal, and LearnOS will generate:

- 🛣 Personalized Learning Roadmap
- 📚 AI-Generated Lessons
- 🤖 Context-Aware AI Tutor
- 📈 Progress Tracking
- 📝 Smart Notes
- 📂 Learning Resources

Think of it as **an AI Operating System for Learning**.

---

# ✨ Features

## 🎯 Personalized AI Roadmaps

Generate structured learning paths for any topic.

Examples:

- React
- Machine Learning
- DevOps
- Data Science
- System Design
- Java
- Python
- Cyber Security

---

## 📚 AI Lesson Generation

Every lesson is generated dynamically using Gemini AI.

Lessons include:

- Explanation
- Examples
- Code snippets
- Key concepts
- Best practices

---

## ⚡ Background Lesson Generation

After roadmap creation,

LearnOS automatically generates lessons in the background.

Users don't need to wait for every lesson to be created.

---

## 🤖 AI Tutor

Every lesson includes a dedicated AI Tutor.

The tutor already understands:

- Current lesson
- Module
- Roadmap
- Learning objectives

Quick actions include:

- Explain Simply
- Summarize Lesson
- Quiz Me
- Interview Questions

Users can also ask custom questions naturally.

---

## 📈 Progress Tracking

Track learning progress with:

- Completed lessons
- Progress percentage
- Resume learning
- Current streak
- Active roadmap

---

## 📝 Notes

Create personal notes while learning.

Keep important concepts alongside every lesson.

---

## 📂 Learning Resources

Access curated learning resources directly inside the lesson.

Examples:

- Documentation
- Articles
- Videos
- References

---

## 🌗 Dark / Light Mode

Supports:

- Light
- Dark
- System Theme

---

## 👤 User Authentication

Secure authentication powered by Clerk.

Supports:

- Email Login
- Social Login
- Protected Routes

---

# 🖥 Screenshots

> Add screenshots here

```
Landing Page

Dashboard

Roadmap

Lesson

AI Tutor

Profile

Settings
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Shadcn UI
- Lucide Icons

---

## Backend

- Next.js Route Handlers
- Server Components
- MongoDB
- Mongoose

---

## AI

- Google Gemini
- Prompt Engineering

Features:

- Roadmap Generation
- Lesson Generation
- AI Tutor

---

## Authentication

- Clerk

---

## Database

MongoDB

Collections:

- Users
- Roadmaps
- Phases
- Lessons
- Progress
- Notes

---

# 🏗 Architecture

```
                 User
                   │
                   ▼
          Clerk Authentication
                   │
                   ▼
            Next.js App Router
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 Roadmap Generator      Lesson Generator
        │                     │
        └──────────┬──────────┘
                   ▼
             MongoDB Database
                   │
                   ▼
             Learning Workspace
                   │
     ┌─────────────┼──────────────┐
     ▼             ▼              ▼
 AI Tutor      Notes        Resources
```

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/yourusername/learnos.git
```

---

## Install

```bash
npm install
```

---

## Environment Variables

Create

```
.env.local
```

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

MONGODB_URI=

GEMINI_API_KEY=
```

---

## Run

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📂 Project Structure

```
src/
│
├── app/
├── components/
├── features/
│   ├── dashboard/
│   ├── roadmap/
│   ├── learning/
│   ├── profile/
│   └── settings/
│
├── services/
├── lib/
├── hooks/
├── models/
└── utils/
```

---

# 🎯 Key Highlights

✅ AI Generated Roadmaps

✅ AI Generated Lessons

✅ Background Lesson Generation

✅ AI Tutor

✅ Progress Tracking

✅ Notes

✅ Learning Resources

✅ Responsive Design

✅ Dark Mode

✅ Secure Authentication

---

# 🔮 Future Improvements

- Voice AI Tutor
- Multi-language Support
- Flashcards
- AI Revision Mode
- Coding Playground
- Achievement Badges
- Community Learning
- Learning Analytics
- Export Notes
- Mobile App

---

# 🤝 Contributing

Contributions are welcome!

Fork the repository.

Create your feature branch.

Commit your changes.

Open a Pull Request.

---

# 📄 License

MIT License

---

<div align="center">
