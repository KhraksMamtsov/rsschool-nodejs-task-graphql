import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap.js';
import { GraphQLFieldConfig } from 'graphql/type/definition.js';
import { Context } from '../Context.js';

export type MemberTypeId = 'basic' | 'business';

export const MemberTypeFields = {
  id: {
    type: new GraphQLNonNull(
      new GraphQLEnumType({
        name: 'MemberTypeId',
        values: {
          basic: { value: 'basic' },
          business: { value: 'business' },
        },
      }),
    ),
  },
  discount: { type: new GraphQLNonNull(GraphQLFloat) },
  postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
};

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: MemberTypeFields.id,
    discount: MemberTypeFields.discount,
    postsLimitPerMonth: MemberTypeFields.postsLimitPerMonth,
  }),
});

export const MemberTypes = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(MemberType)),
);

export const queries: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
  memberTypes: {
    type: MemberTypes,
    resolve: (_source, _args, { prisma }) => prisma.memberType.findMany(),
  },
  memberType: {
    type: MemberType,
    args: { id: MemberTypeFields.id },
    resolve: (_source, args: { id: MemberTypeId }, { prisma }) =>
      prisma.memberType.findUnique({
        where: {
          id: args.id,
        },
      }),
  },
});
