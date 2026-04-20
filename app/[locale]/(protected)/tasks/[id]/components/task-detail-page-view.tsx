"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { TaskDetailView } from "../../components/task-detail-view";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const TaskDetailPageView = observer(function TaskDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { taskDetailStore } = useRootStore();
  const task = taskDetailStore.fetchedEntity;

  const name = task?.name ?? t("TaskModal.title");

  return (
    <EntityDetailLayout
      canDelete={taskDetailStore.isCustomTask}
      entityId={id}
      entityType={EntityType.task}
      identity={{ name }}
      masterData={<TaskDetailView layout="page" />}
      store={taskDetailStore}
    />
  );
});
