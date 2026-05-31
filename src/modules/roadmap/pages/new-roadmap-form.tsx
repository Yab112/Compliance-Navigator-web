"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoalPicker } from "@/components/roadmap/goal-picker";
import { SubCityPicker } from "@/components/roadmap/sub-city-picker";
import {
  ALL_DOCUMENT_IDS,
  DOCUMENT_LABELS,
  PROCESS_GOALS,
} from "@/constants/compliance";
import { getLocationLabel } from "@/constants/addis-locations";
import { useCreateRoadmap } from "@/api/roadmap";
import { roadmapRequestSchema } from "@/schemas/roadmap";
import { useRoadmapStore } from "@/store/roadmap-store";
import { cn } from "@/lib/utils";

const VALID_GOALS = new Set(PROCESS_GOALS.map((g) => g.id));

type NewRoadmapFormProps = {
  initialGoal?: string;
};

function FormStep({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex gap-3">
        <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
          {number}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-base font-semibold">{title}</h2>
          {hint && (
            <p className="text-muted-foreground mt-1 text-sm">{hint}</p>
          )}
        </div>
      </div>
      <div className="overflow-visible pl-11">{children}</div>
    </section>
  );
}

export function NewRoadmapForm({ initialGoal }: NewRoadmapFormProps) {
  const router = useRouter();
  const setCurrent = useRoadmapStore((s) => s.setCurrent);
  const { createRoadmap, isCreating } = useCreateRoadmap();

  const defaultGoal =
    initialGoal && VALID_GOALS.has(initialGoal) ? initialGoal : "passport";
  const [goal, setGoal] = useState(defaultGoal);
  const [subCity, setSubCity] = useState("bole");
  const [documentsHeld, setDocumentsHeld] = useState<string[]>([]);
  const [showDocs, setShowDocs] = useState(false);

  const relevantDocs = useMemo(() => {
    const g = PROCESS_GOALS.find((x) => x.id === goal);
    if (!g) return [...ALL_DOCUMENT_IDS];
    const subCityLabel = getLocationLabel(subCity);
    const stepIds = new Set(g.getSteps(subCity, subCityLabel).map((s) => s.id));
    return ALL_DOCUMENT_IDS.filter((id) => stepIds.has(id));
  }, [goal, subCity]);

  function toggleDocument(id: string) {
    setDocumentsHeld((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = roadmapRequestSchema.safeParse({
      goal,
      subCity,
      documentsHeld,
    });
    if (!parsed.success) return;

    const roadmap = await createRoadmap(parsed.data);
    setCurrent(roadmap);
    router.push("/roadmap");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 md:py-14">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Find my path
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Answer two quick questions. Optional: tell us what you already have.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="border-border space-y-10 overflow-visible rounded-xl border bg-card p-6 md:p-8"
      >
        <FormStep number={1} title="What do you need?">
          <GoalPicker value={goal} onChange={setGoal} />
        </FormStep>

        <div className="border-border border-t" />

        <FormStep
          number={2}
          title="Where in Addis Ababa?"
          hint="Tap your area or search below."
        >
          <SubCityPicker value={subCity} onChange={setSubCity} />
        </FormStep>

        <div className="border-border border-t" />

        <FormStep
          number={3}
          title="Already have documents?"
          hint="Optional — we skip steps you finished."
        >
          <button
            type="button"
            onClick={() => setShowDocs((s) => !s)}
            className="text-primary text-sm font-medium"
          >
            {showDocs ? "Hide list" : "Show list"}
            {documentsHeld.length > 0 &&
              ` (${documentsHeld.length} selected)`}
          </button>
          {showDocs && (
            <div className="mt-3 flex flex-wrap gap-2">
              {relevantDocs.map((id) => {
                const selected = documentsHeld.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleDocument(id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background",
                    )}
                  >
                    {DOCUMENT_LABELS[id] ?? id}
                  </button>
                );
              })}
            </div>
          )}
        </FormStep>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-lg text-base"
          loading={isCreating}
        >
          Show my path
        </Button>
      </form>
    </div>
  );
}
