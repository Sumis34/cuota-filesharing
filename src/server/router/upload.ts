import { createRouter } from "./context";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import filenamify from "filenamify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@prisma/client";
import * as trpc from "@trpc/server";

const getUploadUrl = async (uploadId: string, name: string) => {
  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${uploadId}/${filenamify(name, { replacement: "_" })}`, //filename
    }),
    {
      expiresIn: 100,
    }
  );
};

const getUploadUrls = async (uploadId: string, names: string[]) => {
  return await Promise.all(names.map((name) => getUploadUrl(uploadId, name)));
};

export const uploadInputSchema = z.object({
  names: z.string().min(3).max(100).array(),
  id: z.string().cuid().optional(),
  message: z.string().max(100).optional(),
  close: z.boolean().optional(),
});

export const exampleRouter = createRouter()
  .mutation("request", {
    input: uploadInputSchema,
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

      const urls = await getUploadUrls(upload.id, input.names);

      if (input.close)
        await prisma.upload.update({
          where: { id: upload.id },
          data: { closed: true },
        });

      return { urls, uploadId: upload.id };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
