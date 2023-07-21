import { GraphQLNonNull } from 'graphql/index.js';
import { GraphQLNullableType } from 'graphql/type/definition.js';

export const nullable = <
  T extends { type: GraphQLNonNull<X> },
  X extends GraphQLNullableType,
>(
  x: T,
): T & { type: X } => ({
  ...x,
  type: x.type.ofType,
});
