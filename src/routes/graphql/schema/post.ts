import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ObjMap } from 'graphql/jsutils/ObjMap.js';
import { GraphQLFieldConfig } from 'graphql/type/definition.js';
import { PrismaClient } from '@prisma/client';
import { GraphQLInputObjectType } from 'graphql/index.js';
import { UserFields } from './user.js';
import { MemberTypeFields } from './memberType.js';
import { Profile, ProfileFields } from './profile.js';

export const PostFields = {
  id: { type: new GraphQLNonNull(UUIDType) },
  title: { type: new GraphQLNonNull(GraphQLString) },
  content: { type: new GraphQLNonNull(GraphQLString) },
};

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: PostFields.id,
    title: PostFields.title,
    content: PostFields.content,
  }),
});

export const Posts = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post)));

export const queries: () => ObjMap<
  GraphQLFieldConfig<void, { prisma: PrismaClient }>
> = () => ({
  posts: {
    type: Posts,
    resolve: (_source, _args, { prisma }) => prisma.post.findMany(),
  },
  post: {
    type: Post,
    args: { id: PostFields.id },
    resolve: (_source, args: { id: string }, { prisma }) =>
      prisma.post.findUnique({
        where: {
          id: args.id,
        },
      }),
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: UserFields.id,
    content: PostFields.content,
    title: PostFields.title,
  }),
});

export interface CreatePostInput {
  readonly authorId: string;
  readonly content: string;
  readonly title: string;
}

export const mutations: () => ObjMap<
  GraphQLFieldConfig<void, { prisma: PrismaClient }>
> = () => ({
  createPost: {
    type: Post,
    args: { dto: { type: CreatePostInput } },
    resolve: (_source, args: { dto: CreatePostInput }, { prisma }) =>
      prisma.post.create({
        data: args.dto,
      }),
  },
});
