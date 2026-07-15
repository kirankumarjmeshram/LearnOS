# System Architecture

# LearnOS

Version: v0.1 Beta

---

# Overview

LearnOS follows a modular, AI-first architecture designed for rapid development during the hackathon while remaining scalable for future production deployments.

The architecture separates:

- Presentation Layer
- Business Logic
- AI Layer
- Data Layer
- Integration Layer

Every request flows through a centralized AI Orchestrator, allowing LearnOS to remain flexible regardless of which AI model or external services are used.

---

# High Level Architecture

```

                            Browser

                               │

                               ▼

                      Next.js Frontend

                               │

                               ▼

                      Express.js Backend

                               │

         ┌─────────────────────┼─────────────────────┐

         │                     │                     │

         ▼                     ▼                     ▼

 Authentication         Business APIs         AI Gateway

         │                     │                     │

         │                     ▼                     ▼

         │             MongoDB Database      AI Orchestrator

         │                     │                     │

         │                     │          ┌──────────┴──────────┐

         │                     │          │                     │

         │                     ▼          ▼                     ▼

         │              Learning Twin  AI Engines        External APIs

         │                              │                     │

         │                              ▼                     ▼

         │                         Gemini API      YouTube/GitHub/

         │                                        Google Books

         │

         ▼

 Supabase Storage

```

---

# Layers

## Presentation Layer

Technology

- Next.js 15
- JavaScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Responsibilities

- Authentication
- Dashboard
- AI Chat
- Learning Sessions
- Calendar
- Progress
- Assignments
- User Profile

The frontend contains no AI logic.

It only renders structured data received from the backend.

---

# Backend Layer

Technology

Express.js

Responsibilities

- REST APIs
- Authentication
- Database Operations
- File Upload
- AI Gateway
- Resource Aggregation
- Session Management

Business logic lives here.

---

# AI Layer

This is the core of LearnOS.

Contains

AI Orchestrator

↓

Learning Twin

↓

AI Engines

↓

Gemini

The frontend never communicates directly with Gemini.

---

# Data Layer

Hackathon

MongoDB Atlas

Stores

Users

Learning Twin

Learning Journey

Learning Sessions

Assignments

Progress

Projects

Resources

Future

PostgreSQL

Prisma

---

# Storage Layer

Technology

Supabase Storage

Stores

- PDFs
- Books
- Images
- Notes
- Slides

No AI processing occurs inside storage.

---

# External Services

Authentication

Clerk

AI

Gemini

Video

YouTube API

Books

Google Books API

Repositories

GitHub API

Calendar

Google Calendar

Email

Resend

Storage

Supabase Storage

---

# Folder Structure

```

learnos/

docs/

frontend/

backend/

shared/

prompts/

engines/

orchestrator/

```

---

# Frontend Structure

```

frontend/

src/

app/

components/

features/

dashboard/

mentor/

journey/

sessions/

assignments/

calendar/

progress/

onboarding/

hooks/

contexts/

services/

utils/

styles/

```

---

# Backend Structure

```

backend/

src/

controllers/

routes/

middleware/

models/

services/

engines/

orchestrator/

integrations/

prompts/

validators/

utils/

config/

```

---

# AI Engine Structure

```

engines/

assessment/

roadmap/

resource/

ranking/

learning-object/

session/

mentor/

assignment/

evaluation/

adaptive/

calendar/

reminder/

career/

```

Every engine is isolated.

Each engine contains

```

engine/

controller.js

service.js

prompt.md

schema.js

validator.js

```

---

# API Flow

Example

Generate Roadmap

```

Frontend

↓

POST /api/ai/orchestrate

↓

Express

↓

AI Orchestrator

↓

Roadmap Engine

↓

Gemini

↓

Validator

↓

MongoDB

↓

Frontend

```

---

# Resource Flow

```

Need React Hooks

↓

Resource Engine

↓

YouTube API

↓

GitHub API

↓

Google Books API

↓

Official Docs

↓

Collect

↓

Filter

↓

Rank

↓

Learning Object Engine

↓

Learning Session

↓

Dashboard

```

---

# PDF Flow

```

Upload PDF

↓

Supabase Storage

↓

Extract Text

↓

Chunk

↓

Metadata

↓

Learning Objects

↓

Learning Twin

↓

AI Mentor

```

---

# Learning Session Flow

```

Roadmap

↓

Learning Objects

↓

Session Builder

↓

Calendar

↓

Dashboard

↓

Learner

↓

Assignment

↓

Evaluation

↓

Adaptive Engine

↓

Learning Twin Update

```

---

# AI Request Flow

```

User Question

↓

Frontend

↓

Backend

↓

AI Orchestrator

↓

Context Builder

↓

Relevant Engine

↓

Gemini

↓

Validator

↓

Structured JSON

↓

Database

↓

Frontend

```

---

# Authentication Flow

```

User

↓

Clerk

↓

JWT

↓

Express Middleware

↓

Protected API

↓

Database

```

---

# Calendar Flow

```

Session Generated

↓

Calendar Engine

↓

Google Calendar

↓

Email Reminder

↓

Dashboard

```

---

# Email Flow

```

Reminder Engine

↓

Email Template

↓

Resend

↓

User

```

---

# Database Communication

Every module communicates through services.

Controllers never access MongoDB directly.

```

Controller

↓

Service

↓

Model

↓

MongoDB

```

---

# AI Communication

Every AI call goes through one endpoint.

```

POST

/api/ai/orchestrate

```

The Orchestrator decides

- Context
- Prompt
- Engine
- Validation
- Storage

---

# Error Handling

If external API fails

↓

Retry

↓

Fallback

↓

Cached Response

↓

Error Log

↓

Frontend Notification

---

# Security

Protected APIs

JWT Authentication

Rate Limiting

Input Validation

File Validation

Environment Variables

Prompt Validation

JSON Validation

---

# Deployment Architecture

Frontend

↓

Vercel

Backend

↓

Render

Database

↓

MongoDB Atlas

Storage

↓

Supabase Storage

Email

↓

Resend

AI

↓

Gemini API

---

# Logging

Log

API Requests

AI Requests

Errors

Learning Events

Authentication

File Uploads

---

# Scalability Plan

Current

Monolithic Express Application

↓

Future

Modular Monolith

↓

Microservices

Possible Services

Authentication

Learning

AI

Resources

Calendar

Notification

Analytics

Career

Marketplace

---

# Future Improvements

- NestJS Migration
- PostgreSQL + Prisma
- Redis Cache
- BullMQ Queue
- pgvector
- Docker
- Kubernetes
- Multi-Agent AI
- Event-Driven Architecture

---

# Design Principles

The LearnOS architecture follows these principles:

- Modular
- AI-first
- Engine-based
- API-driven
- Context-aware
- Scalable
- Replaceable AI providers
- Separation of concerns
- Frontend independent of AI implementation
- Future-ready for production

The hackathon implementation intentionally keeps the architecture simple while ensuring every major component can evolve without rewriting the entire system.
