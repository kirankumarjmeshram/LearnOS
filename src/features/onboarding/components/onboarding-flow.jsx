"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, Clock3, Pencil, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { onboardingDefaults, onboardingSchema } from "@/schemas/onboarding";
import { completeOnboarding, setOnboardingData, setOnboardingStep } from "@/store/slices/onboarding-slice";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";

const steps = ["Welcome", "Goal", "Timeline", "Study time", "About you", "Learning style", "Assessment", "Review"];
const careers = ["Software Engineer", "AI Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Cloud Engineer", "Cyber Security", "Product Manager", "UI UX Designer", "Student"];
const timelines = ["1 Month", "3 Months", "6 Months", "1 Year"];
const styles = ["Videos", "Reading", "Projects", "Hands-on", "Interactive"];
const stepFields = [["goal"], ["timeline"], ["weeklyHours"], [], ["learningStyles"], ["assessmentDecision"]];

function resolveOnboarding(values) {
  const result = onboardingSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  return { values: {}, errors: result.error.issues.reduce((errors, issue) => ({ ...errors, [issue.path[0]]: { type: "validation", message: issue.message } }), {}) };
}

function OptionCard({ active, children, onClick, className }) {
  return <button type="button" onClick={onClick} className={cn("relative rounded-2xl border bg-[var(--card)] p-4 text-left text-sm font-medium hover:border-[var(--primary)]", active && "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]", className)}>{active && <Check className="absolute right-3 top-3 size-4 text-[var(--primary)]" />}{children}</button>;
}

export function OnboardingFlow() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: savedData, currentStep: savedStep } = useSelector((state) => state.onboarding);
  const [step, setStep] = useState(savedStep);
  const [query, setQuery] = useState("");
  const [isCustomGoal, setIsCustomGoal] = useState(false);
  const { register, setValue, getValues, watch, reset, trigger, formState: { errors } } = useForm({ defaultValues: savedData || onboardingDefaults, resolver: resolveOnboarding });
  const values = watch();
  const filteredCareers = useMemo(() => careers.filter((career) => career.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    const draft = getLocalStorageItem("learnos-onboarding-draft");
    if (draft?.data) { reset(draft.data); setStep(draft.step || 0); dispatch(setOnboardingData(draft.data)); dispatch(setOnboardingStep(draft.step || 0)); }
  }, [dispatch, reset]);

  const persist = () => { const data = getValues(); dispatch(setOnboardingData(data)); dispatch(setOnboardingStep(step)); return data; };
  const saveLater = () => { const data = persist(); setLocalStorageItem("learnos-onboarding-draft", { data, step }); toast.success("Your onboarding progress has been saved."); };
  const goNext = async () => {
    const fields = stepFields[step - 1] || [];
    if (fields.length && !(await trigger(fields))) return;
    persist();
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const goBack = () => setStep((current) => Math.max(current - 1, 0));
  const submit = async () => {
    if (!(await trigger())) return;
    dispatch(setOnboardingData(getValues()));
    dispatch(completeOnboarding());
    router.push("/roadmap/loading");
  };
  const chooseGoal = (goal) => { setIsCustomGoal(false); setValue("goal", goal, { shouldValidate: true }); };
  const toggleStyle = (style) => { const next = values.learningStyles.includes(style) ? values.learningStyles.filter((item) => item !== style) : [...values.learningStyles, style]; setValue("learningStyles", next, { shouldValidate: true }); };

  return <section className="mx-auto w-full max-w-3xl"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-semibold text-[var(--primary)]">LearnOS onboarding</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Step {step + 1} of {steps.length}</p></div><button type="button" onClick={saveLater} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Save &amp; Continue Later</button></div><div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]"><motion.div className="h-full bg-[var(--primary)]" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><motion.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="mt-8 rounded-3xl border bg-[var(--card)] p-6 shadow-sm sm:p-9">
    {step === 0 && <div className="max-w-xl"><span className="grid size-12 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--primary)]"><Sparkles /></span><h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Build a learning journey that fits your life.</h1><p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">LearnOS will get to know your ambition, available time, and preferred ways of learning—so your future learning path feels personal and achievable.</p></div>}
    {step === 1 && <div><h1 className="text-3xl font-semibold">What do you want to become?</h1><p className="mt-2 text-[var(--muted-foreground)]">Choose a direction or describe your own goal.</p><label className="mt-6 flex items-center gap-2 rounded-xl border px-4 py-3"><Search className="size-4 text-[var(--muted-foreground)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search career goals" className="w-full bg-transparent outline-none" /></label><div className="mt-4 grid gap-3 sm:grid-cols-2">{filteredCareers.map((career) => <OptionCard key={career} active={values.goal === career && !isCustomGoal} onClick={() => chooseGoal(career)}>{career}</OptionCard>)}<OptionCard active={isCustomGoal} onClick={() => { setIsCustomGoal(true); setValue("goal", "", { shouldValidate: true }); }}>Custom Goal</OptionCard></div>{isCustomGoal && <input {...register("goal")} autoFocus placeholder="Tell us what you want to become" className="mt-4 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)]" />}{errors.goal && <p className="mt-3 text-sm text-red-600">{errors.goal.message}</p>}</div>}
    {step === 2 && <div><h1 className="text-3xl font-semibold">When would you like to reach this goal?</h1><p className="mt-2 text-[var(--muted-foreground)]">A timeline helps set a realistic pace.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{timelines.map((timeline) => <OptionCard key={timeline} active={values.timeline === timeline} onClick={() => setValue("timeline", timeline, { shouldValidate: true })}><Clock3 className="mb-4 size-5 text-[var(--primary)]" />{timeline}</OptionCard>)}<OptionCard active={values.timeline === "Custom"} onClick={() => setValue("timeline", "Custom", { shouldValidate: true })}>Custom timeline</OptionCard></div>{errors.timeline && <p className="mt-3 text-sm text-red-600">{errors.timeline.message}</p>}</div>}
    {step === 3 && <div><h1 className="text-3xl font-semibold">How much time can you study each week?</h1><p className="mt-2 text-[var(--muted-foreground)]">We will use this to shape future learning sessions.</p><div className="mt-10 rounded-2xl bg-[var(--secondary)] p-6"><div className="flex items-end justify-between"><span className="text-sm font-medium">Weekly study time</span><strong className="text-4xl text-[var(--primary)]">{values.weeklyHours}<span className="text-base"> hrs</span></strong></div><input {...register("weeklyHours", { valueAsNumber: true })} type="range" min="5" max="40" step="1" className="mt-8 w-full accent-[var(--primary)]" /><div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]"><span>5 hours</span><span>40 hours</span></div></div>{errors.weeklyHours && <p className="mt-3 text-sm text-red-600">{errors.weeklyHours.message}</p>}</div>}
    {step === 4 && <div><h1 className="text-3xl font-semibold">Tell us a little about yourself.</h1><p className="mt-2 text-[var(--muted-foreground)]">Everything on this step is optional, but it helps future recommendations feel more relevant.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["education", "Education"], ["experience", "Experience"], ["currentJob", "Current job"], ["country", "Country"]].map(([name, label]) => <label key={name} className="text-sm font-medium">{label}<input {...register(name)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[var(--ring)]" /></label>)}</div></div>}
    {step === 5 && <div><h1 className="text-3xl font-semibold">How do you learn best?</h1><p className="mt-2 text-[var(--muted-foreground)]">Choose as many styles as feel useful to you.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{styles.map((style) => <OptionCard key={style} active={values.learningStyles.includes(style)} onClick={() => toggleStyle(style)}>{style}</OptionCard>)}</div>{errors.learningStyles && <p className="mt-3 text-sm text-red-600">{errors.learningStyles.message}</p>}</div>}
    {step === 6 && <div><span className="grid size-12 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--primary)]"><BrainCircuit /></span><h1 className="mt-6 text-3xl font-semibold">Would you like a knowledge assessment?</h1><p className="mt-3 max-w-xl leading-7 text-[var(--muted-foreground)]">LearnOS can evaluate your current knowledge before generating a roadmap. You can also begin without one and refine your journey later.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><OptionCard active={values.assessmentDecision === "skip"} onClick={() => setValue("assessmentDecision", "skip", { shouldValidate: true })}>Skip for now</OptionCard><OptionCard active={values.assessmentDecision === "start"} onClick={() => setValue("assessmentDecision", "start", { shouldValidate: true })}>Start Assessment <span className="block pt-1 text-xs font-normal text-[var(--muted-foreground)]">Coming next</span></OptionCard></div>{errors.assessmentDecision && <p className="mt-3 text-sm text-red-600">{errors.assessmentDecision.message}</p>}</div>}
    {step === 7 && <div><h1 className="text-3xl font-semibold">Review your learning profile.</h1><p className="mt-2 text-[var(--muted-foreground)]">You can change any detail before LearnOS prepares your next experience.</p><div className="mt-6 divide-y overflow-hidden rounded-2xl border">{[["Goal", values.goal, 1], ["Timeline", values.timeline, 2], ["Weekly study time", `${values.weeklyHours} hours`, 3], ["About you", [values.education, values.experience, values.currentJob, values.country].filter(Boolean).join(" · ") || "Not provided", 4], ["Learning styles", values.learningStyles.join(", "), 5], ["Assessment", values.assessmentDecision === "start" ? "Start assessment (coming next)" : "Skip for now", 6]].map(([label, value, editStep]) => <div key={label} className="flex items-center justify-between gap-4 p-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</p><p className="mt-1 font-medium">{value}</p></div><button type="button" onClick={() => setStep(editStep)} className="grid size-9 place-items-center rounded-lg border hover:bg-[var(--muted)]" aria-label={`Edit ${label}`}><Pencil className="size-4" /></button></div>)}</div></div>}
    <div className="mt-10 flex items-center justify-between gap-3"><button type="button" onClick={goBack} disabled={step === 0} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:invisible"><ArrowLeft className="size-4" />Back</button>{step < steps.length - 1 ? <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)]">{step === 0 ? "Start My Journey" : "Next"}<ArrowRight className="size-4" /></button> : <button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)]">Generate My Learning Roadmap<ArrowRight className="size-4" /></button>}</div>
  </motion.div></section>;
}
