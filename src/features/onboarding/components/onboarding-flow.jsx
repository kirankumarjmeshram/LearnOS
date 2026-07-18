"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock3, Pencil, Search, Sparkles, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { onboardingDefaults, onboardingSchema } from "@/schemas/onboarding";
import { completeOnboarding, setOnboardingData, setOnboardingStep } from "@/store/slices/onboarding-slice";
import { TechnologySelector } from "./technology-selector";
import { LearningStyleRanker } from "./learning-style-ranker";
import { MyResourcesStep } from "./steps/my-resources-step";

const steps = [
  "Career Goal",
  "Experience Level",
  "Learning Goal",
  "Timeline",
  "Weekly Hours",
  "Current Knowledge",
  "Technology Stack",
  "Learning Style",
  "My Resources",
  "Review",
];

const careers = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "AI Engineer",
  "Data Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cyber Security",
  "Mobile Developer",
  "Product Manager",
  "UI/UX Designer",
];

const experienceLevels = [
  "Complete Beginner",
  "Programming Basics",
  "Student",
  "Junior Developer",
  "Mid-Level Developer",
  "Senior Developer",
];

const learningGoals = [
  "Get My First Job",
  "Interview Preparation",
  "Career Switch",
  "Promotion",
  "Startup",
  "Freelancing",
  "College",
  "Upskill",
  "Personal Interest",
];

const timelines = ["1 Month", "3 Months", "6 Months", "12 Months"];

const defaultKnowledgeSuggestions = [
  "Git",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "REST API",
  "MongoDB",
  "SQL",
  "Docker",
  "Testing",
  "Authentication",
];

const stepFields = [
  ["goal"],
  ["experienceLevel"],
  ["learningGoal"],
  ["timeline"],
  ["weeklyHours"],
  ["currentKnowledge"],
  ["preferredTechnologyStack", "customTechnologies"],
  ["learningStyleRanking"],
  ["resources"],
];

function resolveOnboarding(values) {
  const result = onboardingSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  return {
    values: {},
    errors: result.error.issues.reduce(
      (errors, issue) => ({
        ...errors,
        [issue.path[0]]: { type: "validation", message: issue.message },
      }),
      {},
    ),
  };
}

function OptionCard({ active, children, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border bg-[var(--card)] p-5 text-left text-sm font-medium hover:border-[var(--primary)] transition-all",
        active && "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)] font-semibold shadow-sm",
        className,
      )}
    >
      {active && <Check className="absolute right-4 top-4 size-4 text-[var(--primary)]" />}
      {children}
    </button>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: savedData, currentStep: savedStep } = useSelector((state) => state.onboarding);
  const [step, setStep] = useState(savedStep);
  const [careerQuery, setCareerQuery] = useState("");
  const [isCustomGoal, setIsCustomGoal] = useState(false);

  // States for Current Knowledge step
  const [knowledgeQuery, setKnowledgeQuery] = useState("");

  const methods = useForm({
    defaultValues: savedData || onboardingDefaults,
    resolver: resolveOnboarding,
  });

  const {
    control,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = methods;

  const values = useWatch({ control });

  const filteredCareers = useMemo(
    () => careers.filter((c) => c.toLowerCase().includes(careerQuery.toLowerCase())),
    [careerQuery],
  );

  // Filter current knowledge suggestions
  const filteredKnowledgeSuggestions = useMemo(() => {
    const selected = values.currentKnowledge || [];
    const query = knowledgeQuery.trim().toLowerCase();
    
    // Filter suggestions that are not already selected
    const unselected = defaultKnowledgeSuggestions.filter((item) => !selected.includes(item));
    
    if (!query) return unselected;
    return unselected.filter((item) => item.toLowerCase().includes(query));
  }, [values.currentKnowledge, knowledgeQuery]);

  const persist = () => {
    const data = getValues();
    dispatch(setOnboardingData(data));
    dispatch(setOnboardingStep(step));
    return data;
  };

  const saveLater = () => {
    persist();
    toast.success("Your onboarding progress has been saved.");
  };

  const goNext = async () => {
    const fields = stepFields[step] || [];
    if (fields.length && !(await trigger(fields))) return;
    persist();
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const submit = async () => {
    if (!(await trigger())) return;
    dispatch(setOnboardingData(getValues()));
    dispatch(completeOnboarding());
    router.push("/dashboard?generating=true");
  };

  const chooseGoal = (goal) => {
    setIsCustomGoal(false);
    setValue("goal", goal, { shouldValidate: true });
  };

  const handleAddKnowledge = (item) => {
    const clean = item.trim();
    if (!clean) return;
    const current = values.currentKnowledge || [];
    if (!current.includes(clean)) {
      setValue("currentKnowledge", [...current, clean], { shouldValidate: true });
    }
    setKnowledgeQuery("");
  };

  const handleRemoveKnowledge = (item) => {
    const current = values.currentKnowledge || [];
    setValue("currentKnowledge", current.filter((i) => i !== item), { shouldValidate: true });
  };

  return (
    <FormProvider {...methods}>
      <section className="mx-auto w-full max-w-3xl">
        {/* Step counter & save option */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">LearnOS onboarding</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Step {step + 1} of {steps.length} — {steps[step]}
          </p>
        </div>
        <button
          type="button"
          onClick={saveLater}
          className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          Save Draft
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
        <motion.div
          className="h-full bg-[var(--primary)]"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        className="mt-8 rounded-3xl border bg-[var(--card)] p-6 shadow-sm sm:p-9"
      >
        {/* STEP 1: Career Goal */}
        {step === 0 && (
          <div>
            <h1 className="text-3xl font-semibold">What is your target role?</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Choose your career track. This sets the base technology options.
            </p>
            <label className="mt-6 flex items-center gap-2 rounded-xl border px-4 py-3 bg-[var(--background)]">
              <Search className="size-4 text-[var(--muted-foreground)]" />
              <input
                value={careerQuery}
                onChange={(event) => setCareerQuery(event.target.value)}
                placeholder="Search career goals"
                className="w-full bg-transparent outline-none text-sm"
              />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {filteredCareers.map((career) => (
                <OptionCard
                  key={career}
                  active={values.goal === career && !isCustomGoal}
                  onClick={() => chooseGoal(career)}
                >
                  {career}
                </OptionCard>
              ))}
              <OptionCard
                active={isCustomGoal}
                onClick={() => {
                  setIsCustomGoal(true);
                  setValue("goal", "", { shouldValidate: true });
                }}
              >
                Custom Role
              </OptionCard>
            </div>
            {isCustomGoal && (
              <input
                {...register("goal")}
                autoFocus
                placeholder="Enter custom career role (e.g. Game Developer)"
                className="mt-4 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm"
              />
            )}
            {errors.goal && <p className="mt-3 text-sm text-red-600">{errors.goal.message}</p>}
          </div>
        )}

        {/* STEP 2: Experience Level */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-semibold">What is your experience level?</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              This will determine the depth and starting concepts of your roadmap.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {experienceLevels.map((lvl) => (
                <OptionCard
                  key={lvl}
                  active={values.experienceLevel === lvl}
                  onClick={() => setValue("experienceLevel", lvl, { shouldValidate: true })}
                >
                  <span className="block font-semibold">{lvl}</span>
                </OptionCard>
              ))}
            </div>
            {errors.experienceLevel && (
              <p className="mt-3 text-sm text-red-600">{errors.experienceLevel.message}</p>
            )}
          </div>
        )}

        {/* STEP 3: Learning Goal */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-semibold">Why are you learning?</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Your primary objective helps us include specific exercises, DSA, or system design.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {learningGoals.map((g) => (
                <OptionCard
                  key={g}
                  active={values.learningGoal === g}
                  onClick={() => setValue("learningGoal", g, { shouldValidate: true })}
                >
                  {g}
                </OptionCard>
              ))}
            </div>
            {errors.learningGoal && (
              <p className="mt-3 text-sm text-red-600">{errors.learningGoal.message}</p>
            )}
          </div>
        )}

        {/* STEP 4: Timeline */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-semibold">When would you like to reach this goal?</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              A timeline helps partition lessons into phases and weeks.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {timelines.map((timeline) => (
                <OptionCard
                  key={timeline}
                  active={values.timeline === timeline}
                  onClick={() => setValue("timeline", timeline, { shouldValidate: true })}
                >
                  <Clock3 className="mb-4 size-5 text-[var(--primary)]" />
                  {timeline}
                </OptionCard>
              ))}
              <OptionCard
                active={!timelines.includes(values.timeline) && values.timeline !== ""}
                onClick={() => setValue("timeline", "Custom", { shouldValidate: true })}
              >
                Custom timeline
              </OptionCard>
            </div>
            {(!timelines.includes(values.timeline) || values.timeline === "Custom") && (
              <input
                value={values.timeline === "Custom" ? "" : values.timeline}
                onChange={(e) => setValue("timeline", e.target.value, { shouldValidate: true })}
                placeholder="e.g. 9 Months, 2 Weeks"
                autoFocus
                className="mt-4 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm"
              />
            )}
            {errors.timeline && <p className="mt-3 text-sm text-red-600">{errors.timeline.message}</p>}
          </div>
        )}

        {/* STEP 5: Weekly Hours */}
        {step === 4 && (
          <div>
            <h1 className="text-3xl font-semibold">How much time can you study each week?</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Adjust study load so lessons are realistic and achievable.
            </p>
            <div className="mt-10 rounded-2xl bg-[var(--secondary)] p-6">
              <div className="flex items-end justify-between">
                <span className="text-sm font-medium">Weekly study time</span>
                <strong className="text-4xl text-[var(--primary)]">
                  {values.weeklyHours}
                  <span className="text-base font-normal"> hrs/week</span>
                </strong>
              </div>
              <input
                {...register("weeklyHours", { valueAsNumber: true })}
                type="range"
                min="5"
                max="40"
                step="1"
                className="mt-8 w-full accent-[var(--primary)]"
              />
              <div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]">
                <span>5 hours</span>
                <span>40 hours</span>
              </div>
            </div>
            {errors.weeklyHours && (
              <p className="mt-3 text-sm text-red-600">{errors.weeklyHours.message}</p>
            )}
          </div>
        )}

        {/* STEP 6: Current Knowledge */}
        {step === 5 && (
          <div>
            <h1 className="text-3xl font-semibold">What do you already know?</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Concepts or technologies you select here will be skipped in your roadmap.
            </p>

            {/* Selected Chips */}
            {values.currentKnowledge?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-dashed p-3">
                {values.currentKnowledge.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--secondary-foreground)]"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveKnowledge(item)}
                      className="rounded-full hover:bg-black/10 p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="mt-6 flex gap-2">
              <label className="flex flex-1 items-center gap-2 rounded-xl border px-4 py-2.5 bg-[var(--background)]">
                <Search className="size-4 text-[var(--muted-foreground)]" />
                <input
                  value={knowledgeQuery}
                  onChange={(e) => setKnowledgeQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKnowledge(knowledgeQuery);
                    }
                  }}
                  placeholder="Search or type a technology..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </label>
              {knowledgeQuery.trim() && (
                <button
                  type="button"
                  onClick={() => handleAddKnowledge(knowledgeQuery)}
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-[var(--primary-foreground)]"
                >
                  Add Custom
                </button>
              )}
            </div>

            {/* Suggestions list */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-2">
                {filteredKnowledgeSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleAddKnowledge(item)}
                    className="inline-flex items-center gap-1 rounded-lg border bg-[var(--card)] px-3 py-1 text-xs hover:border-[var(--primary)] transition-colors"
                  >
                    <Plus className="size-3 text-[var(--muted-foreground)]" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {errors.currentKnowledge && (
              <p className="mt-3 text-sm text-red-600">{errors.currentKnowledge.message}</p>
            )}
          </div>
        )}

        {/* STEP 7: Preferred Technology Stack */}
        {step === 6 && (
          <div>
            <h1 className="text-3xl font-semibold">Select your preferred tech stack</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Choose the stack components you want to specialize in or learn.
            </p>
            <div className="mt-6">
              <TechnologySelector
                careerGoal={values.goal}
                selectedTechnologies={values.preferredTechnologyStack}
                onChangeSelected={(val) =>
                  setValue("preferredTechnologyStack", val, { shouldValidate: true })
                }
                customTechnologies={values.customTechnologies}
                onChangeCustom={(val) =>
                  setValue("customTechnologies", val, { shouldValidate: true })
                }
              />
            </div>
          </div>
        )}

        {/* STEP 8: Learning Style */}
        {step === 7 && (
          <div>
            <h1 className="text-3xl font-semibold">Prioritize your learning style</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Order your preferences. This influences your lesson content structure and resources.
            </p>
            <div className="mt-6">
              <LearningStyleRanker
                ranking={values.learningStyleRanking}
                onChange={(val) =>
                  setValue("learningStyleRanking", val, { shouldValidate: true })
                }
              />
            </div>
            {errors.learningStyleRanking && (
              <p className="mt-3 text-sm text-red-600">{errors.learningStyleRanking.message}</p>
            )}
          </div>
        )}

        {/* STEP 9: My Resources */}
        {step === 8 && (
          <MyResourcesStep />
        )}

        {/* STEP 10: Review */}
        {step === 9 && (
          <div>
            <h1 className="text-3xl font-semibold">Review your learning profile</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Make sure everything looks right before generating your roadmap.
            </p>
            
            <div className="mt-6 divide-y overflow-hidden rounded-2xl border bg-[var(--background)]">
              {[
                { label: "Career Goal", value: values.goal, stepIdx: 0 },
                { label: "Experience Level", value: values.experienceLevel, stepIdx: 1 },
                { label: "Learning Goal", value: values.learningGoal, stepIdx: 2 },
                { label: "Timeline", value: values.timeline, stepIdx: 3 },
                { label: "Weekly Study Time", value: `${values.weeklyHours} hours`, stepIdx: 4 },
                {
                  label: "Current Knowledge",
                  value: values.currentKnowledge?.length > 0 ? values.currentKnowledge.join(", ") : "None specified",
                  stepIdx: 5,
                },
                {
                  label: "Preferred Stack",
                  value: values.preferredTechnologyStack?.length > 0 ? values.preferredTechnologyStack.join(", ") : "None specified",
                  stepIdx: 6,
                },
                {
                  label: "Custom Technologies",
                  value: values.customTechnologies?.length > 0 ? values.customTechnologies.join(", ") : "None specified",
                  stepIdx: 6,
                },
                {
                  label: "Learning Style Rank",
                  value: values.learningStyleRanking?.join(" → "),
                  stepIdx: 7,
                },
                {
                  label: "My Resources",
                  value: values.resources?.length > 0 ? `${values.resources.length} resources added` : "None added",
                  stepIdx: 8,
                },
              ].map(({ label, value, stepIdx }) => (
                <div key={label} className="flex items-center justify-between gap-4 p-4 hover:bg-[var(--secondary)]/10 transition-colors">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {label}
                    </p>
                    <p className="mt-1 font-medium text-sm leading-6">{value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(stepIdx)}
                    className="grid size-9 place-items-center rounded-lg border hover:bg-[var(--muted)] transition-colors shrink-0"
                    aria-label={`Edit ${label}`}
                  >
                    <Pencil className="size-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:invisible hover:bg-[var(--muted)] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
            >
              Next
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
            >
              ✨ Build My Learning OS
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </motion.div>
    </section>
    </FormProvider>
  );
}
