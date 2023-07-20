import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberType } from './memberType.js';
import { PrismaClient } from '@prisma/client';

export const ProfileId = new GraphQLNonNull(UUIDType);
export const Profile = new GraphQLObjectType<
  { id: string; memberTypeId: string },
  { prisma: PrismaClient }
>({
  name: 'Profile',
  fields: () => ({
    id: { type: ProfileId },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: MemberType,
      resolve: (source, _, { prisma }) =>
        prisma.memberType.findUnique({
          where: {
            id: source.memberTypeId,
          },
        }),
    },
    // userId: { type: UserId },
  }),
});

export const Profiles = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile)));
