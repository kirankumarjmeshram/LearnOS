import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { BookOpen, FileText, Layers3, NotebookPen } from "lucide-react";
import { format } from "date-fns";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getNotesForUser } from "@/services/resources/resource-service";

export const metadata = { title: "My Notes" };

export default async function ResourcesPage() {
  const user = await currentUser();

  let notes = [];
  try {
    if (user?.id) notes = await getNotesForUser(user.id);
  } catch (error) {
    console.error("Unable to load notes:", error);
  }

  // Serialize MongoDB ObjectIds / Dates before any grouping logic
  const serialized = JSON.parse(JSON.stringify(notes));

  // Group: roadmapId._id → phaseId._id → lesson entries
  const roadmapMap = {};
  for (const note of serialized) {
    const rId = note.roadmapId?._id ?? "unknown";
    const rGoal = note.roadmapId?.goal ?? "Unknown Roadmap";

    if (!roadmapMap[rId]) roadmapMap[rId] = { goal: rGoal, phases: {} };

    const pId = note.phaseId?._id ?? "unknown";
    const pTitle = note.phaseId?.title ?? "Unknown Phase";

    if (!roadmapMap[rId].phases[pId])
      roadmapMap[rId].phases[pId] = { title: pTitle, lessons: [] };

    roadmapMap[rId].phases[pId].lessons.push({
      noteId: note._id,
      lessonId: note.lessonId?._id ?? null,
      lessonTitle: note.lessonId?.title ?? "Untitled Lesson",
      lessonOrder: note.lessonId?.order ?? 0,
      preview: (note.content ?? "").slice(0, 160),
      updatedAt: note.updatedAt ?? null,
    });
  }

  const roadmapEntries = Object.entries(roadmapMap);

  return (
    <PageWrapper>
      {/* ── Page header ── */}
      <section>
        <p className="text-sm font-semibold text-[var(--primary)]">Your workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">My Notes</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted-foreground)]">
          Notes written during your learning sessions, organised by roadmap and phase.
        </p>
      </section>

      {/* ── Empty state ── */}
      {roadmapEntries.length === 0 && (
        <section className="mt-10 rounded-2xl border bg-[var(--card)] p-9 shadow-sm">
          <NotebookPen className="size-6 text-[var(--primary)]" />
          <h2 className="mt-5 text-xl font-semibold">No notes yet</h2>
          <p className="mt-2 max-w-xl leading-7 text-[var(--muted-foreground)]">
            Open any lesson and start writing. Your notes will appear here, grouped by roadmap and
            phase, so you can review them at any time.
          </p>
          <Link
            href="/roadmap"
            className="mt-6 inline-flex rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)]"
          >
            Open Roadmap
          </Link>
        </section>
      )}

      {/* ── Notes grouped by roadmap → phase → lesson ── */}
      {roadmapEntries.length > 0 && (
        <div className="mt-10 space-y-8">
          {roadmapEntries.map(([rId, roadmap]) => (
            <section key={rId} className="overflow-hidden rounded-2xl border bg-[var(--card)] shadow-sm">
              {/* Roadmap header */}
              <div className="flex items-center gap-3 border-b bg-[var(--secondary)]/40 px-5 py-4">
                <Layers3 className="size-4 shrink-0 text-[var(--primary)]" />
                <h2 className="font-semibold">{roadmap.goal}</h2>
              </div>

              {/* Phases */}
              <div className="divide-y">
                {Object.entries(roadmap.phases).map(([pId, phase]) => (
                  <div key={pId} className="p-5">
                    {/* Phase label */}
                    <div className="mb-4 flex items-center gap-2">
                      <BookOpen className="size-3.5 shrink-0 text-[var(--muted-foreground)]" />
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        {phase.title}
                      </h3>
                    </div>

                    {/* Lesson notes */}
                    <div className="space-y-3">
                      {phase.lessons.map((item) => (
                        <Link
                          key={item.noteId}
                          href={item.lessonId ? `/lesson/${item.lessonId}` : "/roadmap"}
                          className="block rounded-xl border p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--secondary)]/30"
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{item.lessonTitle}</p>
                              {item.preview && (
                                <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                                  {item.preview}
                                </p>
                              )}
                              {item.updatedAt && (
                                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                                  Updated {format(new Date(item.updatedAt), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
