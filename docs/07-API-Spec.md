# API Specification

# LearnOS

Version: v0.1 Beta

---

# Overview

LearnOS exposes REST APIs that power the frontend.

The APIs are organized by business capability rather than database collections.

The frontend never communicates directly with AI providers.

Every AI request goes through the LearnOS AI Orchestrator.

Base URL

/api

---

# Authentication

Authentication Provider

Clerk

Protected Routes

Bearer Token

```
Authorization: Bearer <JWT>
```

---

# API Groups

Authentication

Users

Learning Journey

Learning Sessions

AI

Mentor

Assignments

Progress

Resources

Calendar

Uploads

Notifications

Integrations

---

# Authentication APIs

## Current User

GET

```
/api/users/me
```

Response

```json
{
  "id":"",
  "name":"",
  "email":"",
  "avatar":""
}
```

---

# AI Onboarding APIs

## Save Onboarding

POST

```
/api/onboarding
```

Request

```json
{
  "goal":"DevOps",
  "careerGoal":"Job",
  "timeline":"3 months",
  "weeklyHours":8,
  "learningStyle":"Visual",
  "language":"English",
  "assessment":true
}
```

Response

```json
{
  "success":true,
  "journeyId":"..."
}
```

---

## Update Onboarding

PUT

```
/api/onboarding
```

---

# AI Assessment

## Generate Assessment

POST

```
/api/assessment/generate
```

Request

```json
{
  "skill":"DevOps"
}
```

Response

```json
{
  "questions":[]
}
```

---

## Submit Assessment

POST

```
/api/assessment/submit
```

Request

```json
{
  "answers":[]
}
```

Response

```json
{
  "skillGraph":{},
  "recommendation":""
}
```

---

# AI Orchestrator ⭐⭐⭐⭐⭐

Single AI Gateway

POST

```
/api/ai/orchestrate
```

Request

```json
{
  "action":"generateJourney",
  "userId":"",
  "payload":{}
}
```

Possible Actions

- generateJourney
- generateRoadmap
- explainConcept
- askMentor
- summarizePDF
- rankResources
- generateQuiz
- generateAssignment
- evaluateAssignment
- updateJourney
- adaptRoadmap

Response

```json
{
   "success":true,
   "data":{}
}
```

---

# Learning Journey APIs

## Generate Journey

POST

```
/api/journeys/generate
```

Response

Journey JSON

---

## Get Journey

GET

```
/api/journeys/:id
```

---

## Current Journey

GET

```
/api/journeys/current
```

---

## Update Journey

PUT

```
/api/journeys/:id
```

---

# Dashboard

GET

```
/api/dashboard
```

Returns

```json
{
  "goal":{},
  "today":{},
  "progress":{},
  "calendar":{},
  "mentor":{}
}
```

---

# Sessions

## Today's Session

GET

```
/api/sessions/today
```

---

## Session Details

GET

```
/api/sessions/:id
```

---

## Start Session

POST

```
/api/sessions/:id/start
```

---

## Complete Session

POST

```
/api/sessions/:id/complete
```

Updates

- Progress
- Learning Twin
- Dashboard

---

# AI Mentor

## Ask Mentor

POST

```
/api/mentor/chat
```

Request

```json
{
   "sessionId":"",
   "message":"Explain Docker Volumes"
}
```

Response

```json
{
   "reply":"",
   "references":[]
}
```

---

## Conversation History

GET

```
/api/mentor/history
```

---

# Resources

## Recommended Resources

GET

```
/api/resources/:topic
```

---

## Search Resources

GET

```
/api/resources/search?q=react
```

---

## Resource Details

GET

```
/api/resources/:id
```

---

# Assignments

## Current Assignment

GET

```
/api/assignments/current
```

---

## Submit Assignment

POST

```
/api/assignments/:id/submit
```

Request

```json
{
   "github":"",
   "answer":"",
   "files":[]
}
```

---

## Assignment Evaluation

GET

```
/api/assignments/:id/evaluation
```

---

# Quiz

## Generate Quiz

POST

```
/api/quizzes/generate
```

---

## Submit Quiz

POST

```
/api/quizzes/:id/submit
```

---

## Quiz Result

GET

```
/api/quizzes/:id/result
```

---

# Progress

GET

```
/api/progress
```

Returns

- Overall Progress
- Current Streak
- Hours Learned
- Skill Graph

---

# Calendar

GET

```
/api/calendar
```

---

## Sync Calendar

POST

```
/api/calendar/sync
```

---

# Notifications

GET

```
/api/notifications
```

---

PUT

```
/api/notifications/:id/read
```

---

# Uploads

## Upload File

POST

```
/api/uploads
```

Supports

- PDF
- PPT
- DOCX
- Images

Response

```json
{
   "fileId":"",
   "url":""
}
```

---

## Parse Uploaded Material

POST

```
/api/uploads/:id/process
```

Creates

Learning Objects

---

# Integrations

## Connect Google Calendar

POST

```
/api/integrations/calendar
```

---

## Connect GitHub

POST

```
/api/integrations/github
```

---

## Connect Google Drive

POST

```
/api/integrations/drive
```

---

# Learning Twin

GET

```
/api/twin
```

Returns

Current learner profile

---

# Adaptive Learning

POST

```
/api/adaptive/update
```

Triggers

Roadmap update

Session regeneration

Calendar update

Assignment update

---

# AI Response Format

Every AI endpoint returns

```json
{
   "success":true,
   "message":"",
   "data":{},
   "meta":{}
}
```

---

# Error Format

```json
{
   "success":false,
   "error":"Invalid Input",
   "code":"VALIDATION_ERROR"
}
```

---

# HTTP Status Codes

200 Success

201 Created

400 Validation Error

401 Unauthorized

403 Forbidden

404 Not Found

429 Rate Limited

500 Internal Server Error

---

# API Versioning

```
/api/v1/
```

Future

```
/api/v2/
```

---

# Future APIs

Mentor Marketplace

Creator Studio

Communities

Study Groups

Certificates

Organizations

Enterprise

Analytics

Payments

---

# API Principles

- Stateless
- RESTful
- Action-Oriented
- AI Gateway Pattern
- Structured JSON Responses
- Versioned
- Secure
- Modular
- Extensible
