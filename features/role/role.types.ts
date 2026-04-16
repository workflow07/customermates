import type { Resource, Action } from "@/generated/prisma";

export type UserRoleDto = {
  id: string;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions: {
    id: string;
    resource: Resource;
    action: Action;
  }[];
};
