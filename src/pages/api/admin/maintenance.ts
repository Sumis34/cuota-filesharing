import { DeleteObjectsCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { s3 } from "../../../utils/s3/s3";
import { authOptions } from "../auth/[...nextauth]";

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

/**
 * Deletes all expired uploads from the database and s3.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const {
    query: { key },
  } = req;
  let deletedItems: string[] = [];

  const updateDeletedItems = (items: string[]) => deletedItems.push(...items);

  if (!(session?.user?.role === "admin" || process.env.SERVICE_KEY === key))
    return res.status(401).json("unauthorized");

  const expiredPools = await prisma.upload.findMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  try {
    for (const pool of expiredPools) {
      await deletePool(pool.id, updateDeletedItems);
    }
    res.status(200).json({
      success: true,
      message:
        expiredPools.length === 0
          ? "not expired pools present"
          : "pool and its corresponding data base entry deleted",
      deletedItems: deletedItems,
      expiredPools: expiredPools.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
      message:
        "could not delete pool data (common reason is that the pool is empty)",
      deletedItems,
      expiredPools: expiredPools.length,
    });
  }
}
