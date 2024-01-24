export function queryKeys(info:any) {
  return info.fieldNodes[0].selectionSet.selections.map(item => item.name.value)
}