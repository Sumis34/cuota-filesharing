import { createRouter } from "./context";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import {
  ListObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  _Object,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SEVEN_DAYS } from "../../utils/timeInSeconds";

const getFiles = async (contents: _Object[], totalSize: number) => {
  return await Promise.all(
    contents?.map(async ({ Key }) => {
      const params: GetObjectCommandInput = {
        Bucket: process.env.S3_BUCKET,
        Key,
        ResponseCacheControl: `max-age=${SEVEN_DAYS}`,
      };
      const url = await getSignedUrl(s3, new GetObjectCommand(params));

      const { ContentType, ContentLength, LastModified, Metadata } =
        await s3.send(new HeadObjectCommand(params));

      if (ContentLength) totalSize += ContentLength;

      return {
        url,
        key: Key,
        contentType: ContentType,
        contentLength: ContentLength,
        lastModified: LastModified,
        metadata: Metadata,
      };
    })
  );
};

export const filesRouter = createRouter()
  .mutation("request", {
    input: z.object({
      name: z.string().min(3).max(100),
    }),
    async resolve({ input, ctx }) {
      return { url: "" };
    },
  })
  .query("getAll", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      let totalSize = 0;
      const command = new ListObjectsCommand({
        Bucket: process.env.S3_BUCKET,
        Prefix: input.id,
      });

      const { Contents, Prefix, IsTruncated, MaxKeys } = await s3.send(command);

      const uploadInfo = await prisma.upload.findUnique({
        where: { id: input.id },
      });

      const files = !Contents ? [] : await getFiles(Contents, totalSize);

      return {
        files,
        totalSize,
        isTruncated: IsTruncated,
        maxKeys: MaxKeys,
        prefix: Prefix,
        owner: uploadInfo?.userId,
        message: uploadInfo?.message,
        allowsUploads: !uploadInfo?.closed,
        poolCreatedAt: uploadInfo?.uploadTime,
      };
    },
  });
