import { z } from "zod";

import { encodeToToon } from "./utils";

import { di } from "@/core/dependency-injection/container";
import { CreateManyDealsInteractor } from "@/features/deals/upsert/create-many-deals.interactor";
import { UpdateManyDealsInteractor } from "@/features/deals/upsert/update-many-deals.interactor";
import { BaseCreateDealSchema } from "@/features/deals/upsert/create-deal-base.schema";

const McpCreateManyDealsSchema = z.object({
  deals: z.array(BaseCreateDealSchema).min(1).max(10),
});

const UpdateDealsNameSchema = z.object({
  deals: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeDealsOrganizationsSchema = z.object({
  deals: z
    .array(
      z.object({
        id: z.uuid(),
        organizationIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeDealsUsersSchema = z.object({
  deals: z
    .array(
      z.object({
        id: z.uuid(),
        userIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeDealsContactsSchema = z.object({
  deals: z
    .array(
      z.object({
        id: z.uuid(),
        contactIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeDealsServicesSchema = z.object({
  deals: z
    .array(
      z.object({
        id: z.uuid(),
        services: z.array(
          z.object({
            serviceId: z.uuid(),
            quantity: z.number().min(0).default(1),
          }),
        ),
      }),
    )
    .min(1)
    .max(10),
});

export const batchCreateDealsTool = {
  name: "batch_create_deals",
  description: "Create deals. Run get_entity_configuration first. Required: name. Returns IDs.",
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  inputSchema: McpCreateManyDealsSchema,
  execute: async (params: z.infer<typeof McpCreateManyDealsSchema>) => {
    const result = await di.get(CreateManyDealsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return encodeToToon(result.data.map((item) => item.id));
  },
};

export const batchUpdateDealNameTool = {
  name: "batch_update_deal_name",
  description: "Update deal name. Only updates provided fields.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: UpdateDealsNameSchema,
  execute: async (params: z.infer<typeof UpdateDealsNameSchema>) => {
    const result = await di.get(UpdateManyDealsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} deal(s)`;
  },
};

export const batchSetDealOrganizationsTool = {
  name: "batch_set_deal_organizations",
  description: "Set (replace) all organizations linked to a deal. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeDealsOrganizationsSchema,
  execute: async (params: z.infer<typeof ChangeDealsOrganizationsSchema>) => {
    const result = await di.get(UpdateManyDealsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} deal(s)`;
  },
};

export const batchSetDealUsersTool = {
  name: "batch_set_deal_users",
  description: "Set (replace) all users assigned to a deal. Pass empty array to unassign all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeDealsUsersSchema,
  execute: async (params: z.infer<typeof ChangeDealsUsersSchema>) => {
    const result = await di.get(UpdateManyDealsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} deal(s)`;
  },
};

export const batchSetDealContactsTool = {
  name: "batch_set_deal_contacts",
  description: "Set (replace) all contacts linked to a deal. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeDealsContactsSchema,
  execute: async (params: z.infer<typeof ChangeDealsContactsSchema>) => {
    const result = await di.get(UpdateManyDealsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} deal(s)`;
  },
};

export const batchSetDealServicesTool = {
  name: "batch_set_deal_services",
  description: "Set (replace) all services linked to a deal with quantities. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeDealsServicesSchema,
  execute: async (params: z.infer<typeof ChangeDealsServicesSchema>) => {
    const result = await di.get(UpdateManyDealsInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} deal(s)`;
  },
};
