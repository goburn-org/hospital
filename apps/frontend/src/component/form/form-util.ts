// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNestedValue<T extends object>(obj: T, path: string) {
  const keys = path.split('.');
  return keys.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc, key) => (acc as any) && (acc as any)[key],
    obj,
  ) as T[keyof T];
}
