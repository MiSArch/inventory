import { GraphQLResolveInfo, FieldNode } from "graphql";

/**
 * Retrieves the names of the selections from the provided GraphQL info object.
 * @param info - The GraphQL info object.
 * @returns An array of selection names.
 */
export function queryKeys(info: GraphQLResolveInfo): string[] {
  if (!info.fieldNodes || !info.fieldNodes[0].selectionSet) {
    return [];
  }
  return info.fieldNodes[0].selectionSet.selections
    .filter((item) => item.kind === "Field")
    .map((item: FieldNode) => item.name.value);
}
