import { createRouter } from "./context";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import { ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
      const command = new ListObjectsCommand({
        Bucket: process.env.S3_BUCKET,
        Prefix: input.id,
      });

      const { Contents, Prefix, IsTruncated, MaxKeys } = await s3.send(command);

      const files = !Contents
        ? []
        : await Promise.all(
            Contents?.map(async ({ Key }) => {
              const url = await getSignedUrl(
                s3,
                new GetObjectCommand({
                  Bucket: process.env.S3_BUCKET,
                  Key,
                  
                })
              );
              return {
                url,
                key: Key,
              };
            })
          );

      return {
        files: files,
        isTruncated: IsTruncated,
        maxKeys: MaxKeys,
        prefix: Prefix,
      };
    },
  });
