import { PrismaClient } from '@prisma/client';
import type * as DL from './data-loader/dataloaders.js';

export interface Context {
  prisma: PrismaClient;
  loaders: DataLoaders;
}

export interface DataLoaders {
  userLoader: ReturnType<typeof DL.userLoader>;
}
