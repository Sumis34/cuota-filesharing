// src/utils/trpc.ts
import type { AppRouter } from "../server/router";
import { createReactQueryHooks } from "@trpc/react";

export const trpc = createReactQueryHooks<AppRouter>();

export const useQuery = trpc.useQuery;
export const useInfiniteQuery = trpc.useInfiniteQuery;
export const useMutation = trpc.useMutation;
export const useUtils = trpc.useContext;

/**
 * Check out tRPC docs for Inference Helpers
 * https://trpc.io/docs/infer-types#inference-helpers
 */
