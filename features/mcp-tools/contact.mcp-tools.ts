import { z } from "zod";

import { encodeToToon } from "./utils";

import { getCreateManyContactsInteractor, getUpdateManyContactsInteractor } from "@/core/di";
import { BaseCreateContactSchema } from "@/features/contacts/upsert/create-contact-base.schema";

const McpCreateManyContactsSchema = z.object({
  contacts: z.array(BaseCreateContactSchema).min(1).max(10),
});

const UpdateContactsNameSchema = z.object({
  contacts: z
    .array(
      z.object({
        id: z.uuid(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeContactsOrganizationsSchema = z.object({
  contacts: z
    .array(
      z.object({
        id: z.uuid(),
        organizationIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeContactsUsersSchema = z.object({
  contacts: z
    .array(
      z.object({
        id: z.uuid(),
        userIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeContactsDealsSchema = z.object({
  contacts: z
    .array(
      z.object({
        id: z.uuid(),
        dealIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

export const batchCreateContactsTool = {
  name: "batch_create_contacts",
  description: "Create contacts. Run get_entity_configuration first. Required: firstName, lastName. Returns IDs.",
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  inputSchema: McpCreateManyContactsSchema,
  execute: async (params: z.infer<typeof McpCreateManyContactsSchema>) => {
    const result = await getCreateManyContactsInteractor().invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return encodeToToon(result.data.map((item) => item.id));
  },
};

export const batchUpdateContactNameTool = {
  name: "batch_update_contact_name",
  description: "Update contact firstName/lastName. Only updates provided fields.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: UpdateContactsNameSchema,
  execute: async (params: z.infer<typeof UpdateContactsNameSchema>) => {
    const result = await getUpdateManyContactsInteractor().invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} contact(s)`;
  },
};

export const batchSetContactOrganizationsTool = {
  name: "batch_set_contact_organizations",
  description: "Set (replace) all organizations linked to a contact. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeContactsOrganizationsSchema,
  execute: async (params: z.infer<typeof ChangeContactsOrganizationsSchema>) => {
    const result = await getUpdateManyContactsInteractor().invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} contact(s)`;
  },
};

export const batchSetContactUsersTool = {
  name: "batch_set_contact_users",
  description: "Set (replace) all users assigned to a contact. Pass empty array to unassign all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeContactsUsersSchema,
  execute: async (params: z.infer<typeof ChangeContactsUsersSchema>) => {
    const result = await getUpdateManyContactsInteractor().invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} contact(s)`;
  },
};

export const batchSetContactDealsTool = {
  name: "batch_set_contact_deals",
  description: "Set (replace) all deals linked to a contact. Pass empty array to unlink all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeContactsDealsSchema,
  execute: async (params: z.infer<typeof ChangeContactsDealsSchema>) => {
    const result = await getUpdateManyContactsInteractor().invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} contact(s)`;
  },
};
