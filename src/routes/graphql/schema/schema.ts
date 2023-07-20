import { GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql/index.js';
import { MemberType, MemberTypeId, MemberTypes } from './memberType.js';
import { PrismaClient } from '@prisma/client';
import { GraphQLNonNull } from 'graphql';
import { Profile, ProfileId, Profiles } from './profile.js';
import { User } from './user.js';
import { Post, PostId, Posts } from './post.js';
import { UUIDType } from '../types/uuid.js';

export const schema = new GraphQLSchema({
  // mutation: new GraphQLObjectType({
  //   name: 'qwe',
  //   fields: {},
  // }),
  query: new GraphQLObjectType<string, { prisma: PrismaClient }>({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: MemberTypes,
        resolve: (_source, _args, { prisma }) => prisma.memberType.findMany(),
      },
      memberType: {
        type: MemberType,
        args: { id: { type: MemberTypeId } },
        resolve: (_source, args: { id: MemberTypeId }, { prisma }) =>
          prisma.memberType.findUnique({
            where: {
              id: args.id,
            },
          }),
      },
      profiles: {
        type: Profiles,
        resolve: (_source, _args, { prisma }) => prisma.profile.findMany(),
      },
      profile: {
        type: Profile,
        args: { id: { type: ProfileId } },
        resolve: (_source, args: { id: string }, { prisma }) =>
          prisma.profile.findUnique({
            where: {
              id: args.id,
            },
          }),
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
        resolve: (_source, _args, { prisma }) => prisma.user.findMany(),
      },
      user: {
        type: User,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: (_source, args: { id: string }, { prisma }) => {
          return prisma.user.findUnique({
            where: {
              id: args.id,
            },
          });
        },
      },
      posts: {
        type: Posts,
        resolve: async (_source, _args, { prisma }) => {
          return prisma.post.findMany();
        },
      },
      post: {
        type: Post,
        args: { id: { type: PostId } },
        resolve: (_source, args: { id: string }, { prisma }) =>
          prisma.post.findUnique({
            where: {
              id: args.id,
            },
          }),
      },
    },
  }),
});
