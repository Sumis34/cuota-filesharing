import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import deletePool from "../../../utils/s3/deletePool";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

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

    // Safe amount of deleted items to DB for logging purposes
    if (expiredPools.length > 0)
      await prisma.deletedPools.create({
        data: {
          amount: expiredPools.length,
          fileCount: deletedItems.length,
        },
      });

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
