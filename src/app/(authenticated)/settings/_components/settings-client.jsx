"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  User, 
  Palette, 
  BookOpen, 
  Bell, 
  Info,
  Check,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  Code
} from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "learning", label: "Learning Preferences", icon: BookOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "about", label: "About", icon: Info },
];

export function SettingsClient({ user }) {
  const [activeTab, setActiveTab] = useState("general");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("learnos_settings_tab");
    if (saved && TABS.some(t => t.id === saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(saved);
    }
  }, []);

  const handleTabChange = (id) => {
    setActiveTab(id);
    localStorage.setItem("learnos_settings_tab", id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      {/* Sidebar Navigation */}
      <nav className="flex md:flex-col gap-1 md:w-64 shrink-0 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                isActive 
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]" 
                  : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className={cn("size-4", isActive ? "text-[var(--primary)]" : "opacity-70")} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content Area */}
      <main className="flex-1 min-w-0">
        {activeTab === "general" && <GeneralTab user={user} />}
        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "learning" && <LearningTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "about" && <AboutTab />}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// General Tab
// ----------------------------------------------------------------------
function GeneralTab({ user }) {
  const memberSince = user?.createdAt 
    ? format(new Date(user.createdAt), "MMMM d, yyyy") 
    : "Unknown";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-xl font-bold tracking-tight">General</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Manage your basic account information.</p>
      </div>

      <div className="rounded-2xl border bg-[var(--card)] shadow-sm divide-y divide-[var(--border)]">
        <SettingRow label="Name" value={user?.fullName} />
        <SettingRow label="Email" value={user?.email} />
        <SettingRow label="Authentication Provider" value={user?.provider} className="capitalize" />
        <SettingRow label="Member Since" value={memberSince} />
      </div>
      
      <p className="text-xs text-[var(--muted-foreground)] px-2">
        General account information is managed by your authentication provider. To update your email or password, please visit your provider&apos;s settings.
      </p>
    </div>
  );
}

function SettingRow({ label, value, className }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-2">
      <p className="text-sm font-medium">{label}</p>
      <p className={cn("text-sm text-[var(--muted-foreground)]", className)}>{value}</p>
    </div>
  );
}

// ----------------------------------------------------------------------
// Appearance Tab
// ----------------------------------------------------------------------
function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Appearance</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Customize how LearnOS looks on your device.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { id: "light", label: "Light", icon: Sun },
          { id: "dark", label: "Dark", icon: Moon },
          { id: "system", label: "System", icon: Monitor },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:shadow-sm",
                isActive 
                  ? "border-[var(--primary)] bg-[var(--primary)]/5" 
                  : "border-[var(--border)] bg-[var(--card)] hover:border-gray-300 dark:hover:border-gray-700"
              )}
            >
              <div className={cn(
                "p-3 rounded-full",
                isActive ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
              )}>
                <Icon className="size-6" />
              </div>
              <div className="space-y-1 text-center">
                <p className="font-semibold text-sm">{t.label}</p>
              </div>
              {isActive && (
                <div className="absolute top-4 right-4 text-[var(--primary)]">
                  <Check className="size-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Learning Preferences Tab
// ----------------------------------------------------------------------
function LearningTab() {
  const [prefs, setPrefs] = useState({
    difficulty: "Intermediate",
    pace: "Normal",
    dailyGoal: "30 Minutes",
    style: "Hands-on"
  });

  useEffect(() => {
    const saved = localStorage.getItem("learnos_learning_prefs");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem("learnos_learning_prefs", JSON.stringify(next));
    toast.success("Preferences saved", {
      description: `Updated your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} to ${value}.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Learning Preferences</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Tailor the AI tutor and curriculum to your style.</p>
      </div>

      <div className="space-y-4">
        <SelectCard 
          title="Difficulty" 
          options={["Beginner", "Intermediate", "Advanced"]} 
          value={prefs.difficulty} 
          onChange={(v) => updatePref("difficulty", v)} 
        />
        <SelectCard 
          title="Learning Pace" 
          options={["Slow", "Normal", "Fast"]} 
          value={prefs.pace} 
          onChange={(v) => updatePref("pace", v)} 
        />
        <SelectCard 
          title="Daily Goal" 
          options={["15 Minutes", "30 Minutes", "45 Minutes", "60 Minutes"]} 
          value={prefs.dailyGoal} 
          onChange={(v) => updatePref("dailyGoal", v)} 
        />
        <SelectCard 
          title="Preferred Style" 
          options={["Reading", "Videos", "Hands-on"]} 
          value={prefs.style} 
          onChange={(v) => updatePref("style", v)} 
        />
      </div>
    </div>
  );
}

function SelectCard({ title, options, value, onChange }) {
  return (
    <div className="rounded-2xl border bg-[var(--card)] shadow-sm p-1">
      <div className="p-4 pb-2">
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="p-2 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 text-center border",
              value === opt 
                ? "bg-[var(--primary)] border-[var(--primary)] text-white dark:text-black" 
                : "bg-transparent border-transparent hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Notifications Tab
// ----------------------------------------------------------------------
function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    reminders: true,
    summary: true,
    updates: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("learnos_notifications");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setNotifs(JSON.parse(saved));
  }, []);

  const toggle = (key) => {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    localStorage.setItem("learnos_notifications", JSON.stringify(next));
    toast.success("Preferences saved");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Manage how we contact you.</p>
      </div>

      <div className="rounded-2xl border bg-[var(--card)] shadow-sm divide-y divide-[var(--border)]">
        <ToggleRow 
          label="Lesson Reminders" 
          description="Get reminded to hit your daily goal."
          checked={notifs.reminders} 
          onChange={() => toggle("reminders")} 
        />
        <ToggleRow 
          label="Weekly Progress Summary" 
          description="Receive an overview of your achievements every week."
          checked={notifs.summary} 
          onChange={() => toggle("summary")} 
        />
        <ToggleRow 
          label="Product Updates" 
          description="Hear about new features and improvements."
          checked={notifs.updates} 
          onChange={() => toggle("updates")} 
        />
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-5 gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">{description}</p>
      </div>
      <button 
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
        )}
      >
        <span 
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// About Tab
// ----------------------------------------------------------------------
function AboutTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-xl font-bold tracking-tight">About LearnOS</h2>
        <p className="text-sm text-[var(--muted-foreground)]">System information and application details.</p>
      </div>

      <div className="rounded-2xl border bg-[var(--card)] shadow-sm divide-y divide-[var(--border)]">
        <SettingRow label="LearnOS Version" value="v0.1.0-beta" />
        <SettingRow label="AI Provider" value="Google Gemini 2.0" />
        <SettingRow label="Framework" value="Next.js 15" />
        
        <a 
          href="https://github.com/kirankumarjmeshram/LearnOS" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-between p-5 hover:bg-[var(--secondary)]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Code className="size-4" />
            <p className="text-sm font-medium">GitHub Repository</p>
          </div>
          <ChevronRight className="size-4 text-[var(--muted-foreground)]" />
        </a>
      </div>

      <div className="rounded-2xl bg-[var(--secondary)]/30 p-6 text-center space-y-3 border border-[var(--border)]">
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[var(--primary)] to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <BookOpen className="size-6 text-white" />
        </div>
        <p className="text-sm font-medium">LearnOS: Agentic Learning Experience</p>
        <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
          LearnOS dynamically generates personalized roadmaps, lessons, and AI tutoring based on your goals. Designed to provide a truly adaptive curriculum.
        </p>
      </div>
    </div>
  );
}
