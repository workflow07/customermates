import { runWithTenant } from "@/core/decorators/tenant-context";
import { createMockUser } from "./mock-user";
import type { ExtendedUser } from "@/features/user/user.types";

export async function withTenant<T>(
  fn: () => T | Promise<T>,
  user?: ExtendedUser,
): Promise<T> {
  return runWithTenant(user ?? createMockUser(), fn);
}
