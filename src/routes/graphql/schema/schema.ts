import { GraphQLObjectType, GraphQLSchema } from 'graphql/index.js';
import * as MT from './memberType.js';
import { PrismaClient } from '@prisma/client';
import * as Profile from './profile.js';
import * as User from './user.js';
import * as Post from './post.js';

export const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: () => ({
      ...User.mutations(),
    }),
  }),
  query: new GraphQLObjectType<string, { prisma: PrismaClient }>({
    name: 'RootQueryType',
    fields: () => ({
      ...User.queries(),
      ...MT.queries(),
      profiles: {
        type: Profile.Profiles,
        resolve: (_source, _args, { prisma }) => prisma.profile.findMany(),
      },
      profile: {
        type: Profile.Profile,
        args: { id: Profile.ProfileFields.id },
        resolve: (_source, args: { id: string }, { prisma }) =>
          prisma.profile.findUnique({
            where: {
              id: args.id,
            },
          }),
      },
      posts: {
        type: Post.Posts,
        resolve: async (_source, _args, { prisma }) => {
          return prisma.post.findMany();
        },
      },
      post: {
        type: Post.Post,
        args: { id: Post.PostFields.id },
        resolve: (_source, args: { id: string }, { prisma }) =>
          prisma.post.findUnique({
            where: {
              id: args.id,
            },
          }),
      },
    }),
  }),
});
