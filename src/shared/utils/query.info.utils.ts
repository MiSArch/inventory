/**
 * Retrieves the names of the selections from the provided GraphQL info object.
 * @param info - The GraphQL info object.
 * @returns An array of selection names.
 */
export function queryKeys(info:any) {
  return info.fieldNodes[0].selectionSet.selections.map(item => item.name.value)
}