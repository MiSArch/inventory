import { GraphQLScalarType, Kind } from 'graphql';

const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validate(uuid: unknown): string | never {
  if (typeof uuid !== 'string' || !regex.test(uuid)) {
    throw new Error('invalid uuid');
  }
  return uuid;
}

export const UUID = new GraphQLScalarType({
  name: 'UUID',
  description: 'A universally unique identifier compliant UUID Scalar',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return validate(ast.value);
    }
    throw new Error('UUID must be a string.');
  },
});
