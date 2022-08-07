import { createRouter } from "./context";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import filenamify from "filenamify";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@prisma/client";
import * as trpc from "@trpc/server";
import { FIVE_MINUTES, SEVEN_DAYS } from "../../utils/timeInSeconds";
import { isPreview } from "../../utils/preview/isPreview";

interface UploadURLOptions {
  maxCacheAge: number;
}

const uploadInputSchema = z.object({
  names: z.string().min(3).max(100).array(),
  id: z.string().cuid().optional(),
  message: z.string().max(100).optional(),
  close: z.boolean().optional(),
});

const getUploadUrls = async (
  uploadId: string,
  names: string[],
  options?: UploadURLOptions
) => {
  return await Promise.all(
    names.map((name) => getUploadUrl(uploadId, name, options))
  );
};

const getUploadUrl = async (
  uploadId: string,
  name: string,
  options?: UploadURLOptions
) => {
  const safeName = filenamify(name, { replacement: "_" });

  const path = isPreview(name)
    ? `${uploadId}/preview/${safeName}`
    : `${uploadId}/${safeName}`;

  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: path, //filename
      Metadata: {
        poolId: uploadId,
      },
      ContentDisposition: `attachment; filename=${name}`,
      CacheControl: `max-age=${options?.maxCacheAge || 60}`,
    }),
    {
      expiresIn: 100,
    }
  );
};

export const exampleRouter = createRouter().mutation("request", {
  input: uploadInputSchema,
  async resolve({ input, ctx }) {
    const { prisma, session } = ctx;
    let upload: Upload | null = null;

    if (input.id)
      upload = await prisma.upload.findUnique({ where: { id: input.id } });

    if (!upload)
      upload = await prisma.upload.create({
        data: {
          message: input.message,
        },
      });

    if (upload.closed)
      throw new trpc.TRPCError({
        code: "BAD_REQUEST",
        message: "Upload for this pool already closed",
      });

    const urls = await getUploadUrls(upload.id, input.names, {
      maxCacheAge: input.close ? SEVEN_DAYS : FIVE_MINUTES,
    });

    if (input.close)
      await prisma.upload.update({
        where: { id: upload.id },
        data: { closed: true },
      });

    return { urls, uploadId: upload.id };
  },
});
