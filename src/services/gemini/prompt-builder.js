export function buildRoadmapPrompt(onboarding) {
  const learner = {
    goal: onboarding.goal,
    targetTimeline: onboarding.timeline,
    weeklyStudyHours: onboarding.weeklyHours,
    education: onboarding.education || "Not provided",
    experience: onboarding.experience || "Not provided",
    currentJob: onboarding.currentJob || "Not provided",
    country: onboarding.country || "Not provided",
    learningStyles: onboarding.learningStyles,
    assessmentDecision: onboarding.assessmentDecision,
  };

  return `You are the LearnOS Roadmap Engine. Create a practical learning roadmap tailored to this learner.\n\nLearner profile:\n${JSON.stringify(learner, null, 2)}\n\nReturn ONLY a valid JSON object. Do not include markdown, explanations, comments, or code fences. The response must exactly follow this schema:\n{\n  "goal": "string",\n  "duration": "string",\n  "summary": "string",\n  "difficulty": "Beginner | Intermediate | Advanced",\n  "estimatedHoursPerWeek": 0,\n  "phases": [\n    {\n      "title": "string",\n      "description": "string",\n      "weeks": 0,\n      "skills": ["string"],\n      "projects": ["string"],\n      "resources": ["string"]\n    }\n  ],\n  "dailyPlan": [\n    {\n      "day": 1,\n      "task": "string",\n      "duration": "string"\n    }\n  ]\n}\n\nRules: generate 3 to 6 sequential phases, use realistic week counts matching the target timeline, include 7 daily-plan entries for the first week, recommend only generic resource types or widely known official sources, and keep tasks achievable within the learner's weekly study hours.`;
}
