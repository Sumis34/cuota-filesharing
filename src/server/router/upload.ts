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
import path from "path";

interface UploadURLOptions {
  maxCacheAge: number;
}

const types = ["original", "preview"] as const;

export type SourceType = typeof types[number];

const Files = z.array(
  z.object({
    name: z.string().min(3).max(1024),
    type: z.enum(types).default("original"),
    encrypted: z.boolean().default(false),
  })
);

const uploadInputSchema = z.object({
  names: z.string().min(3).max(1024).array(),
  id: z.string().cuid().optional(),
  size: z.number().optional(),
  message: z.string().max(100).optional(),
  close: z.boolean().optional(),
});

const uploadInputSchemaV2 = z.object({
  files: Files,
  id: z.string().cuid().optional(),
  size: z.number().optional(),
  message: z.string().max(150).optional(),
});

/**
 * @deprecated Use V2 instead
 */
const getUploadUrls = async (
  uploadId: string,
  names: string[],
  options?: UploadURLOptions
) => {
  return await Promise.all(
    names.map((name) => getUploadUrl(uploadId, name, options))
  );
};

const getUploadUrlsV2 = async (
  poolId: string,
  files: { type: SourceType; name: string; encrypted: boolean }[]
) => {
  return await Promise.all(
    files.map((f) => getUploadUrlV2(poolId, f.name, f.type, f.encrypted))
  );
};

/**
 * @deprecated Use V2 instead
 */
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
      expiresIn: 3600,
    }
  );
};

//TODO: Look in to https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html because Policies are possible
const getUploadUrlV2 = async (
  poolId: string,
  name: string,
  type: SourceType,
  encrypted?: Boolean,
  options?: UploadURLOptions
) => {
  const safeName = filenamify(name, { replacement: "_" });

  const key =
    type === "preview"
      ? `${poolId}/preview/${safeName}`
      : `${poolId}/${safeName}`;

  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key, //filename
      Metadata: {
        poolId,
        encrypted: encrypted ? "true" : "false",
      },
      ContentDisposition: `attachment; filename=${name}`,
      CacheControl: `max-age=${options?.maxCacheAge || 60}`,
    }),
    {
      expiresIn: 3600,
    }
  );
};

export const exampleRouter = createRouter()
  .mutation("request", {
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
            expiresAt: new Date(Date.now() + SEVEN_DAYS * 1000),
            ...(session && {
              user: {
                connect: {
                  id: (session?.user?.id as string) || undefined,
                },
              },
            }),
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
  })
  .mutation("requestV2", {
    input: uploadInputSchemaV2,
    async resolve({ input, ctx }) {
      const { prisma, session } = ctx;

      const upload = await prisma.upload.create({
        data: {
          message: input.message,
          expiresAt: new Date(Date.now() + SEVEN_DAYS * 1000),
          ...(session && {
            user: {
              connect: {
                id: (session?.user?.id as string) || undefined,
              },
            },
          }),
        },
      });

      const urls = await getUploadUrlsV2(upload.id, input.files);

      return { urls, uploadId: upload.id };
    },
  });
