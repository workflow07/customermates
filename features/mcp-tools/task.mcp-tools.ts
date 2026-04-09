import { z } from "zod";

import { encodeToToon } from "./utils";

import { di } from "@/core/dependency-injection/container";
import { CreateManyTasksInteractor } from "@/features/tasks/upsert/create-many-tasks.interactor";
import { UpdateManyTasksInteractor } from "@/features/tasks/upsert/update-many-tasks.interactor";
import { BaseCreateTaskSchema } from "@/features/tasks/upsert/create-task-base.schema";

const McpCreateManyTasksSchema = z.object({
  tasks: z.array(BaseCreateTaskSchema).min(1).max(10),
});

const UpdateTasksNameSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
});

const ChangeTasksUsersSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.uuid(),
        userIds: z.array(z.uuid()),
      }),
    )
    .min(1)
    .max(10),
});

export const batchCreateTasksTool = {
  name: "batch_create_tasks",
  description: "Create tasks. Run get_entity_configuration first. Required: name. Returns IDs.",
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  inputSchema: McpCreateManyTasksSchema,
  execute: async (params: z.infer<typeof McpCreateManyTasksSchema>) => {
    const result = await di.get(CreateManyTasksInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return encodeToToon(result.data.map((item) => item.id));
  },
};

export const batchUpdateTaskNameTool = {
  name: "batch_update_task_name",
  description: "Update task name. Only updates provided fields.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: UpdateTasksNameSchema,
  execute: async (params: z.infer<typeof UpdateTasksNameSchema>) => {
    const result = await di.get(UpdateManyTasksInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} task(s)`;
  },
};

export const batchSetTaskUsersTool = {
  name: "batch_set_task_users",
  description: "Set (replace) all users assigned to a task. Pass empty array to unassign all.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  inputSchema: ChangeTasksUsersSchema,
  execute: async (params: z.infer<typeof ChangeTasksUsersSchema>) => {
    const result = await di.get(UpdateManyTasksInteractor).invoke(params);
    if (!result.ok) return `Validation error: ${z.prettifyError(result.error)}`;
    return `Updated ${result.data.length} task(s)`;
  },
};
