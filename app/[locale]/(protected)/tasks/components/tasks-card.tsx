"use client";

import type { TaskDto } from "@/features/tasks/task.schema";
import type { GetResult } from "@/core/base/base-get.interactor";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityType, TaskType } from "@/generated/prisma";

import { getSystemTaskNameTranslationKey } from "./system-task.config";

import { Icon } from "@/components/shared/icon";
import { useRootStore } from "@/core/stores/root-store.provider";
import { DataViewContainer } from "@/components/data-view";
import { AvatarStack } from "@/components/shared/avatar-stack";
import { CustomFieldValue } from "@/components/data-view/custom-columns/custom-field-value";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";

type Props = {
  tasks: GetResult<TaskDto>;
};

export const TasksCardComponent = observer(({ tasks }: Props) => {
  const t = useTranslations("");

  const { tasksStore, intlStore, userModalStore } = useRootStore();
  const openEntity = useOpenEntity();

  useEffect(() => tasksStore.setItems(tasks), [tasks]);

  useEffect(() => {
    const cleanupUrlSync = tasksStore.withUrlSync();
    return () => cleanupUrlSync();
  }, []);

  const columns = useMemo<ColumnDef<TaskDto>[]>(() => {
    return [
      {
        id: "name",
        accessorKey: "name",
        header: t("Common.table.columns.name"),
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
      ...tasksStore.customColumns.map<ColumnDef<TaskDto>>((column) => ({
        id: column.id,
        header: column.label,
        cell: ({ row }) => <CustomFieldValue column={column} item={row.original} store={tasksStore} />,
      })),
      {
        id: "users",
        header: t("Common.table.columns.users"),
        cell: ({ row }) => (
          <AvatarStack
            items={row.original.users || []}
            onAvatarClick={(user) => void userModalStore.loadById(user.id)}
          />
        ),
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: t("Common.table.columns.updatedAt"),
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.updatedAt)}</span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: t("Common.table.columns.createdAt"),
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.createdAt)}</span>
        ),
      },
    ];
  }, [t, tasksStore.customColumns, intlStore, userModalStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={tasksStore}
      onAdd={() => openEntity(EntityType.task, "new")}
      onRowClick={(item) => openEntity(EntityType.task, item.id)}
    />
  );
});
