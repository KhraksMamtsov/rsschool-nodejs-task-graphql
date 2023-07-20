import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const PostId = new GraphQLNonNull(UUIDType);
export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: PostId },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const Posts = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post)));
