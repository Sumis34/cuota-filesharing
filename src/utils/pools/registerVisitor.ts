import { PrismaClient } from "@prisma/client";

interface OptionBasics {
  uploadId: string;
  fingerprint?: string;
  userId?: string;
}

// interface OptionsAnonymous extends OptionBasics {
//   fingerprint: string;
//   userId?: never;
// }

// interface OptionsWithUser extends OptionBasics {
//   userId: string;
//   fingerprint?: never;
// }

// type Options = OptionsAnonymous | OptionsWithUser;

export default async function registerVisitor(
  prisma: PrismaClient,
  options: OptionBasics
) {
  const { userId, fingerprint, uploadId } = options;

  if (userId) {
    const visitor = await prisma.visitor.upsert({
      where: {
        userId_uploadId: {
          uploadId: uploadId,
          userId: userId,
        },
      },
      create: {
        upload: {
          connect: {
            id: uploadId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {
        views: {
          increment: 1,
        },
      },
    });
    return visitor;
  }

  if (fingerprint)
    return await prisma.anonymousVisitor.upsert({
      where: {
        id_uploadId: {
          id: fingerprint,
          uploadId: uploadId,
        },
      },
      create: {
        id: fingerprint,
        upload: {
          connect: {
            id: uploadId,
          },
        },
      },
      update: {
        views: {
          increment: 1,
        },
      },
    });

  return null;
}
