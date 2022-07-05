import { createRouter } from "./context";
import { z } from "zod";
import s3 from "../../utils/s3/s3";

export const exampleRouter = createRouter()
  .mutation("request", {
    input: z.object({
      name: z.string().min(3).max(100),
    }),
    resolve({ input }) {
      // putObject operation.

      const URL = s3.getSignedUrl("putObject", {
        Bucket: "data",
        Key: input.name, //filename
        Expires: 100, //time to expire in seconds
      });

      return {
        url: URL,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
