import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from './profile.js';
import { PrismaClient } from '@prisma/client';
import { Posts } from './post.js';

export const User = new GraphQLObjectType<
  {
    id: string;
  },
  { prisma: PrismaClient }
>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: (source, _, { prisma }) =>
        prisma.profile.findUnique({
          where: {
            userId: source.id,
          },
        }),
    },
    posts: {
      type: Posts,
      resolve: (source, _, { prisma }) =>
        prisma.post.findMany({
          where: {
            authorId: source.id,
          },
        }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (source, _, { prisma }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: source.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (source, _, { prisma }) =>
        prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: source.id,
              },
            },
          },
        }),
    },
  }),
});
