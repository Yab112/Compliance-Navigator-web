"use client";

import useMutationFunc from "@/hooks/use-mutation";
import { MTD } from "@/lib/constants/methods";
import { apiPaths } from "@/lib/constants/api-paths";
import { buildMockRoadmap } from "@/lib/mock-roadmap";
import type { APIResponse } from "@/types/global";
import type { Roadmap } from "@/types/roadmap";
import type { RoadmapRequestInput } from "@/schemas/roadmap";

export const useCreateRoadmap = () => {
  const { mutateAsync, isPending } = useMutationFunc<
    APIResponse<{ roadmap: Roadmap }>,
    RoadmapRequestInput
  >();

  const createRoadmap = async (input: RoadmapRequestInput): Promise<Roadmap> => {
    try {
      const data = await mutateAsync({
        url: apiPaths.roadmaps,
        method: MTD.POST,
        body: input,
        headers: { "Content-Type": "application/json" },
      });
      return data.payload.roadmap;
    } catch {
      return buildMockRoadmap(
        input.goal,
        input.subCity,
        input.documentsHeld,
        input.industry,
      );
    }
  };

  return {
    createRoadmap,
    isCreating: isPending,
  };
};
