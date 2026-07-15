# LearnOS Wireframes

Version: v1.0

---

# Design Philosophy

LearnOS is not a dashboard application.

It is a guided learning experience.

Every screen should have only one primary objective.

The user should always know

- where they are
- what they should do
- what comes next

---

# Global Layout

Desktop

```

┌─────────────────────────────────────────────────────────────┐

│ Navbar │

├──────────────┬──────────────────────────────┬───────────────┤

│ Sidebar │ Main Content │ AI Context │

│ │ │ Panel │

│ │ │ │

└──────────────┴──────────────────────────────┴───────────────┘

```

Sidebar

25%

Main

55%

Context Panel

20%

---

# Sidebar

Contains

🏠 Dashboard

🗺 Journey

📚 Today's Session

🤖 AI Mentor

📋 Assignments

📈 Progress

📅 Calendar

⚙ Settings

---

🚧 Marketplace

🚧 Community

🚧 Enterprise

---

# Top Navbar

Left

LearnOS Logo

Center

Current Goal

Right

Search

Notifications

User Avatar

---

# Landing Page

```

────────────────────────────────────────────

LearnOS

The AI Operating System

for Learning Anything.

[ Start Learning ]

[ Watch Demo ]

────────────────────────────────────────────

Features

────────────────────────────────────────────

How it Works

────────────────────────────────────────────

Testimonials

────────────────────────────────────────────

Footer

```

CTA

Start Learning

---

# Authentication

```

LearnOS Logo

Continue with Google

Continue with GitHub

Continue with Email

```

Very minimal.

---

# AI Onboarding

Progress

```

○────○────○────○────○────○────○────○

```

Each page asks ONE question.

---

Welcome

```

Hi Kiran 👋

I'm LearnOS.

Let's build your learning journey.

[ Continue ]

```

---

Goal

```

What do you want to learn?

[ Search ]

DevOps

Python

React

Marketing

AI

etc.

```

---

Timeline

```

How long?

30 Days

3 Months

6 Months

1 Year

```

---

Schedule

```

Monday

1 Hour

Tuesday

2 Hours

Wednesday

...

```

---

Learning Style

```

○ Videos

○ Reading

○ Projects

○ Mixed

```

---

Uploads

```

Drop PDF

Drop Notes

Drop Slides

```

---

Summary

```

Goal

DevOps

Timeline

3 Months

Weekly

8 Hours

Learning Style

Projects

Assessment

Yes

[ Generate Journey ]

```

---

# AI Thinking Screen ⭐⭐⭐⭐⭐

Instead of spinner

```

🧠 LearnOS Intelligence

────────────────────

✔ Understanding your goals

✔ Estimating knowledge

✔ Searching best resources

✔ Building roadmap

✔ Creating sessions

✔ Preparing mentor

✔ Generating assignments

✔ Creating calendar

────────────────────

███████████░░░░░

```

Feels intelligent.

---

# Dashboard ⭐⭐⭐⭐⭐

```

Welcome Back

Kiran 👋

------------------------------------------------

Current Journey

Become DevOps Engineer

63%

Continue

------------------------------------------------

Today's Mission

45 Minutes

Linux Permissions

[ Start Session ]

------------------------------------------------

Progress

━━━━━━━━━━

------------------------------------------------

Upcoming Assignment

------------------------------------------------

Calendar

------------------------------------------------

AI Insight

"You struggled with Git yesterday.

Let's revise before Docker."

------------------------------------------------

```

One primary CTA

Start Today's Session

---

# Journey

```

DevOps Journey

━━━━━━━━━━━━━━━━━━━━━━

✔ Linux Basics

✔ Git

▶ Docker

○ Kubernetes

○ AWS

○ Terraform

━━━━━━━━━━━━━━━━━━━━━━

```

Timeline style.

---

# Session ⭐⭐⭐⭐⭐

```

Today's Mission

Linux Permissions

Estimated Time

45 Minutes

━━━━━━━━━━━━━━━━━━

Objectives

━━━━━━━━━━━━━━━━━━

Video

━━━━━━━━━━━━━━━━━━

Summary

━━━━━━━━━━━━━━━━━━

Examples

━━━━━━━━━━━━━━━━━━

Practice

━━━━━━━━━━━━━━━━━━

Quiz

━━━━━━━━━━━━━━━━━━

Assignment

━━━━━━━━━━━━━━━━━━

Notes

━━━━━━━━━━━━━━━━━━

AI Mentor

```

Primary CTA

Complete Session

---

# Mentor

```

AI Mentor

━━━━━━━━━━━━━━━━━

Hello Kiran,

Today's topic is Docker Volumes.

Need help?

━━━━━━━━━━━━━━━━━

Explain Again

Give Example

Create Analogy

Summarize

Generate Quiz

━━━━━━━━━━━━━━━━━

Chat

━━━━━━━━━━━━━━━━━

```

---

# Assignment

```

Assignment

━━━━━━━━━━━━━━━━━

Objectives

Requirements

Hints

Resources

━━━━━━━━━━━━━━━━━

[ Submit ]

```

---

# Progress

```

Progress

━━━━━━━━━━━━━━

Journey

72%

━━━━━━━━━━━━━━

Skill Graph

━━━━━━━━━━━━━━

Learning Streak

━━━━━━━━━━━━━━

Hours

━━━━━━━━━━━━━━

Achievements

━━━━━━━━━━━━━━

```

---

# Calendar

```

Monthly View

━━━━━━━━━━━━━━

Monday

Tuesday

Wednesday

━━━━━━━━━━━━━━

Today's Study

45 Minutes

━━━━━━━━━━━━━━

```

---

# Upload Center

```

Upload

PDF

Book

Slides

Notes

━━━━━━━━━━━━━━

Drop Files Here

━━━━━━━━━━━━━━

Upload History

━━━━━━━━━━━━━━

```

---

# Settings

```

Profile

Theme

Language

Calendar

Notifications

Connected Apps

Delete Account

```

---

# Empty State

```

📚

No Journey Yet

Let's create your first journey.

[ Start Learning ]

```

---

# Error State

```

⚠

Something went wrong.

[ Retry ]

```

---

# Loading State

Never show

Loading...

Instead

```

LearnOS is building your personalized experience...

```

or

```

Searching the best learning resources...

```

---

# Mobile Layout

```

Navbar

↓

Main Content

↓

Bottom Navigation

Dashboard

Journey

Session

Mentor

Profile

```

---

# Component Usage

Dashboard

JourneyCard

MissionCard

ProgressRing

AIInsightCard

CalendarCard

AssignmentCard

Session

SessionHeader

ObjectiveCard

ResourceCard

SummaryCard

QuizCard

AssignmentCard

MentorPanel

Journey

Timeline

ModuleCard

ProgressBar

Dashboard

StatCard

Charts

ProgressRing

AchievementCard

---

# Animation Ideas

Landing

Knowledge graph slowly connecting

Onboarding

Cards slide one by one

Thinking Screen

Tasks complete one after another

Dashboard

Cards animate in sequence

Journey

Timeline fills as progress increases

Session

Progress bar fills gradually

Mentor

Typing animation

Assignment

Success confetti

Progress

Animated ring

---

# UX Rules

Always show

- Current Goal
- Current Progress
- Next Action

Never overwhelm the learner.

Every screen must have one primary CTA.

Learning should feel like completing missions rather than consuming content.

The learner should never wonder:

"What should I do next?"

LearnOS should always answer that automatically.
