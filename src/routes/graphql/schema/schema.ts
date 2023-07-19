import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql/index.js';
import { MemberType, MemberTypes, MemberTypeId } from './memberType.js';
import { PrismaClient } from '@prisma/client';
import { GraphQLNonNull } from 'graphql';
import { Profile, ProfileId, Profiles } from './profile.js';
import { User, UserId, Users } from './user.js';
import { Post, PostId, Posts } from './post.js';

const dummyData = {
  '1': 'leebyron',
  '2': 'enaqx',
  '3': 'schrockn',
  '4': 'andimarek',
};

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType<string, { prisma: PrismaClient }>({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: MemberTypes,
        resolve: async (_source, _args, { prisma }) => {
          return prisma.memberType.findMany();
        },
      },
      memberType: {
        type: new GraphQLNonNull(MemberType),
        args: { id: { type: MemberTypeId } },
        resolve: async (_source, args: { id: MemberTypeId }, { prisma }) => {
          const memberType = await prisma.memberType.findUnique({
            where: {
              id: args.id,
            },
          });
          if (memberType === null) {
            throw 'httpErrors.notFound()';
          }
          return memberType;
        },
      },
      profiles: {
        type: Profiles,
        resolve: async (_source, _args, { prisma }) => {
          return prisma.profile.findMany();
        },
      },
      profile: {
        type: new GraphQLNonNull(Profile),
        args: { id: { type: ProfileId } },
        resolve: async (_source, args: { id: string }, { prisma }) => {
          const profile = await prisma.profile.findUnique({
            where: {
              id: args.id,
            },
          });
          if (profile === null) {
            throw 'httpErrors.notFound()';
          }
          return profile;
        },
      },
      users: {
        type: Users,
        resolve: async (_source, _args, { prisma }) => {
          return prisma.user.findMany();
        },
      },
      user: {
        type: new GraphQLNonNull(User),
        args: { id: { type: UserId } },
        resolve: async (_source, args: { id: string }, { prisma }) => {
          const user = await prisma.user.findUnique({
            where: {
              id: args.id,
            },
          });
          if (user === null) {
            throw 'httpErrors.notFound()';
          }
          return user;
        },
      },
      posts: {
        type: Posts,
        resolve: async (_source, _args, { prisma }) => {
          return prisma.post.findMany();
        },
      },
      post: {
        type: new GraphQLNonNull(Post),
        args: { id: { type: PostId } },
        resolve: async (_source, args: { id: string }, { prisma }) => {
          const post = await prisma.post.findUnique({
            where: {
              id: args.id,
            },
          });
          if (post === null) {
            throw 'httpErrors.notFound()';
          }
          return post;
        },
      },
    },
  }),
});
