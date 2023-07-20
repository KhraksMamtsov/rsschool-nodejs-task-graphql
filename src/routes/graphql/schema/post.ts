import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';

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
