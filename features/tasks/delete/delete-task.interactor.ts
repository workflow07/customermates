import type { DeleteTaskRepo } from "./delete-task.repo";
import type { EventService } from "@/features/event/event.service";
import type { WidgetService } from "@/features/widget/widget.service";
import type { Data } from "@/core/validation/validation.utils";

import { z } from "zod";
import { Resource, Action } from "@/generated/prisma";

import { validateTaskIds, validateSystemTaskIds } from "@/core/validation/validate-task-ids";
import { DomainEvent } from "@/features/event/domain-events";
import { TentantInteractor } from "@/core/decorators/tenant-interactor.decorator";
import { type Validated } from "@/core/validation/validation.utils";
import { Validate } from "@/core/decorators/validate.decorator";
import { preserveTenantContext } from "@/core/decorators/tenant-context";
import { getTaskRepo } from "@/core/di";

export const DeleteTaskSchema = z
  .object({
    id: z.uuid(),
  })
  .superRefine(async (data, ctx) => {
    const taskSet = new Set([data.id]);
    const [validIdsSet, systemTaskIdsSet] = await preserveTenantContext(async () => {
      const repo = getTaskRepo();
      return Promise.all([repo.findIds(taskSet), repo.findSystemTaskIds(taskSet)]);
    });
    validateTaskIds(data.id, validIdsSet, ctx, ["id"]);
    validateSystemTaskIds(data.id, systemTaskIdsSet, ctx, ["id"]);
  });
export type DeleteTaskData = Data<typeof DeleteTaskSchema>;

@TentantInteractor({ resource: Resource.tasks, action: Action.delete })
export class DeleteTaskInteractor {
  constructor(
    private repo: DeleteTaskRepo,
    private eventService: EventService,
    private widgetService: WidgetService,
  ) {}

  @Validate(DeleteTaskSchema)
  async invoke(data: DeleteTaskData): Validated<string, DeleteTaskData> {
    const task = await this.repo.deleteTaskOrThrow(data.id);

    await Promise.all([
      this.eventService.publish(DomainEvent.TASK_DELETED, {
        entityId: task.id,
        payload: task,
      }),
      this.widgetService.recalculateUserWidgets(),
    ]);

    return { ok: true, data: data.id };
  }
}
