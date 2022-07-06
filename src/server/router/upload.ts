import { createRouter } from "./context";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import filenamify from "filenamify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@prisma/client";
import * as trpc from "@trpc/server";

export const exampleRouter = createRouter()
  .mutation("request", {
    input: z.object({
      name: z.string().min(3).max(100),
      id: z.string().cuid().optional(),
      close: z.boolean().optional(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      let upload: Upload | null = null;

      if (input.id)
        upload = await prisma.upload.findUnique({ where: { id: input.id } });

      if (!upload)
        upload = await prisma.upload.create({
          data: {},
        });

      console.log(upload);

      if (upload.closed)
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Upload for this pool already closed",
        });

      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: `${upload.id}/${filenamify(input.name, { replacement: "_" })}`, //filename
        }),
        {
          expiresIn: 100,
        }
      );

      if (input.close)
        await prisma.upload.update({
          where: { id: input.id },
          data: { closed: true },
        });

      return { url, uploadId: upload.id };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
