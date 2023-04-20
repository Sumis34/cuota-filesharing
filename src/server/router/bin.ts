import filenamify from "filenamify";
import { z } from "zod";
import { s3 } from "../../utils/s3/s3";
import { ONE_MONTH } from "../../utils/timeInSeconds";
import { createRouter } from "./context";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { BIN_KEY_PREFIX } from "../../utils/constants";

const getUploadUrl = async (
  binId: string,
  name: string,
  encrypted?: Boolean
) => {
  const key = filenamify(name, { replacement: "_" });
  try {
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: process.env.S3_BUCKET || "",
      Key: `${BIN_KEY_PREFIX}/${binId}/${key}`,
      Conditions: [["content-length-range", 0, 1048576]],
    });

    return url;
  } catch (e) {
    console.error(e);

    return null;
  }
};

const getUploadUrls = async (binId: string, files: { name: string }[]) => {
  return await Promise.all(files.map((f) => getUploadUrl(binId, f.name)));
};

export const binRouter = createRouter().mutation("requestUpload", {
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

    const urls = await getUploadUrls(bin.id, input.files);

    return { urls, binId: bin.id };
  },
});
