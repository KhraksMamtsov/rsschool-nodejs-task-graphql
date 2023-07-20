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
      ...Profile.mutations(),
      ...Post.mutations(),
    }),
  }),
  query: new GraphQLObjectType<void, { prisma: PrismaClient }>({
    name: 'RootQueryType',
    fields: () => ({
      ...User.queries(),
      ...MT.queries(),
      ...Post.queries(),
      ...Profile.queries(),
    }),
  }),
});
