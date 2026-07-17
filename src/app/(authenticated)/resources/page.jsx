import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalResource } from "@/models/global-resource";
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
  const resources = await GlobalResource.find({ clerkId: userId }).sort({ createdAt: -1 }).lean();

  // Serialize resources for client component
  const serializedResources = JSON.parse(JSON.stringify(resources));

  return (
    <PageWrapper>
      <ResourcesView initialResources={serializedResources} />
    </PageWrapper>
  );
}
