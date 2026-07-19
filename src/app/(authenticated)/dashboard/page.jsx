import { currentUser } from "@clerk/nextjs/server";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { getDashboardRoadmaps } from "@/services/learning-service";
import { DashboardClientWrapper } from "./_components/dashboard-client-wrapper";

export default async function DashboardPage(props) {
  // In Next.js 15, searchParams is an async object
  const searchParams = await props.searchParams;
  const isGenerating = searchParams?.generating === "true";
  
  const user = await currentUser();
  const name = user?.firstName || user?.username || user?.fullName || "Learner";
  
  let allRoadmaps = [];
  try {
    // If generating is true, DO NOT block the server component on database queries!
    // We want the AI Builder UI to render instantly.
    if (!isGenerating && user?.id) {
      allRoadmaps = await getDashboardRoadmaps(user.id);
    }
  } catch (error) {
    console.error("Unable to load dashboard roadmaps:", error);
  }

  // Ensure plain JSON serialization
  const serializedRoadmaps = JSON.parse(JSON.stringify(allRoadmaps));

  return (
    <PageWrapper className={!isGenerating ? "space-y-10" : ""}>
      <DashboardClientWrapper 
        isGenerating={isGenerating} 
        name={name} 
        initialRoadmaps={isGenerating ? null : serializedRoadmaps} 
      />
    </PageWrapper>
  );
}
