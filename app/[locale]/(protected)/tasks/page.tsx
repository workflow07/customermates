import { Resource } from "@/generated/prisma";

import { TasksCardComponent } from "./components/tasks-card";

import { getGetTasksInteractor, getRouteGuardService } from "@/core/di";
import { decodeGetParams } from "@/core/utils/get-params";
import { XPageContainer } from "@/components/x-layout-primitives/x-page-container";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TasksPage({ searchParams }: Props) {
  await getRouteGuardService().ensureAccessOrRedirect({ resource: Resource.tasks });

  const params = await searchParams;
  const taskParams = decodeGetParams(params);

  const tasks = await getGetTasksInteractor().invoke({ ...taskParams, p13nId: "tasks-card-store" });

  return (
    <XPageContainer>
      <TasksCardComponent tasks={tasks.ok ? tasks.data : { items: [] }} />
    </XPageContainer>
  );
}
