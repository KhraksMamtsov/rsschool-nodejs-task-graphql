import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from './memberType.js';
import { UserId } from './user.js';

export const ProfileId = new GraphQLNonNull(UUIDType);
export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: ProfileId },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: MemberTypeId },
    userId: { type: UserId },
  }),
});

export const Profiles = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile)));
