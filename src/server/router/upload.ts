import { createRouter } from "./context";
import { z } from "zod";
import s3 from "../../utils/s3/s3";
import { ListObjectsRequest } from "@aws-sdk/client-s3";

export const exampleRouter = createRouter()
  .mutation("request", {
    input: z.object({
      name: z.string().min(3).max(100),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      const upload = await prisma.upload.create({
        data: {},
      });

      const url = s3.getSignedUrl("putObject", {
        Bucket: "data",
        Key: `${upload.id}/${input.name}`, //filename
        Expires: 100, //time to expire in seconds
      });

      return { url };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
