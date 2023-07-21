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
import { Posts } from './post.js';
import { GraphQLFieldConfig } from 'graphql/type/definition.js';
import { ObjMap } from 'graphql/jsutils/ObjMap.js';
import { Context } from '../Context.js';
import { nullable } from '../types/nullable.js';

export const UserFields = {
  id: { type: new GraphQLNonNull(UUIDType) },
  name: { type: new GraphQLNonNull(GraphQLString) },
  balance: { type: new GraphQLNonNull(GraphQLFloat) },
};

export const User = new GraphQLObjectType<
  {
    id: string;
  },
  Context
>({
  name: 'User',
  fields: () => ({
    id: UserFields.id,
    name: UserFields.name,
    balance: UserFields.balance,
    profile: {
      type: Profile,
      resolve: (source, _, { loader }) => loader.profileByUserId.load(source.id),
    },
    posts: {
      type: Posts,
      resolve: (source, _, { loader }) => loader.postsByAuthorId.load(source.id),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (source, _, { loader }) => loader.subscriptionsByUserId.load(source.id),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: (source, _, { loader }) => loader.subscribersByUserId.load(source.id),
    },
  }),
});

export const queries: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
    resolve: (_source, _args, { prisma }) => prisma.user.findMany(),
  },
  user: {
    type: User,
    args: { id: UserFields.id },
    resolve: (_source, args: { id: string }, { prisma }) =>
      prisma.user.findUnique({
        where: {
          id: args.id,
        },
      }),
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

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: nullable(UserFields.name),
    balance: nullable(UserFields.balance),
  }),
});
export interface ChangeUserInput {
  readonly name?: string;
  readonly balance?: number;
}

export const mutations: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
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
  changeUser: {
    type: User,
    args: { id: UserFields.id, dto: { type: ChangeUserInput } },
    resolve: (_source, args: { id: string; dto: ChangeUserInput }, { prisma }) =>
      prisma.user.update({
        where: {
          id: args.id,
        },
        data: args.dto,
      }),
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: { id: UserFields.id },
    resolve: (_source, args: { id: string }, { prisma }) =>
      prisma.user
        .delete({
          where: {
            id: args.id,
          },
        })
        .then(
          () => true,
          () => false,
        ),
  },
  subscribeTo: {
    type: User,
    args: { userId: UserFields.id, authorId: UserFields.id },
    resolve: (_source, args: { userId: string; authorId: string }, { prisma }) => {
      return prisma.user.update({
        where: {
          id: args.userId,
        },
        data: {
          userSubscribedTo: {
            create: {
              authorId: args.authorId,
            },
          },
        },
      });
    },
  },
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: { userId: UserFields.id, authorId: UserFields.id },
    resolve: (_source, args: { userId: string; authorId: string }, { prisma }) => {
      return prisma.subscribersOnAuthors
        .delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        })
        .then(
          () => true,
          () => false,
        );
    },
  },
});
