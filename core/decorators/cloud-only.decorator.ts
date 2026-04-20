export function CloudOnly<T extends { new (...args: any[]): object }>(constructor: T) {
  (constructor as any).__cloudOnly = true;
  return constructor;
}

export function isCloudOnly(constructor: { new (...args: any[]): object }): boolean {
  return Boolean((constructor as any).__cloudOnly);
}
