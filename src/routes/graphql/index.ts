import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { schema } from './schema/schema.js';
import depthLimit from 'graphql-depth-limit';
import { Context } from './Context.js';
import * as DL from './data-loader/dataloaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    handler: async (req) => {
      const validation = validate(
        //
        schema,
        parse(req.body.query),
        [depthLimit(5)],
      );

      if (validation.length) {
        return {
          errors: validation,
        };
      } else {
        const { data, errors } = await graphql({
          schema: schema,
          source: req.body.query,
          variableValues: req.body.variables,
          contextValue: {
            prisma,
            loader: {
              subscribersByUserId: DL.subscribersByUserId({ prisma }),
              subscriptionsByUserId: DL.subscriptionsByUserId({ prisma }),
              memberTypeById: DL.memberTypeById({ prisma }),
              profileByUserId: DL.profileByUserId({ prisma }),
              postsByAuthorId: DL.postsByAuthorId({ prisma }),
            },
          } satisfies Context,
        });
        return { data, errors };
      }
    },
  });
};

export default plugin;
