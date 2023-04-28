import filenamify from "filenamify";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import { ONE_MONTH } from "../../utils/timeInSeconds";
import { createRouter } from "./context";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { BIN_KEY_PREFIX } from "../../utils/constants";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  HeadObjectCommand,
  ListObjectsV2Command,
  _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getUploadUrl = async (
  binId: string,
  name: string,
  encrypted?: Boolean
) => {
  const key = filenamify(name, { replacement: "_" });
  
  const signed = await createPresignedPost(s3, {
    Bucket: process.env.S3_BUCKET || "",
    Key: `${BIN_KEY_PREFIX}/${binId}/${key}`,
    Fields: {
      "x-amz-meta-binId": binId,
    },
    Conditions: [["content-length-range", 1, 1 * 1024 * 1024]],
  });

  return signed;
};

const getUploadUrls = async (binId: string, files: { name: string }[]) => {
  return await Promise.all(files.map((f) => getUploadUrl(binId, f.name)));
};

const getFiles = async (contents: _Object[]) => {
  return await Promise.all(
    contents.map(async ({ Key }) => {
      const params: GetObjectCommandInput = {
        Bucket: process.env.S3_BUCKET,
        Key,
      };
      const url = await getSignedUrl(s3, new GetObjectCommand(params));

      const { ContentType, ContentLength, LastModified, Metadata } =
        await s3.send(new HeadObjectCommand(params));

      return {
        url,
        key: Key,
        filename: Key?.split("/").at(-1),
        contentType: ContentType,
        contentLength: ContentLength,
        lastModified: LastModified,
        metadata: Metadata,
      };
    })
  );
};

export const binRouter = createRouter()
  .mutation("requestUpload", {
    input: z.object({
      files: z
        .array(z.object({ name: z.string().min(3).max(50) }))
        .min(1)
        .max(10),
    }),
    async resolve({ input, ctx }) {
      const { prisma, session } = ctx;

      const bin = await prisma.bin.create({
        data: {
          expiresAt: new Date(Date.now() + ONE_MONTH * 1000),
          ...(session && {
            user: {
              connect: {
                id: (session?.user?.id as string) || undefined,
              },
            },
          }),
        },
      });

      const signed = await getUploadUrls(bin.id, input.files);

      return { urls: signed, binId: bin.id };
    },
  })
  .query("getBin", {
    input: z.object({
      id: z.string().cuid(),
    }),
    resolve: async ({ input, ctx }) => {
      const { prisma } = ctx;
      let totalSize = 0;
      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        Prefix: BIN_KEY_PREFIX + "/" + input.id,
      });

      const { Contents, Prefix, IsTruncated, MaxKeys } = await s3.send(command);

      const binInfo = await prisma.bin.findUnique({
        where: { id: input.id },
      });

      const files = !Contents ? [] : await getFiles(Contents);

      return {
        files,
        totalSize,
        isTruncated: IsTruncated,
        maxKeys: MaxKeys,
        prefix: Prefix,
        owner: binInfo?.userId,
        createdAt: binInfo?.uploadTime,
        expiresAt: binInfo?.expiresAt,
      };
    },
  });
