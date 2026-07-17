import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { Lesson } from "@/models/lesson";
import { LessonNote } from "@/models/lesson-note";
import { LessonResource } from "@/models/lesson-resource";
import { Phase } from "@/models/phase";
import { Roadmap } from "@/models/roadmap";
import { searchEducationalVideos } from "@/services/youtube/client";

const officialResources = [
  { match: "react", title: "React documentation", url: "https://react.dev/learn" },
  { match: "next", title: "Next.js documentation", url: "https://nextjs.org/docs" },
  { match: "node", title: "Node.js documentation", url: "https://nodejs.org/docs/latest/api/" },
  { match: "python", title: "Python documentation", url: "https://docs.python.org/3/" },
  { match: "mongo", title: "MongoDB documentation", url: "https://www.mongodb.com/docs/" },
  { match: "javascript", title: "MDN JavaScript guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
  { match: "css", title: "MDN CSS guide", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { match: "html", title: "MDN HTML guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
];

const practiceResources = [
  { title: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges", match: "frontend|css|html|react" },
  { title: "Codewars", url: "https://www.codewars.com/", match: "javascript|python|node" },
  { title: "LeetCode", url: "https://leetcode.com/problemset/", match: "algorithm|data|backend|software" },
  { title: "Exercism", url: "https://exercism.org/", match: "python|javascript|programming" },
  { title: "HackerRank", url: "https://www.hackerrank.com/", match: "software|backend|python|javascript" },
  { title: "CodePen", url: "https://codepen.io/", match: "frontend|css|html" },
];

function resourceContext(lesson) { return `${lesson.title} ${lesson.topics.join(" ")}`.toLowerCase(); }
function findOfficialResource(lesson) { const context = resourceContext(lesson); return officialResources.find((resource) => context.includes(resource.match)) || { title: "MDN Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" }; }
function findPracticeResource(lesson) { const context = resourceContext(lesson); return practiceResources.find((resource) => new RegExp(resource.match).test(context)) || { title: "Exercism", url: "https://exercism.org/" }; }

async function getOwnedLesson(clerkId, lessonId) {
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new Error("Lesson not found.");
  const roadmap = await Roadmap.findOne({ _id: lesson.roadmapId, clerkId }).lean();
  if (!roadmap) throw new Error("You do not have access to this lesson.");
  return lesson;
}

async function ensureAiResources(clerkId, lesson) {
  const cached = await LessonResource.find({ lessonId: lesson._id, source: "ai" }).sort({ createdAt: 1 }).lean();
  if (cached.length) return cached;
  const official = findOfficialResource(lesson);
  const practice = findPracticeResource(lesson);
  let videos = [];
  try { videos = await searchEducationalVideos(`${lesson.title} ${lesson.topics.join(" ")}`); } catch (error) { console.warn("YouTube resource fetch skipped:", error.message); }
  const resources = [...videos, { type: "documentation", title: official.title, url: official.url, description: "Official learning reference", thumbnailUrl: "" }, { type: "exercise", title: practice.title, url: practice.url, description: "Trusted practice resource", thumbnailUrl: "" }];
  if (resources.length) await LessonResource.insertMany(resources.map((resource) => ({ ...resource, clerkId, roadmapId: lesson.roadmapId, phaseId: lesson.phaseId, lessonId: lesson._id, source: "ai" })), { ordered: false });
  return LessonResource.find({ lessonId: lesson._id, source: "ai" }).sort({ createdAt: 1 }).lean();
}

import { GlobalResource } from "@/models/global-resource";

export async function getLessonResources(clerkId, lessonId) {
  await connectToDatabase();
  const lesson = await getOwnedLesson(clerkId, lessonId);
  const [aiResources, userResources, allGlobal] = await Promise.all([
    ensureAiResources(clerkId, lesson), 
    LessonResource.find({ lessonId: lesson._id, source: "user", clerkId }).sort({ createdAt: -1 }).lean(),
    GlobalResource.find({ 
      clerkId, 
      $or: [{ visibility: "global" }, { roadmapId: lesson.roadmapId }]
    }).lean()
  ]);

  // Match global resources to lesson topics/title
  const keywords = [lesson.title, ...(lesson.topics || [])].map(k => k.toLowerCase());
  const globalResources = allGlobal.filter(res => {
    const tech = (res.technology || "").toLowerCase();
    const tags = (res.tags || []).map(t => t.toLowerCase());
    return keywords.some(kw => kw.includes(tech) || tech.includes(kw) || tags.some(t => kw.includes(t) || t.includes(kw)));
  });

  return { aiResources, userResources, globalResources };
}

export async function addUserResource(clerkId, lessonId, resource) {
  await connectToDatabase();
  const lesson = await getOwnedLesson(clerkId, lessonId);
  const url = new URL(resource.url);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Resource URLs must use http or https.");
  return LessonResource.create({ ...resource, url: url.toString(), clerkId, roadmapId: lesson.roadmapId, phaseId: lesson.phaseId, lessonId: lesson._id, source: "user" });
}

export async function updateUserResource(clerkId, resourceId, resource) {
  await connectToDatabase();
  const existing = await LessonResource.findOne({ _id: resourceId, clerkId, source: "user" });
  if (!existing) throw new Error("Resource not found.");
  const url = new URL(resource.url);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Resource URLs must use http or https.");
  existing.title = resource.title; existing.type = resource.type; existing.url = url.toString(); existing.description = resource.description || "";
  await existing.save();
  return existing;
}

export async function deleteUserResource(clerkId, resourceId) {
  await connectToDatabase();
  const result = await LessonResource.deleteOne({ _id: resourceId, clerkId, source: "user" });
  if (!result.deletedCount) throw new Error("Resource not found.");
}

export async function getLessonNote(clerkId, lessonId) {
  await connectToDatabase();
  await getOwnedLesson(clerkId, lessonId);
  return LessonNote.findOne({ clerkId, lessonId }).lean();
}

export async function saveLessonNote(clerkId, lessonId, content) {
  await connectToDatabase();
  const lesson = await getOwnedLesson(clerkId, lessonId);
  return LessonNote.findOneAndUpdate({ clerkId, lessonId }, { $set: { content, roadmapId: lesson.roadmapId, phaseId: lesson.phaseId } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
}

export async function getNotesForUser(clerkId) {
  await connectToDatabase();
  await Promise.all([Roadmap.init(), Phase.init(), Lesson.init()]);
  return LessonNote.find({ clerkId, content: { $ne: "" } }).sort({ updatedAt: -1 }).populate("roadmapId", "goal").populate("phaseId", "title").populate("lessonId", "title order").lean();
}
