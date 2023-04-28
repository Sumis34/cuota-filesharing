import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import getVisitorSummary from "../../utils/pools/getVisitorSummary";

const DEFAULT_RETURN_COUNT = 15;
const MAX_RETURN_COUNT = 100;
const MIN_RETURN_COUNT = 1;

export const poolRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next();
  })
  .query("getUserPools", {
    input: z.object({
      cursor: z.number().optional(),
      take: z.number().max(MAX_RETURN_COUNT).min(MIN_RETURN_COUNT).optional(),
      asc: z.boolean().optional(),
    }),
    resolve: async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const isCurrentUser = {
        userId: {
          equals: session?.user?.id,
        },
      };

      const userPools = await prisma.upload.findMany({
        where: isCurrentUser,
        skip: input.cursor,
        take: input.take || DEFAULT_RETURN_COUNT,
        orderBy: {
          uploadTime: input.asc ? "asc" : "desc",
        },
      });

      const totalUserPoolsCount = await prisma.upload.count({
        where: isCurrentUser,
      });

      return {
        pools: userPools,
        total: totalUserPoolsCount,
        truncated: totalUserPoolsCount !== userPools.length,
      };
    },
  })
  .query("visitors", {
    input: z.object({
      poolId: z.string().cuid(),
    }),
    resolve: async ({ input, ctx }) => {
      const { prisma } = ctx;

      const summary = await getVisitorSummary(prisma, input.poolId);

      return summary;
    },
  });
