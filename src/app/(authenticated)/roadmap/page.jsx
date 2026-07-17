import { currentUser } from "@clerk/nextjs/server";

import { PlaceholderPage } from "@/components/common/placeholder-page";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { RoadmapView } from "@/features/roadmap/components/roadmap-view";
import { getLearningExperience } from "@/services/learning-service";

export const metadata = { title: "Roadmap" };

export default async function RoadmapPage({ searchParams }) {
  const user = await currentUser();
  const { id } = await searchParams;

  let learning = null;
  try {
    if (user?.id) learning = await getLearningExperience(user.id, id || null);
  } catch (error) {
    console.error("Unable to load learning roadmap:", error);
  }

  if (!learning) {
    return (
      <PlaceholderPage
        title="Roadmap"
        description="Build your Learning OS first to create a personalized roadmap. Head to the onboarding flow to get started."
      />
    );
  }

  return (
    <PageWrapper>
      <RoadmapView
        roadmap={learning.roadmap}
        phases={learning.roadmap.phases}
        lessons={learning.lessons}
        progress={learning.progress}
      />
    </PageWrapper>
  );
}
