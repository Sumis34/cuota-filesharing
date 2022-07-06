import { createRouter } from "./context";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import filenamify from "filenamify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

      // const url = s3.getSignedUrl("putObject", {
      //   Bucket: "data",
      //   Key: `${filenamify(input.name, { replacement: "_" })}`, //filename
      //   Expires: 100, //time to expire in seconds
      // });

      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: `${upload.id}/${filenamify(input.name, { replacement: "_" })}`, //filename,
        })
      );

      return { url, uploadId: upload.id };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
