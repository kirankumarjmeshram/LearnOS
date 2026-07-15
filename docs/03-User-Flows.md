# User Flows

# LearnOS

Version: v0.1 Beta

---

# Purpose

This document defines every major user journey inside LearnOS.

Every screen, API, AI workflow, and backend module should follow these flows.

---

# Primary User Journey

```text
Landing Page

↓

Authentication

↓

AI Onboarding

↓

Optional AI Assessment

↓

LearnOS Intelligence

↓

Learning Journey Generation

↓

Dashboard

↓

Daily Learning Session

↓

Assignment

↓

Evaluation

↓

Adaptive Learning

↓

Progress

↓

Goal Completion

↓

Next Journey
```

---

# Flow 1

## Landing Page

Purpose

Introduce LearnOS.

Actions

- View Features
- View Demo
- View Roadmap
- Sign In
- Get Started

CTA

Start Learning

↓

Authentication

---

# Flow 2

## Authentication

User can sign in using

- Google
- GitHub
- Email

After successful login

↓

Check Profile

IF profile exists

↓

Dashboard

ELSE

↓

AI Onboarding

---

# Flow 3

# AI Onboarding

Purpose

Create learner profile.

---

Screen 1

Welcome

AI introduces itself.

Example

Hi Kiran 👋

I'm LearnOS.

I'll become your AI learning companion.

Let's build your learning journey.

↓

Continue

---

Screen 2

Goal Selection

Question

What do you want to learn?

Examples

- DevOps
- MERN
- Python
- AI
- Data Science
- Marketing
- Guitar

↓

Save Goal

---

Screen 3

Purpose

Why are you learning?

Options

- Job
- Career Switch
- Promotion
- College
- Business
- Hobby
- Exam

↓

Save

---

Screen 4

Current Knowledge

Question

What's your current experience?

Options

- Beginner
- Intermediate
- Advanced

↓

Save

---

Screen 5

Optional AI Assessment

Question

Would you like LearnOS to assess your knowledge?

YES

↓

Assessment

NO

↓

Next

---

Screen 6

Study Schedule

Select

Available Days

Daily Hours

Preferred Time

Example

Monday

1 Hour

Tuesday

2 Hours

Saturday

4 Hours

↓

Save

---

Screen 7

Target Timeline

Examples

1 Month

3 Months

6 Months

1 Year

↓

Save

---

Screen 8

Learning Style

Options

- Videos
- Reading
- Projects
- Mixed

↓

Save

---

Screen 9

Language

English

Hindi

Mixed

↓

Save

---

Screen 10

Upload Learning Material (Optional)

Upload

- PDF
- Book
- PPT
- Notes

↓

Save

---

Screen 11

Connect Integrations (Optional)

- Google Calendar
- Gmail
- GitHub
- Google Drive

↓

Finish

---

Output

Learner Profile

↓

LearnOS Intelligence

---

# Flow 4

# AI Assessment

Purpose

Estimate learner skill.

Flow

Generate Dynamic Questions

↓

Learner Answers

↓

AI Evaluation

↓

Skill Graph

↓

Update Learner Profile

Output

Example

Linux

80%

Git

50%

Docker

10%

Networking

5%

---

# Flow 5

# LearnOS Intelligence

Purpose

Generate complete learning journey.

Input

Learner Profile

↓

Learning Twin

↓

Goal Analysis

↓

Skill Analysis

↓

Dependency Mapping

↓

Resource Search

↓

Resource Ranking

↓

Learning Object Generation

↓

Roadmap Generation

↓

Session Generation

↓

Assignment Generation

↓

Quiz Generation

↓

Calendar Generation

↓

Progress Plan

↓

Journey Created

Output

Learning Journey

---

# Flow 6

# Dashboard

Purpose

Single source of truth.

Sections

Current Goal

Today's Session

Roadmap

Upcoming Assignment

Progress

Calendar

AI Mentor

Continue Learning

Actions

Continue Session

Open Mentor

Open Assignment

Open Calendar

---

# Flow 7

# Daily Learning Session

Purpose

Deliver one structured learning session.

Session

↓

Learning Objectives

↓

Revision

↓

Video

↓

Reading

↓

AI Summary

↓

Examples

↓

Practice

↓

Quiz

↓

Assignment

↓

Session Complete

↓

Progress Update

---

# Flow 8

# AI Mentor

Purpose

Context-aware teaching.

Learner asks question.

↓

Mentor receives

Current Topic

Current Lesson

Previous Lessons

Roadmap

Weak Areas

Learning Style

Uploaded Material

↓

Gemini

↓

Personalized Response

↓

Conversation Stored

---

# Flow 9

# Assignment

Assignment appears.

Learner completes.

Submit

↓

AI Evaluation

↓

Feedback

↓

Update Learning Twin

↓

Update Progress

---

# Flow 10

# Adaptive Learning

Triggered by

- Quiz Score
- Assignment
- Missed Sessions
- Faster Progress
- User Feedback

↓

Adaptive Engine

↓

Modify

Roadmap

Calendar

Resources

Assignments

Difficulty

↓

Dashboard Updates

---

# Flow 11

# Calendar

Journey

↓

Generate Sessions

↓

Generate Calendar Events

↓

Google Calendar Sync

↓

Email Reminder

↓

Daily Notification

---

# Flow 12

# Progress

Track

- Sessions
- Quizzes
- Assignments
- Projects
- Streak
- Time Studied
- Goal Completion

↓

Dashboard

↓

Learning Twin

---

# Flow 13

# Resource Engine

Need Topic

↓

Search Sources

- YouTube
- GitHub
- Google Books
- Official Docs
- User Uploads

↓

Collect Resources

↓

Metadata Extraction

↓

Filtering

↓

Ranking

↓

Learning Object Creation

↓

Session Builder

↓

Journey

---

# Flow 14

# Learning Object Engine

Raw Resource

↓

Transcript / Parsing

↓

Topic Detection

↓

Difficulty Detection

↓

Time Estimation

↓

Summary

↓

Quiz

↓

Assignment

↓

Flashcards

↓

Learning Object

---

# Flow 15

# Session Builder

Learning Objects

↓

Estimate User Time

↓

Generate Daily Sessions

↓

Revision

↓

Learning

↓

Practice

↓

Quiz

↓

Assignment

↓

Session Ready

---

# Flow 16

# Reminder Engine

Every Morning

↓

Check Calendar

↓

Email Today's Session

↓

Reminder

↓

If Missed

↓

Reschedule

↓

Notify User

---

# Flow 17

# Goal Completion

Roadmap Complete

↓

Final Assessment

↓

Portfolio Generation

↓

Resume Suggestions

↓

Next Skill Recommendation

↓

Start New Journey

---

# Secondary Navigation

Dashboard

Journey

Calendar

Assignments

Resources

AI Mentor

Progress

Settings

Future

Marketplace

Creator Studio

Enterprise

---

# Global AI Flow

User Action

↓

Orchestrator

↓

Select Required Engines

↓

Gemini

↓

JSON Response

↓

Database Update

↓

Frontend Update

---

# Error Handling

If AI fails

↓

Retry

↓

Fallback Prompt

↓

Cached Result

↓

Notify User

---

# Session Lifecycle

Session Created

↓

Started

↓

Paused

↓

Resumed

↓

Completed

↓

Assignment

↓

Evaluation

↓

Adaptive Update

↓

Learning Twin Updated

↓

Next Session Generated

---

# End-to-End Learning Lifecycle

Goal

↓

Assessment

↓

Journey

↓

Daily Sessions

↓

Assignments

↓

Evaluation

↓

Adaptation

↓

Projects

↓

Outcome

↓

Career Growth

↓

Next Goal

This cycle repeats throughout the learner's lifetime.
