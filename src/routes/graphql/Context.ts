import { PrismaClient } from '@prisma/client';
import type * as DL from './data-loader/dataloaders.js';

export interface Context {
  prisma: PrismaClient;
  loader: DataLoaders;
}

export interface DataLoaders {
  userById: ReturnType<typeof DL.userById>;
  profileByUserId: ReturnType<typeof DL.profileByUserId>;
  postsByAuthorId: ReturnType<typeof DL.postsByAuthorId>;
  memberTypeById: ReturnType<typeof DL.memberTypeById>;
  subscriptionsByUserId: ReturnType<typeof DL.subscriptionsByUserId>;
  subscribersByUserId: ReturnType<typeof DL.subscribersByUserId>;
}
