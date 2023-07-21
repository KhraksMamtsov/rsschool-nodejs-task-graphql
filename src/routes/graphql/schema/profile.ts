import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberType, MemberTypeFields } from './memberType.js';
import { ObjMap } from 'graphql/jsutils/ObjMap.js';
import { GraphQLFieldConfig } from 'graphql/type/definition.js';
import { GraphQLInputObjectType } from 'graphql/index.js';
import { UserFields } from './user.js';
import { Context } from '../Context.js';
import { nullable } from '../types/nullable.js';

export const ProfileFields = {
  id: { type: new GraphQLNonNull(UUIDType) },
  isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
  yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
};

export const Profile = new GraphQLObjectType<
  { id: string; memberTypeId: string },
  Context
>({
  name: 'Profile',
  fields: () => ({
    id: ProfileFields.id,
    isMale: ProfileFields.isMale,
    yearOfBirth: ProfileFields.yearOfBirth,
    memberType: {
      type: MemberType,
      resolve: (source, _, { prisma }) =>
        prisma.memberType.findUnique({
          where: {
            id: source.memberTypeId,
          },
        }),
    },
  }),
});

export const Profiles = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile)));

export const queries: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
  profiles: {
    type: Profiles,
    resolve: (_source, _args, { prisma }) => prisma.profile.findMany(),
  },
  profile: {
    type: Profile,
    args: { id: ProfileFields.id },
    resolve: (_source, args: { id: string }, { prisma }) =>
      prisma.profile.findUnique({
        where: {
          id: args.id,
        },
      }),
  },
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: UserFields.id,
    memberTypeId: MemberTypeFields.id,
    isMale: ProfileFields.isMale,
    yearOfBirth: ProfileFields.yearOfBirth,
  }),
});
export interface CreateProfileInput {
  readonly userId: string;
  readonly memberTypeId: string;
  readonly isMale: boolean;
  readonly yearOfBirth: number;
}

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: nullable(MemberTypeFields.id),
    isMale: nullable(ProfileFields.isMale),
    yearOfBirth: nullable(ProfileFields.yearOfBirth),
  }),
});
export interface ChangeProfileInput {
  readonly userId?: string;
  readonly memberTypeId?: string;
  readonly isMale?: boolean;
  readonly yearOfBirth?: number;
}

export const mutations: () => ObjMap<GraphQLFieldConfig<void, Context>> = () => ({
  createProfile: {
    type: Profile,
    args: { dto: { type: CreateProfileInput } },
    resolve: (_source, args: { dto: CreateProfileInput }, { prisma }) =>
      prisma.profile.create({
        data: args.dto,
      }),
  },
  changeProfile: {
    type: Profile,
    args: { id: ProfileFields.id, dto: { type: ChangeProfileInput } },
    resolve: (_source, args: { id: string; dto: ChangeProfileInput }, { prisma }) => {
      return prisma.profile.update({
        where: {
          id: args.id,
        },
        data: args.dto,
      });
    },
  },
  deleteProfile: {
    type: GraphQLBoolean,
    args: { id: ProfileFields.id },
    resolve: (_source, args: { id: string }, { prisma }) =>
      prisma.profile
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
