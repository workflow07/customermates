import type { ExtendedUser } from "@/features/user/user.types";
import type { Resource, Action } from "@/generated/prisma";

export function createMockUser(overrides: Partial<ExtendedUser> = {}): ExtendedUser {
  return {
    id: "test-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    companyId: "test-company-id",
    status: "active" as any,
    displayLanguage: "en" as any,
    formattingLocale: "en" as any,
    roleId: "test-role-id",
    role: {
      id: "test-role-id",
      name: "Admin",
      isSystemRole: true,
      companyId: "test-company-id",
      permissions: [],
    },
    ...overrides,
  } as ExtendedUser;
}

export function createMockUserWithPermissions(
  permissions: Array<{ resource: Resource; action: Action }>,
): ExtendedUser {
  return createMockUser({
    role: {
      id: "test-role-id",
      name: "Custom",
      isSystemRole: false,
      companyId: "test-company-id",
      permissions: permissions.map((p) => ({
        id: "perm-id",
        roleId: "test-role-id",
        ...p,
      })),
    } as any,
  });
}
