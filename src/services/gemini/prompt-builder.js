export function buildRoadmapPrompt(onboarding) {
  const learner = {
    careerGoal: onboarding.goal,
    experienceLevel: onboarding.experienceLevel,
    learningGoal: onboarding.learningGoal,
    targetTimeline: onboarding.timeline,
    weeklyStudyHours: onboarding.weeklyHours,
    currentKnowledge: onboarding.currentKnowledge || [],
    preferredTechnologyStack: onboarding.preferredTechnologyStack || [],
    customTechnologies: onboarding.customTechnologies || [],
    learningStyleRanking: onboarding.learningStyleRanking || [],
  };

  const skipClause = learner.currentKnowledge.length > 0
    ? `Avoid teaching or repeating the following concepts/technologies that the learner already knows: ${learner.currentKnowledge.join(", ")}. Bypassing these concepts where possible.`
    : "";

  const techClause = (learner.preferredTechnologyStack.length > 0 || learner.customTechnologies.length > 0)
    ? `You MUST base the roadmap and technical focus specifically on these preferred technologies: ${[...learner.preferredTechnologyStack, ...learner.customTechnologies].join(", ")}. Do NOT introduce alternative frameworks or libraries (like Django, Flask, or Angular) if they are not part of this preferred stack, unless explicitly requested.`
    : "";

  const styleClause = learner.learningStyleRanking.length > 0
    ? `The learner's preferred way of learning is ranked in this order: ${learner.learningStyleRanking.join(" -> ")}. 
       - If "Projects" or "Hands-on Practice" is high, design complex projects and daily practical coding tasks.
       - If "Videos" or "Documentation" is high, bias recommended resources to official docs/guides and video walk-throughs.`
    : "";

  const complexityClause = `Adapt complexity to the learner's experience level (${learner.experienceLevel}):
     - Complete Beginner: Start with syntax basics, core fundamentals, and basic tools. Use slow pacing.
     - Programming Basics / Student / Junior Developer: Bypass basic programming loops/variables. Start directly with framework concepts and intermediate patterns.
     - Mid-Level / Senior Developer: Focus on advanced architectural patterns, unit/integration testing, CI/CD, performance tuning, and system design. Skip all basics.`;

  const goalClause = `Align with the learner's purpose (${learner.learningGoal}):
     - Get My First Job: Focus on portfolio projects, clean code, and standard tools.
     - Interview Preparation: Include algorithms, data structures, mock interview prep, and revision.
     - Startup / Freelancing: Focus on rapid prototyping, launchable MVPs, authentication, payments, deployment, and security.`;

  return `You are the LearnOS Roadmap Engine. Create a practical learning roadmap tailored to this learner.

Learner profile:
${JSON.stringify(learner, null, 2)}

Instructions:
1. ${complexityClause}
2. ${goalClause}
3. ${skipClause}
4. ${techClause}
5. ${styleClause}

Return ONLY a valid JSON object. Do not include markdown, explanations, comments, or code fences. The response must exactly follow this schema:
{
  "goal": "string",
  "duration": "string",
  "summary": "string",
  "difficulty": "Beginner | Intermediate | Advanced",
  "estimatedHoursPerWeek": 0,
  "phases": [
    {
      "title": "string",
      "description": "string",
      "weeks": 0,
      "skills": ["string"],
      "projects": ["string"],
      "resources": ["string"]
    }
  ],
  "dailyPlan": [
    {
      "day": 1,
      "task": "string",
      "duration": "string"
    }
  ]
}

Rules:
- Generate 3 to 6 sequential phases.
- The sum of 'weeks' in all phases must approximately equal the target timeline (${learner.targetTimeline}).
- Include exactly 7 daily-plan entries for the first week (days 1 to 7).
- Recommend only generic resource types or widely known official sources (e.g. "Official React Documentation").`;
}
