# Database Design

# LearnOS

Version: v0.1 Beta

---

# Overview

LearnOS stores learning journeys rather than courses.

The database is designed around the learner.

Every collection represents one aspect of the learner's journey.

The architecture follows:

User

↓

Learning Twin

↓

Journey

↓

Roadmap

↓

Modules

↓

Sessions

↓

Assignments

↓

Progress

↓

Outcome

---

# Database Overview

Collections

```

Users

LearningTwins

Journeys

Roadmaps

Modules

LearningObjects

Sessions

Resources

Assignments

Submissions

Quizzes

QuizAttempts

Projects

Progress

Reminders

Integrations

Uploads

MentorChats

Notifications

Achievements

```

---

# Collection

## Users

Purpose

Stores authentication and profile information.

```
{
_id,

clerkId,

name,

email,

avatar,

timezone,

country,

language,

createdAt,

updatedAt
}
```

---

# Collection

## LearningTwins ⭐⭐⭐⭐⭐

Purpose

Permanent AI memory.

One document per user.

```
{
_id,

userId,

goal,

careerGoal,

learningStyle,

preferredLanguage,

availableTime,

studySchedule,

attentionSpan,

learningSpeed,

knowledgeLevel,

strengths: [],

weaknesses: [],

preferredResources: [],

completedTopics: [],

revisionHistory: [],

retentionPattern,

confidenceScore,

learningHistory: [],

assessmentHistory: [],

recommendations: []
}
```

This is the heart of LearnOS.

---

# Collection

## Journeys

One user can have multiple journeys.

Example

- DevOps
- MERN
- Python

```
{
_id,

userId,

title,

goal,

status,

timeline,

estimatedCompletion,

completionPercentage,

currentModule,

currentSession,

createdAt,

updatedAt
}
```

---

# Collection

## Roadmaps

Stores AI-generated roadmap.

```
{
_id,

journeyId,

milestones: [],

modules: [],

projects: [],

estimatedHours,

generatedBy,

version
}
```

---

# Collection

## Modules

Every roadmap consists of modules.

Example

```
Linux

Git

Docker

Kubernetes
```

Schema

```
{
_id,

roadmapId,

title,

description,

difficulty,

estimatedHours,

order,

prerequisites: [],

learningObjects: []
}
```

---

# Collection

## LearningObjects ⭐⭐⭐⭐⭐

Everything becomes a Learning Object.

```
{
_id,

moduleId,

title,

type,

topic,

difficulty,

estimatedMinutes,

summary,

prerequisites: [],

references: [],

quizId,

assignmentId,

resourceIds: []
}
```

Types

- Video
- PDF
- Book
- Documentation
- Article
- Exercise
- Project

---

# Collection

## Resources

Original resources.

```
{
_id,

title,

source,

url,

author,

duration,

difficulty,

language,

thumbnail,

metadata,

rank,

reason,

createdAt
}
```

Source

- YouTube
- GitHub
- Google Books
- Official Docs
- User Upload

---

# Collection

## Sessions ⭐⭐⭐⭐⭐

Daily learning session.

```
{
_id,

journeyId,

date,

duration,

status,

learningObjects: [],

quiz,

assignment,

revision,

notes,

completedAt
}
```

Status

- Pending
- Started
- Completed
- Skipped

---

# Collection

## Assignments

```
{
_id,

journeyId,

moduleId,

title,

description,

difficulty,

estimatedTime,

evaluationCriteria,

status,

dueDate
}
```

---

# Collection

## Submissions

```
{
_id,

assignmentId,

userId,

github,

files,

answer,

submittedAt,

score,

feedback
}
```

---

# Collection

## Quizzes

```
{
_id,

moduleId,

title,

questions: [],

difficulty,

estimatedTime
}
```

---

# Collection

## QuizAttempts

```
{
_id,

quizId,

userId,

score,

answers,

completedAt
}
```

---

# Collection

## Projects

```
{
_id,

journeyId,

title,

description,

difficulty,

skills: [],

github,

status
}
```

---

# Collection

## Progress

Stores learner progress.

```
{
_id,

journeyId,

completedSessions,

completedAssignments,

completedProjects,

completedQuizzes,

hoursLearned,

streak,

completionPercentage,

lastActivity
}
```

---

# Collection

## MentorChats

Stores AI conversations.

```
{
_id,

userId,

journeyId,

messages: [],

createdAt
}
```

Conversation memory is temporary.

Learning Twin stores permanent memory.

---

# Collection

## Uploads

```
{
_id,

userId,

type,

filename,

storageUrl,

parsed,

metadata,

createdAt
}
```

Types

- PDF
- PPT
- Notes
- Images
- Books

---

# Collection

## Integrations

```
{
_id,

userId,

googleCalendar,

gmail,

github,

drive,

youtube
}
```

---

# Collection

## Reminders

```
{
_id,

userId,

type,

title,

scheduledAt,

status
}
```

---

# Collection

## Notifications

```
{
_id,

userId,

title,

message,

read,

createdAt
}
```

---

# Collection

## Achievements

```
{
_id,

userId,

title,

description,

icon,

earnedAt
}
```

Examples

- 7 Day Streak
- First Assignment
- First Project
- Journey Completed

---

# Relationships

```

User

│

├── LearningTwin

├── Journeys

│

├── Progress

├── Uploads

├── Integrations

├── Notifications

├── MentorChats

└── Achievements

Journey

│

├── Roadmap

├── Sessions

├── Assignments

├── Projects

└── Progress

Roadmap

│

└── Modules

Modules

│

└── LearningObjects

LearningObjects

│

└── Resources

```

---

# Indexes

Recommended indexes

Users

- clerkId
- email

LearningTwin

- userId

Journey

- userId
- status

Sessions

- journeyId
- date

Assignments

- journeyId

Projects

- journeyId

Resources

- topic
- source

MentorChats

- userId

Notifications

- userId

---

# Future Collections

Future versions may introduce

```
Mentors

PublishedJourneys

PublishedRoadmaps

Communities

StudyGroups

CreatorStudio

Marketplace

Organizations

Schools

Certificates

LearningAnalytics

KnowledgeGraph

AIModels
```

---

# Database Design Principles

The LearnOS database follows these principles:

- Learner-centric
- Journey-driven
- AI-first
- Modular
- Extensible
- Engine-friendly
- Supports lifelong learning

The Learning Twin remains the central intelligence object throughout the learner's lifetime.
