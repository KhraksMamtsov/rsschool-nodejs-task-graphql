import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Profile } from './profile.js';
import { PrismaClient } from '@prisma/client';
import { Post, PostFields, Posts } from './post.js';
import { GraphQLFieldConfig } from 'graphql/type/definition.js';
import { ObjMap } from 'graphql/jsutils/ObjMap.js';

export const UserFields = {
  id: { type: new GraphQLNonNull(UUIDType) },
  name: { type: new GraphQLNonNull(GraphQLString) },
  balance: { type: new GraphQLNonNull(GraphQLFloat) },
};

export const User = new GraphQLObjectType<
  {
    id: string;
  },
  { prisma: PrismaClient }
>({
  name: 'User',
  fields: () => ({
    id: UserFields.id,
    name: UserFields.name,
    balance: UserFields.balance,
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

export const Users = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User)));

export const queries: () => ObjMap<
  GraphQLFieldConfig<void, { prisma: PrismaClient }>
> = () => ({
  users: {
    type: Users,
    resolve: (_source, _args, { prisma }) => prisma.user.findMany(),
  },
  user: {
    type: User,
    args: { id: UserFields.id },
    resolve: (_source, args: { id: string }, { prisma }) => {
      return prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: UserFields.name,
    balance: UserFields.balance,
  }),
});
export interface CreateUserInput {
  readonly name: string;
  readonly balance: number;
}

export const mutations: () => ObjMap<
  GraphQLFieldConfig<void, { prisma: PrismaClient }>
> = () => ({
  createUser: {
    type: User,
    args: { dto: { type: CreateUserInput } },
    resolve: (
      _source,
      args: {
        dto: CreateUserInput;
      },
      { prisma },
    ) =>
      prisma.user.create({
        data: args.dto,
      }),
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: { id: UserFields.id },
    resolve: async (_source, args: { id: string }, { prisma }) => {
      await prisma.user.delete({
        where: {
          id: args.id,
        },
      });
      return true;
    },
  },
});
