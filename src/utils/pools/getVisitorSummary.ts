import { PrismaClient } from "@prisma/client";

export default async function (prisma: PrismaClient, uploadId: string) {
  //   const anonymous = await prisma.anonymousVisitor.count({
  //     where: {
  //       uploadId: uploadId,
  //     },
  //     select: {
  //       views: true,
  //     },
  //   });
  const anonymousVisitors = await prisma.anonymousVisitor.aggregate({
    where: {
      uploadId: uploadId,
    },
    _sum: { views: true },
    _count: true,
  });

  const visitorsAgg = await prisma.visitor.aggregate({
    where: {
      uploadId: uploadId,
    },
    _sum: { views: true },
    _count: true,
  });

  const visitors = await prisma.visitor.findMany({
    where: {
      uploadId: uploadId,
    },
    include: {
      user: {
        select: {
          image: true,
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    anonymous: {
      views: anonymousVisitors._sum.views || 0,
      users: anonymousVisitors._count,
    },
    registered: {
      views: visitorsAgg._sum.views || 0,
      count: visitorsAgg._count,
      users: visitors,
    },
  };
}
