import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const UserId = new GraphQLNonNull(UUIDType);
export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UserId },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const Users = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User)));
