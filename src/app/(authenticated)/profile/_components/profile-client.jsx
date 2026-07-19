"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { 
  Trophy, 
  BookOpen, 
  Flame, 
  Clock, 
  Settings2,
  Calendar,
  ChevronRight,
  Pencil
} from "lucide-react";

import { cn } from "@/lib/utils";

export function ProfileClient({ user: initialUser, stats }) {
  const { user: clerkUser } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fallback to local state if clerkUser isn't fully loaded, but prioritize Clerk to reflect fresh edits
  const displayUser = {
    firstName: clerkUser?.firstName || initialUser?.firstName || "",
    lastName: clerkUser?.lastName || initialUser?.lastName || "",
    fullName: clerkUser?.fullName || initialUser?.fullName,
    email: clerkUser?.primaryEmailAddress?.emailAddress || initialUser?.email,
    imageUrl: clerkUser?.imageUrl || initialUser?.imageUrl,
    createdAt: clerkUser?.createdAt || initialUser?.createdAt,
  };

  const memberSince = displayUser.createdAt 
    ? format(new Date(displayUser.createdAt), "MMMM yyyy") 
    : "Unknown";

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <Image 
            src={displayUser.imageUrl || "/placeholder-avatar.png"} 
            alt="Avatar" 
            width={96} 
            height={96} 
            className="rounded-full object-cover border-4 border-[var(--background)] shadow-sm"
          />
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="absolute bottom-0 right-0 p-1.5 bg-[var(--primary)] text-white dark:text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1 translate-y-1 hover:scale-110"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayUser.fullName}</h1>
          <p className="text-[var(--muted-foreground)]">{displayUser.email}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1.5 bg-[var(--secondary)]/50 px-3 py-1 rounded-full">
            <Calendar className="size-3.5" />
            Joined {memberSince}
          </div>
          <div className="flex items-center gap-1.5 bg-[var(--secondary)]/50 px-3 py-1 rounded-full">
            <Flame className="size-3.5 text-orange-500" />
            {stats.currentStreak} Day Streak
          </div>
          {stats.currentGoal && (
            <div className="flex items-center gap-1.5 bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full">
              <Trophy className="size-3.5" />
              {stats.currentGoal}
            </div>
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2 rounded-xl text-sm font-semibold border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors"
          >
            Edit Profile
          </button>
          {stats.continueLessonId && (
            <Link 
              href={`/lesson/${stats.continueLessonId}`}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--primary)] text-white dark:text-black hover:opacity-90 transition-opacity shadow-sm"
            >
              Continue Learning
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
        {/* Section 1: Learning Overview */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Learning Overview</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Your overall progress across LearnOS.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard 
              icon={BookOpen} 
              label="Active Roadmaps" 
              value={stats.activeRoadmapCount || "—"} 
              color="text-blue-500" 
            />
            <MetricCard 
              icon={CheckCircle2} 
              label="Lessons Completed" 
              value={stats.totalLessons || "—"} 
              color="text-emerald-500" 
            />
            <MetricCard 
              icon={Clock} 
              label="Est. Learning Hours" 
              value={stats.estimatedHours || "—"} 
              color="text-purple-500" 
            />
            <MetricCard 
              icon={Trophy} 
              label="Current Level" 
              value={stats.currentLevel} 
              color="text-amber-500" 
            />
          </div>
        </div>

        {/* Section 2: Learning Identity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Learning Identity</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Your current curriculum configuration.</p>
          </div>

          <div className="rounded-2xl border bg-[var(--card)] shadow-sm divide-y divide-[var(--border)] overflow-hidden">
            <IdentityRow label="Preferred Style" prefKey="style" />
            <IdentityRow label="Difficulty" prefKey="difficulty" />
            <IdentityRow label="Session Length" prefKey="dailyGoal" />
            <IdentityRow label="Learning Pace" prefKey="pace" />
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          user={displayUser} 
          clerkUser={clerkUser}
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}

// Helper icons
function CheckCircle2(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border bg-[var(--card)] p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl bg-[var(--secondary)]", color)}>
          <Icon className="size-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs font-medium text-[var(--muted-foreground)] mt-1">{label}</p>
      </div>
    </div>
  );
}

function IdentityRow({ label, prefKey }) {
  const [val, setVal] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("learnos_learning_prefs");
    if (saved) {
      const parsed = JSON.parse(saved);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVal(parsed[prefKey]);
    }
  }, [prefKey]);

  return (
    <Link 
      href="/settings"
      onClick={() => localStorage.setItem("learnos_settings_tab", "learning")}
      className="flex items-center justify-between p-5 hover:bg-[var(--secondary)]/30 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Settings2 className="size-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {val ? (
          <span className="text-sm font-semibold text-[var(--foreground)] bg-[var(--secondary)] px-2.5 py-0.5 rounded-full">{val}</span>
        ) : (
          <span className="text-sm italic text-[var(--muted-foreground)]">Not configured</span>
        )}
        <ChevronRight className="size-4 text-[var(--muted-foreground)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

function EditProfileModal({ user, clerkUser, onClose }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!clerkUser) return;
    
    setIsSaving(true);
    try {
      await clerkUser.update({ firstName, lastName });
      toast.success("Profile updated", { description: "Your profile has been saved successfully." });
      onClose();
    } catch (error) {
      toast.error("Update failed", { description: error.message || "An error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-3xl border bg-[var(--card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight">Edit Profile</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Update your personal information.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-3 py-2">
            <Image 
              src={user.imageUrl || "/placeholder-avatar.png"} 
              alt="Avatar" 
              width={80} 
              height={80} 
              className="rounded-full object-cover border-2 border-[var(--border)]"
            />
            <button 
              type="button"
              onClick={() => {
                toast.info("Avatar update", { description: "You can update your avatar from your authentication provider settings."});
              }}
              className="text-xs font-medium text-[var(--primary)] hover:underline"
            >
              Change Avatar
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted-foreground)]">First Name</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted-foreground)]">Last Name</label>
              <input 
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">Email Address</label>
            <input 
              type="email" 
              disabled
              value={user.email}
              className="w-full rounded-xl border bg-[var(--secondary)]/50 px-3 py-2.5 text-sm text-[var(--muted-foreground)] cursor-not-allowed"
            />
            <p className="text-[10px] text-[var(--muted-foreground)] ml-1">Managed by your authentication provider.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 rounded-xl text-sm font-semibold bg-[var(--primary)] text-white dark:text-black hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
