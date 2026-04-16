import { runWithTenant, tenantStorage } from "@/core/decorators/tenant-context";

export function TenantScoped<T extends { new (...args: any[]): object }>(constructor: T) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype).filter(
    (name) => name !== "constructor" && typeof constructor.prototype[name] === "function",
  );

  for (const name of methodNames) {
    const original = constructor.prototype[name] as ((...args: any[]) => any) | undefined;

    if (!original) continue;

    constructor.prototype[name] = function (this: any, ...args: any[]) {
      return (async () => {
        if (tenantStorage.getStore()) return original.apply(this, args);

        const { getUserService } = await import("@/core/di");
        const user = await getUserService().getActiveUserOrThrow();

        return runWithTenant(user, () => original.apply(this, args));
      })();
    };
  }

  return constructor;
}
