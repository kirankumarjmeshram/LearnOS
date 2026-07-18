import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalResource } from "@/models/global-resource";
import { LessonResource } from "@/models/lesson-resource";
import { Roadmap } from "@/models/roadmap";
import { Phase } from "@/models/phase";
import { Lesson } from "@/models/lesson";
import { ResourcesView } from "@/features/resources/components/resources-view";
import { ROUTES } from "@/constants/routes";
import { PageWrapper } from "@/components/layout/page-wrapper";

export const metadata = {
  title: "My Resources | LearnOS",
};

export default async function ResourcesPage() {
  const { userId } = await auth();
  if (!userId) redirect(ROUTES.SIGN_IN);

  await connectToDatabase();
  // Ensure models are registered for populate
  await Promise.all([Roadmap.init(), Phase.init(), Lesson.init()]);

  const [globalDocs, legacyDocs] = await Promise.all([
    GlobalResource.find({ clerkId: userId }).sort({ createdAt: -1 }).lean(),
    LessonResource.find({ clerkId: userId, source: "user" })
      .populate("roadmapId", "goal")
      .populate("phaseId", "title")
      .populate("lessonId", "title")
      .sort({ createdAt: -1 })
      .lean()
  ]);

  const legacyMapped = legacyDocs.map(doc => ({
    _id: doc._id,
    type: doc.type,
    title: doc.title,
    url: doc.url,
    technology: doc.roadmapId?.goal || "General",
    notes: doc.description || "",
    roadmapId: doc.roadmapId?._id || null,
    phaseId: doc.phaseId?._id || null,
    lessonId: doc.lessonId?._id || null,
    roadmapTitle: doc.roadmapId?.goal || "",
    phaseTitle: doc.phaseId?.title || "",
    lessonTitle: doc.lessonId?.title || "",
    savedFrom: "lesson",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    isFavorite: false,
    status: "unread",
    visibility: "roadmap"
  }));

  const resources = [...globalDocs, ...legacyMapped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Serialize resources for client component
  const serializedResources = JSON.parse(JSON.stringify(resources));

  return (
    <PageWrapper>
      <ResourcesView initialResources={serializedResources} />
    </PageWrapper>
  );
}
