export function getConstructorName({
  value,
  isConstructor
}: {
  value: any;
  isConstructor: boolean;
}): string | undefined {
  if (!isConstructor) {
    return getConstructorName({
      value: value?.constructor,
      isConstructor: true,
    })
  }
  if (typeof value?.name === 'string' && value.name.length) {
    return value.name;
  }
  return undefined
}
