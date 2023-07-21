import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const userLoader = (deps: { prisma: PrismaClient }) =>
  new DataLoader<string, User>((userIds) =>
    deps.prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    }),
  );
