import { z } from "zod";

import { encodeToToon } from "./utils";

import { di } from "@/core/dependency-injection/container";
import { CreateManyOrganizationsInteractor } from "@/features/organizations/upsert/create-many-organizations.interactor";
import { UpdateManyOrganizationsInteractor } from "@/features/organizations/upsert/update-many-organizations.interactor";
import { BaseCreateOrganizationSchema } from "@/features/organizations/upsert/create-organization-base.schema";

const McpCreateManyOrganizationsSchema = z.object({
  organizations: z.array(BaseCreateOrganizationSchema).min(1).max(10),
});

const UpdateOrganizationsNameSchema = z.object({
  organizations: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeOrganizationsContactsSchema = z.object({
  organizations: z
    .array(
      z.object({
        id: z.uuid(),
        contactIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeOrganizationsUsersSchema = z.object({
  organizations: z
    .array(
      z.object({
        id: z.uuid(),
        userIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeOrganizationsDealsSchema = z.object({
  organizations: z
    .array(
      z.object({
        id: z.uuid(),
        dealIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

export const batchCreateOrganizationsTool = {
  name: "batch_create_organizations",
  description: "Create organizations. Run get_entity_configuration first. Required: name. Returns IDs.",
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  inputSchema: McpCreateManyOrganizationsSchema,
  execute: async (params: z.infer<typeof McpCreateManyOrganizationsSchema>) => {
    const result = await di.get(CreateManyOrganizationsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return encodeToToon(result.data.map((item) => item.id));
  },
};

export const batchUpdateOrganizationNameTool = {
  name: "batch_update_organization_name",
  description: "Update organization name. Only updates provided fields.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: UpdateOrganizationsNameSchema,
  execute: async (params: z.infer<typeof UpdateOrganizationsNameSchema>) => {
    const result = await di.get(UpdateManyOrganizationsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} organization(s)`;
  },
};

export const batchSetOrganizationContactsTool = {
  name: "batch_set_organization_contacts",
  description: "Set (replace) all contacts linked to an organization. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeOrganizationsContactsSchema,
  execute: async (params: z.infer<typeof ChangeOrganizationsContactsSchema>) => {
    const result = await di.get(UpdateManyOrganizationsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} organization(s)`;
  },
};

export const batchSetOrganizationUsersTool = {
  name: "batch_set_organization_users",
  description: "Set (replace) all users assigned to an organization. Pass empty array to unassign all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeOrganizationsUsersSchema,
  execute: async (params: z.infer<typeof ChangeOrganizationsUsersSchema>) => {
    const result = await di.get(UpdateManyOrganizationsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} organization(s)`;
  },
};

export const batchSetOrganizationDealsTool = {
  name: "batch_set_organization_deals",
  description: "Set (replace) all deals linked to an organization. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeOrganizationsDealsSchema,
  execute: async (params: z.infer<typeof ChangeOrganizationsDealsSchema>) => {
    const result = await di.get(UpdateManyOrganizationsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} organization(s)`;
  },
};
