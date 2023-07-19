import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql/index.js';
import { MemberType, MemberTypes, MemberTypeId } from './memberType.js';
import { PrismaClient } from '@prisma/client';
import { GraphQLNonNull } from 'graphql';

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
      contributor: {
        type: GraphQLString,
        args: {
          id: { type: GraphQLString },
        },
        //Using Destructuring of ES2015 to assign value to id
        resolve: (source, args: { id: string }, context) => {
          console.log(source, args, context);
          return dummyData[args.id] as string;
        },
      },
    },
  }),
});
