import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from '../schema/memberType.js';

export const userById = (deps: { prisma: PrismaClient }) =>
  new DataLoader<string, User | null>(async (userIds) => {
    const users = await deps.prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });

    return userIds.map((userId) => users.find((x) => x.id === userId) ?? null);
  });

export const subscriptionsByUserId = (deps: { prisma: PrismaClient }) =>
  new DataLoader<string, Array<User>>(async (userIds) => {
    const subscriptions = await deps.prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: {
              in: [...userIds],
            },
          },
        },
      },
      include: {
        subscribedToUser: true,
      },
    });

    return userIds.map((userId) =>
      subscriptions.filter((su) =>
        su.subscribedToUser.some((x) => x.subscriberId === userId),
      ),
    );
  });

export const subscribersByUserId = (deps: { prisma: PrismaClient }) =>
  new DataLoader<string, Array<User>>(async (userIds) => {
    const subscribers = await deps.prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: { in: [...userIds] },
          },
        },
      },
      include: {
        userSubscribedTo: true,
      },
    });

    return userIds.map((userId) =>
      subscribers.filter((su) => su.userSubscribedTo.some((x) => x.authorId === userId)),
    );
  });

export const profileByUserId = (deps: { prisma: PrismaClient }) =>
  new DataLoader<string, Profile | null>(async (userIds) => {
    const profiles = await deps.prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
    });

    return userIds.map((userId) => profiles.find((p) => p.userId === userId) ?? null);
  });

export const memberTypeById = (deps: { prisma: PrismaClient }) =>
  new DataLoader<MemberTypeId, MemberType | null>(async (memberTypeIds) => {
    const memberTypes = await deps.prisma.memberType.findMany({
      where: { id: { in: [...memberTypeIds] } },
    });

    return memberTypeIds.map(
      (memberTypeId) => memberTypes.find((mt) => mt.id === memberTypeId) ?? null,
    );
  });

export const postsByAuthorId = (deps: { prisma: PrismaClient }) =>
  new DataLoader<string, Array<Post>>(async (authorIds) => {
    const posts = await deps.prisma.post.findMany({
      where: {
        authorId: { in: [...authorIds] },
      },
    });

    return authorIds.map((authorId) => posts.filter((p) => p.authorId === authorId));
  });
