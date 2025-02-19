import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ObjMap } from 'graphql/jsutils/ObjMap.js';
import { GraphQLFieldConfig } from 'graphql/type/definition.js';
import { GraphQLBoolean, GraphQLInputObjectType } from 'graphql/index.js';
import { User, UserFields } from './user.js';
import { Context } from '../Context.js';
import { nullable } from '../types/nullable.js';

export const PostFields = {
  id: { type: new GraphQLNonNull(UUIDType) },
  title: { type: new GraphQLNonNull(GraphQLString) },
  content: { type: new GraphQLNonNull(GraphQLString) },
};

export const Post = new GraphQLObjectType<{ authorId: string }, Context>({
  name: 'Post',
  fields: () => ({
    id: PostFields.id,
    title: PostFields.title,
    content: PostFields.content,
    author: {
      type: User,
      resolve: (source: { authorId: string }, _, { loader }) =>
        loader.userById.load(source.authorId),
    },
  }),
});

export const Posts = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post)));

export const queries: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
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

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    authorId: nullable(UserFields.id),
    content: nullable(PostFields.content),
    title: nullable(PostFields.title),
  }),
});
export interface ChangePostInput {
  readonly authorId?: string;
  readonly content?: string;
  readonly title?: string;
}

export const mutations: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
  createPost: {
    type: Post,
    args: { dto: { type: CreatePostInput } },
    resolve: (_source, args: { dto: CreatePostInput }, { prisma }) =>
      prisma.post.create({
        data: args.dto,
      }),
  },
  changePost: {
    type: Post,
    args: { id: PostFields.id, dto: { type: ChangePostInput } },
    resolve: (_source, args: { id: string; dto: ChangePostInput }, { prisma }) =>
      prisma.post.update({
        where: {
          id: args.id,
        },
        data: args.dto,
      }),
  },
  deletePost: {
    type: GraphQLBoolean,
    args: { id: PostFields.id },
    resolve: (_source, args: { id: string }, { prisma }) =>
      prisma.post
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
});
