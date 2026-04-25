"use client";

import type { TaskDto } from "@/features/tasks/task.schema";
import type { GetResult } from "@/core/base/base-get.interactor";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityType, TaskType } from "@/generated/prisma";

import { getSystemTaskNameTranslationKey } from "./system-task.config";

import { Icon } from "@/components/shared/icon";
import { useRootStore } from "@/core/stores/root-store.provider";
import { DataViewContainer, standardTailColumns, useDataViewSync } from "@/components/data-view";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";

type Props = {
  tasks: GetResult<TaskDto>;
};

export const TasksCardComponent = observer(({ tasks }: Props) => {
  const t = useTranslations("");

  const { tasksStore, intlStore, userModalStore } = useRootStore();
  const openEntity = useOpenEntity();

  useDataViewSync(tasksStore, tasks);

  const columns = useMemo<ColumnDef<TaskDto>[]>(() => {
    return [
      {
        id: "name",
        cell: ({ row }) => {
          const item = row.original;
          const isSystemTask = item.type !== TaskType.custom;
          const nameTranslationKey = getSystemTaskNameTranslationKey(item.type);
          const displayName = nameTranslationKey ? t(nameTranslationKey) : item.name;

          return (
            <div className="text-sm flex min-w-0 items-center gap-2">
              <span className="min-w-0 truncate">{displayName}</span>

              {isSystemTask && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon className="shrink-0 text-warning ml-auto" icon={Info} size="lg" />
                    </TooltipTrigger>

                    <TooltipContent>{t("TasksCard.systemTaskTooltip")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
      },
      ...standardTailColumns({ store: tasksStore, intlStore, userModalStore }),
    ];
  }, [t, tasksStore, tasksStore.customColumns, intlStore, userModalStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={tasksStore}
      onAdd={() => openEntity(EntityType.task, "new")}
      onRowClick={(item) => openEntity(EntityType.task, item.id)}
    />
  );
});
