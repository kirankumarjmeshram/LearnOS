# Frontend Architecture

# LearnOS

Version: v1.0

---

# Overview

The LearnOS frontend is built using Next.js 15 App Router.

The frontend has only one responsibility:

Display data.

Business logic, AI logic and learning logic never exist inside React components.

The frontend communicates only with backend APIs.

---

# Technology Stack

Framework

Next.js 15

Language

JavaScript

UI

Tailwind CSS

Component Library

shadcn/ui

Animations

Framer Motion

Icons

Lucide React

Authentication

Clerk

State Management

Redux Toolkit

Forms

React Hook Form

Validation

Zod

Notifications

Sonner

Charts

Recharts

Markdown

react-markdown

PDF Viewer

react-pdf

---

# Frontend Philosophy

The frontend should

- Render data
- Handle user interaction
- Handle navigation
- Display loading states
- Display AI responses

The frontend should NOT

- Call Gemini
- Generate roadmaps
- Generate quizzes
- Rank resources
- Build sessions

Those belong to the backend.

---

# Application Structure

```

src/

app/

components/

features/

layouts/

hooks/

redux/

services/

lib/

utils/

constants/

styles/

assets/

```

---

# App Router

```

app/

(layout.js)

page.js

(auth)/

(login)

(sign-up)

(onboarding)

(dashboard)

(journey)

(session)

(mentor)

(assignments)

(progress)

(calendar)

(settings)

(api)

```

Every feature owns its pages.

---

# Component Architecture

Three layers

```

Pages

↓

Feature Components

↓

Shared Components

```

---

# Components Folder

```

components/

ui/

cards/

buttons/

forms/

navigation/

charts/

dialogs/

loaders/

animations/

icons/

```

Shared reusable components only.

---

# Feature Structure

Every feature has

```

features/

dashboard/

components/

hooks/

services/

constants/

utils/

```

Example

```

features/

mentor/

components/

MentorChat.js

MentorInput.js

MentorMessage.js

MentorSuggestions.js

hooks/

useMentor.js

services/

mentor.service.js

```

---

# Layouts

```

layouts/

DashboardLayout

AuthLayout

LearningLayout

LandingLayout

```

---

# Redux Structure

```

redux/

store.js

rootReducer.js

```

Slices

```

auth/

journey/

session/

mentor/

dashboard/

calendar/

progress/

notifications/

ui/

```

Example

```

journeySlice.js

mentorSlice.js

sessionSlice.js

```

---

# API Layer

Never call fetch directly.

```

services/

api.js

journey.service.js

mentor.service.js

session.service.js

assignment.service.js

calendar.service.js

upload.service.js

```

Every API call lives here.

---

# Hooks

Reusable hooks

```

hooks/

useJourney.js

useSession.js

useMentor.js

useCalendar.js

useProgress.js

useUpload.js

```

---

# UI Components

LearnOS should have reusable design components.

```

JourneyCard

MissionCard

ProgressRing

SessionCard

RoadmapTimeline

AIInsightCard

ResourceCard

AchievementCard

LoadingCard

ThinkingAnimation

```

These become the LearnOS design language.

---

# Dashboard

Dashboard consists of

```

Welcome Banner

↓

Current Journey

↓

Today's Mission

↓

Progress

↓

Roadmap

↓

Calendar

↓

Assignments

↓

AI Mentor Insight

↓

Learning Stats

```

---

# Journey Module

Contains

```

Journey Timeline

Current Module

Next Module

Progress

Projects

```

---

# Session Module

Contains

```

Objectives

↓

Learning Resources

↓

Summary

↓

Practice

↓

Quiz

↓

Assignment

↓

Mentor

↓

Notes

```

---

# Mentor Module

```

Chat

Context

Suggestions

Examples

History

```

---

# Assignment Module

```

Assignment

↓

Submission

↓

Evaluation

↓

Feedback

```

---

# Progress Module

```

Streak

Hours

Completion

Charts

Achievements

Skill Graph

```

---

# Calendar Module

```

Monthly

Weekly

Today's Tasks

Upcoming Sessions

```

---

# Upload Module

```

Drag Drop

↓

Progress

↓

History

↓

Parsed Content

```

---

# Loading States

Every page has

Skeleton

instead of

Spinner

AI operations use

Thinking Animation

Example

Generating Roadmap...

Searching Resources...

Building Sessions...

---

# Error States

Friendly

Actionable

Retry Button

---

# Forms

Every form uses

React Hook Form

Zod

---

# Navigation

Sidebar

Dashboard

Journey

Today's Session

Assignments

Calendar

Progress

AI Mentor

Resources

Settings

---

# Theme

Light

Dark

System

---

# Responsive

Desktop

Tablet

Mobile

Responsive by default.

---

# Folder Structure

```

src/

app/

components/

features/

hooks/

redux/

services/

lib/

styles/

constants/

utils/

assets/

```

---

# Component Naming

PascalCase

Example

```

JourneyCard.jsx

SessionCard.jsx

ProgressRing.jsx

MentorChat.jsx

```

---

# State Management

Redux

Stores

- User
- Journey
- Session
- Progress
- Mentor
- Notifications
- UI

Local State

Stores

- Modal
- Input
- Form

Never store server data unnecessarily.

---

# API Flow

```

React Component

↓

Redux Action

↓

Service

↓

Backend API

↓

Redux Store

↓

Component

```

---

# Animation Strategy

Framer Motion

Used for

- Page transitions
- Cards
- AI Thinking
- Timeline
- Progress
- Modals

Avoid excessive animations.

---

# Design Tokens

Spacing

8px grid

Radius

16px

Cards

Glass + Soft Shadow

Buttons

Rounded

Icons

Lucide

Typography

Geist

---

# Future Frontend

PWA

Offline Mode

Mobile App

Desktop App

Voice Interface

Widgets

---

# Frontend Principles

The frontend should always

- Feel premium
- Load quickly
- Show progress
- Reduce cognitive load
- Guide the learner
- Stay modular
- Stay component-driven
- Remain AI independent

The frontend is responsible for creating a delightful learning experience, while all intelligence remains inside the backend.
