# Backend Architecture

# LearnOS

Version: v1.0

---

# Overview

The LearnOS backend is an Engine-Oriented Architecture.

The backend is responsible for

- Authentication
- Business Logic
- AI Orchestration
- Learning Intelligence
- Database
- Integrations
- Resource Aggregation

The frontend never communicates directly with AI providers.

Every AI interaction passes through the AI Orchestrator.

---

# Technology Stack

Runtime

Node.js

Framework

Express.js

Database

MongoDB Atlas

Authentication

Clerk

Storage

Supabase Storage

AI

Gemini API

Email

Resend

Calendar

Google Calendar API

Search APIs

YouTube

GitHub

Google Books

---

# Backend Philosophy

The backend should

- Be modular
- Be engine-driven
- Be AI-first
- Be scalable
- Return structured JSON

The backend should NOT

- Render HTML
- Contain UI logic
- Store prompts inside controllers
- Mix AI logic with CRUD operations

---

# Project Structure

backend/

src/

config/

controllers/

routes/

middleware/

services/

engines/

orchestrator/

integrations/

models/

validators/

prompts/

utils/

constants/

jobs/

lib/

server.js

---

# Folder Structure

```
src/

config/

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

jobs/

```

---

# Controllers

Controllers should only

- Validate request
- Call services
- Return response

Never

- Call Gemini
- Access MongoDB directly
- Build prompts

Example

```
JourneyController

↓

JourneyService

↓

Orchestrator

↓

Response
```

---

# Routes

```
routes/

auth.routes.js

journey.routes.js

mentor.routes.js

assessment.routes.js

session.routes.js

resource.routes.js

assignment.routes.js

calendar.routes.js

upload.routes.js

progress.routes.js

```

---

# Services

Business logic lives here.

Example

```
JourneyService

MentorService

CalendarService

NotificationService

UploadService

ProgressService

```

Services communicate with

- Models
- Engines
- Integrations

---

# Models

MongoDB Models

```
User

LearningTwin

Journey

Progress

Assignment

Session

Resource

Upload

Notification

MentorChat

```

---

# AI Orchestrator ⭐⭐⭐⭐⭐

Central brain.

Every AI request enters here.

Responsibilities

- Receive AI request
- Determine action
- Load Learning Twin
- Build AI context
- Call required engines
- Validate AI output
- Store results
- Return response

Example

```
Frontend

↓

POST /api/ai/orchestrate

↓

Orchestrator

↓

Roadmap Engine

↓

Session Engine

↓

Calendar Engine

↓

Return JSON
```

---

# Engine Directory

```
engines/

assessment/

roadmap/

resource-search/

resource-ranking/

learning-object/

session/

mentor/

quiz/

assignment/

evaluation/

adaptive/

calendar/

analytics/

career/

```

Every engine is isolated.

---

# Engine Structure

Every engine follows

```
roadmap/

index.js

service.js

prompt.md

schema.js

validator.js

```

Responsibilities

index.js

Entry point

service.js

Business logic

prompt.md

System prompt

schema.js

JSON schema

validator.js

Output validation

---

# Prompt Builder

Purpose

Generate AI prompts dynamically.

Input

Global Prompt

↓

Engine Prompt

↓

Learning Twin

↓

Journey Context

↓

Current Session

↓

User Request

↓

JSON Schema

↓

Gemini

Prompt Builder ensures

- Small prompts
- Relevant context
- Better AI accuracy

---

# Context Builder

Purpose

Prepare AI context.

Instead of sending

Entire database

Send

Current Lesson

Current Module

Weak Skills

Learning Style

Current Assignment

Uploaded Material

Journey Goal

---

# AI Validator

Every AI response passes validation.

Checks

- Valid JSON
- Required fields
- Empty arrays
- Invalid durations
- Duplicate modules
- Missing prerequisites

Invalid output

↓

Retry

↓

Fallback

---

# Integrations

```
integrations/

gemini/

youtube/

github/

books/

calendar/

gmail/

supabase/

resend/

```

Every integration has

client.js

service.js

No business logic.

---

# Jobs

Future scheduled jobs

```
jobs/

dailyReminder.job.js

weeklySummary.job.js

revisionReminder.job.js

calendarSync.job.js

analytics.job.js

```

Hackathon

Manual execution

Future

Cron Jobs

BullMQ

---

# Middleware

```
auth.middleware.js

logger.middleware.js

error.middleware.js

validate.middleware.js

rateLimit.middleware.js

```

---

# Utilities

```
logger.js

response.js

date.js

prompt.js

json.js

resourceRanker.js

```

---

# Validators

```
journey.validator.js

roadmap.validator.js

mentor.validator.js

assignment.validator.js

resource.validator.js

```

---

# API Flow

```
Frontend

↓

Express Route

↓

Controller

↓

Service

↓

Orchestrator

↓

Engine

↓

Gemini

↓

Validator

↓

MongoDB

↓

Response

```

---

# Resource Flow

```
Need Docker Resources

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

Normalize

↓

Filter

↓

Rank

↓

Learning Objects

↓

Session Builder

```

---

# Learning Journey Flow

```
AI Onboarding

↓

Assessment

↓

Learning Twin

↓

Roadmap

↓

Learning Objects

↓

Sessions

↓

Assignments

↓

Calendar

↓

Dashboard

```

---

# Adaptive Learning Flow

```
Quiz

↓

Evaluation

↓

Learning Twin

↓

Adaptive Engine

↓

Roadmap Update

↓

Session Update

↓

Calendar Update

```

---

# Upload Flow

```
Upload

↓

Supabase Storage

↓

Extract Text

↓

Metadata

↓

Learning Objects

↓

Mentor Context

```

---

# Logging

Log

API Requests

Errors

AI Calls

Prompt Usage

Session Events

Journey Updates

Assignment Submission

Evaluation Results

---

# Error Handling

External API Failure

↓

Retry

↓

Fallback

↓

Log

↓

Frontend Notification

---

# Security

JWT Authentication

Rate Limiting

Input Validation

Prompt Validation

Environment Variables

Secure File Upload

Output Validation

---

# Caching

Hackathon

No Cache

Future

Redis

Cached

Resources

Learning Objects

Roadmaps

AI Responses

---

# Deployment

Backend

Render

Database

MongoDB Atlas

Storage

Supabase

AI

Gemini

Email

Resend

Frontend

Vercel

---

# Future Evolution

Current

Monolithic Express

↓

Modular Monolith

↓

Microservices

Possible Services

Authentication

AI

Learning

Calendar

Analytics

Career

Marketplace

Notifications

---

# Backend Design Principles

The backend follows

- Engine-Based Architecture
- AI-Oriented Design
- Single Responsibility
- Modular Services
- Context-Driven AI
- Structured JSON
- Replaceable AI Models
- Scalable Integrations
- Thin Controllers
- Thick Services

The backend acts as the operating system kernel of LearnOS, coordinating every learning experience while remaining independent of any single AI provider.
