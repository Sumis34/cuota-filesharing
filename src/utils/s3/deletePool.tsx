import { DeleteObjectsCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { s3 } from "./s3";

const prisma = new PrismaClient();

const deletePoolData = async (poolId: string) => {
  const command = new ListObjectsCommand({
    Bucket: process.env.S3_BUCKET,
    Prefix: poolId,
  });

  const { Contents } = await s3.send(command);

  const deleteCommand = new DeleteObjectsCommand({
    Bucket: process.env.S3_BUCKET,
    Delete: {
      Objects: Contents?.map((content) => ({ Key: content.Key })),
    },
  });

  const deleted = await s3.send(deleteCommand);

  return deleted;
};

const deletePool = async (
  poolId: string,
  onDelete: (items: string[]) => void
) => {
  try {
    const { Deleted } = await deletePoolData(poolId);

    const deletedKeys = Deleted?.map((item) => item.Key) || [];

    const validDeletedKeys: string[] = deletedKeys.filter(
      (key) => typeof key === "string"
    ) as string[];

    onDelete(validDeletedKeys);
  } catch (error) {
    throw error;
  }

  await prisma.upload.delete({
    where: {
      id: poolId,
    },
  });

  return true;
};

export default deletePool;
