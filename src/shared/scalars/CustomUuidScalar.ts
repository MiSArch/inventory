import { GraphQLScalarType, Kind } from 'graphql';

/**
 * Regular expression pattern for validating UUID format.
 */
const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates a UUID.
 * @param uuid - The UUID to validate.
 * @returns The validated UUID.
 * @throws Error if the UUID is invalid.
 */
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
