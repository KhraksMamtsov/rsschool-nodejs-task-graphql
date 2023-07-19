import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';

export type MemberTypeId = 'basic' | 'business';
export const MemberTypeId = new GraphQLNonNull(
  new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      basic: { value: 'basic' },
      business: { value: 'business' },
    },
  }),
);

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const MemberTypes = new GraphQLNonNull(
  new GraphQLList(new GraphQLNonNull(MemberType)),
);
