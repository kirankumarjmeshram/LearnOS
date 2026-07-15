# AI Architecture

# LearnOS

Version: v0.1 Beta

---

# Overview

LearnOS is an AI-native learning operating system.

Artificial Intelligence is not treated as a chatbot.

Instead, AI acts as a collection of specialized intelligence engines coordinated by a central orchestration layer.

Every AI decision inside LearnOS is personalized using the learner's Learning Twin.

---

# AI Philosophy

LearnOS does not answer questions.

LearnOS makes decisions.

Every AI response should answer:

- What should the learner learn?
- Why should they learn it?
- When should they learn it?
- How should they learn it?
- What should happen next?

---

# AI Architecture

```
                         User

                           │

                    User Action

                           │

                           ▼

                    AI Orchestrator

                           │

      ┌────────────────────────────────────────────┐

      │                                            │

      ▼                                            ▼

Learning Twin                             AI Context Builder

      │                                            │

      └────────────────────────────────────────────┘

                           │

                 Required AI Engines

      │        │        │        │        │

      ▼        ▼        ▼        ▼        ▼

Assessment

Roadmap

Resource

Session

Mentor

Assignment

Evaluation

Adaptive

Reminder

Career

                           │

                           ▼

                   Structured JSON

                           │

                           ▼

                     Database

                           │

                           ▼

                      Frontend
```

---

# AI Components

LearnOS AI consists of

1. AI Orchestrator
2. Learning Twin
3. Context Builder
4. AI Engines
5. Prompt Library
6. Output Validator

---

# AI Orchestrator

Purpose

Acts as the brain of LearnOS.

It decides

- Which engines should run
- In what order
- What context each engine receives
- What data should be stored

The Orchestrator never generates learning content itself.

It coordinates specialized AI engines.

---

Example

User says

"I want to learn DevOps."

↓

Orchestrator

↓

Assessment Engine

↓

Roadmap Engine

↓

Resource Engine

↓

Session Builder

↓

Calendar Engine

↓

Dashboard

---

Example

User uploads a PDF.

↓

Orchestrator

↓

PDF Parser

↓

Knowledge Extractor

↓

Learning Object Engine

↓

Mentor Context

---

Example

User misses five study sessions.

↓

Adaptive Engine

↓

Roadmap Update

↓

Reminder Engine

↓

Calendar Update

↓

Mentor Notification

---

# Learning Twin

Purpose

Permanent learner intelligence.

Unlike chat history,

the Learning Twin evolves throughout the learner's life.

---

Learning Twin stores

Personal Information

Learning Goals

Career Goals

Learning Style

Available Time

Preferred Language

Assessment Results

Skills

Weak Skills

Strong Skills

Completed Lessons

Completed Projects

Quiz History

Assignment History

Revision Pattern

Attention Span

Learning Speed

Preferred Resources

Study Time

Confidence

Retention Pattern

Achievements

---

Example

```
Learning Twin

Visual Learner

Studies at Night

Strong in React

Weak in Networking

Prefers Projects

Needs Revision Every 5 Days

Average Session

45 Minutes
```

---

Every AI engine uses the Learning Twin.

---

# AI Context Builder

Purpose

Construct the smallest possible context for Gemini.

Never send unnecessary information.

Instead

Build focused prompts.

---

Example

Current Lesson

Docker

Previous Lesson

Linux

Weak Area

Networking

Goal

DevOps Engineer

Available Time

45 Minutes

Learning Style

Visual

This becomes AI Context.

---

# AI Engines

Every engine has

Purpose

Input

Output

Prompt

JSON Schema

Database Update

---

# AI Onboarding Engine

Purpose

Understand the learner.

Input

User responses.

Output

Learner Profile.

Responsibilities

Collect

Goals

Timeline

Study Schedule

Learning Style

Language

Assessment Choice

Learning Material

Career Goal

---

# Assessment Engine

Purpose

Estimate learner knowledge.

Input

Selected Skill

Current Level

Optional GitHub

Output

Skill Graph

Example

Linux

80%

Docker

15%

Git

40%

Networking

10%

---

# Roadmap Engine

Purpose

Generate complete roadmap.

Input

Learning Twin

Goal

Assessment

Timeline

Output

Milestones

Modules

Sessions

Projects

Revision Plan

---

# Resource Engine

Purpose

Find learning resources.

Input

Current Topic

Difficulty

Learning Style

Output

Resource List

Sources

YouTube

Official Docs

GitHub

Books

Articles

User Uploaded Content

---

# Ranking Engine

Purpose

Rank resources.

Ranking Factors

Official Source

Difficulty Match

Learning Style Match

Duration

Popularity

Transcript

Freshness

Gemini Recommendation

Output

Ranked Resources

---

# Learning Object Engine

Purpose

Convert raw resources into structured learning objects.

Input

Video

PDF

Book

Blog

Documentation

Output

Learning Object

Contains

Summary

Prerequisites

Quiz

Assignment

Flashcards

Estimated Time

References

---

# Session Builder

Purpose

Generate daily study sessions.

Input

Learning Objects

Available Time

Output

Daily Session

Example

Revision

5 min

Video

20 min

Reading

10 min

Practice

10 min

Quiz

5 min

---

# AI Mentor Engine

Purpose

Context-aware teaching.

Input

Current Lesson

Current Roadmap

Weak Skills

Learning Style

Uploaded Material

Output

Personalized AI Response

Responsibilities

Teach

Explain

Revise

Motivate

Recommend

---

# Assignment Engine

Purpose

Generate personalized assignments.

Assignment depends on

Current Module

Skill Level

Goal

Learning Speed

Previous Assignments

Output

Assignment

Hints

Evaluation Criteria

---

# Evaluation Engine

Purpose

Evaluate learner submissions.

Input

Assignment

Quiz

Project

Output

Score

Strengths

Weaknesses

Recommendations

Learning Twin Update

---

# Adaptive Engine

Purpose

Modify learning journey.

Triggers

Missed Sessions

Low Quiz Score

Fast Progress

User Feedback

Updated Goal

Output

Updated Roadmap

Updated Calendar

Updated Assignments

Updated Resources

---

# Reminder Engine

Purpose

Maintain learning consistency.

Responsibilities

Email

Calendar

Study Reminder

Revision Reminder

Motivation

Weekly Summary

---

# Career Engine

Purpose

Guide learner after roadmap.

Generates

Projects

Portfolio

Resume Suggestions

Interview Questions

Next Skill Recommendation

---

# Prompt Architecture

Each AI engine owns its own prompt.

Never create prompts inside components.

Example

/prompts

roadmap.md

mentor.md

assessment.md

resources.md

ranking.md

quiz.md

assignment.md

evaluation.md

career.md

---

# Structured AI Output

Every AI response must return JSON.

Never rely on plain paragraphs.

Example

{
  "week": 1,
  "topic": "Linux",
  "estimatedHours": 6,
  "sessions": [
    {
      "day": "Monday",
      "duration": 45,
      "learningObjects": []
    }
  ]
}

---

# AI Validation Layer

Purpose

Validate every Gemini response.

Checks

Required Fields

Valid JSON

Empty Values

Missing Objects

Invalid Time Estimates

Duplicate Topics

---

# AI Memory Strategy

Conversation Memory

Temporary

Learning Twin

Permanent

Prompt Context

Generated

Learning History

Permanent

Session Context

Temporary

---

# AI Decision Flow

User Action

↓

Orchestrator

↓

Context Builder

↓

Relevant AI Engine

↓

Gemini

↓

Validator

↓

Database

↓

Frontend

---

# AI Principles

Every AI engine must

Use Learning Twin

Return Structured JSON

Explain Recommendations

Avoid Hallucination

Use Context

Remain Personalized

Be Transparent

---

# Long-Term Vision

Future versions of LearnOS will introduce

Multi-Agent AI

Self-improving Learning Twin

Learning Graph Intelligence

Predictive Learning

Knowledge Graph

AI Mentor Personalities

Enterprise Intelligence

Cross-domain Learning

Real-time Resource Intelligence

The AI architecture is designed so new engines can be added without changing the overall system, allowing LearnOS to evolve into a lifelong AI operating system for learning.
