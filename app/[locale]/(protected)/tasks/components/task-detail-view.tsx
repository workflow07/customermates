"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType, Resource } from "@/generated/prisma";

import { getUsersAction } from "../../company/actions";

import { EntityDetailBody } from "@/components/modal/entity-detail-body";
import { FormAutocompleteAvatar } from "@/components/forms/form-autocomplete-avatar";
import { FormInput } from "@/components/forms/form-input";
import { CustomFieldValueInput } from "@/components/data-view/custom-columns/custom-field-value-input";
import { useRootStore } from "@/core/stores/root-store.provider";
import { Alert } from "@/components/shared/alert";
import { AppLink } from "@/components/shared/app-link";

type Props = {
  layout?: "drawer" | "page";
};

export const TaskDetailView = observer(function TaskDetailView({ layout = "drawer" }: Props) {
  const t = useTranslations("");
  const { taskDetailStore, userModalStore, userStore } = useRootStore();
  const { form, fetchedEntity, customColumns, isEditingCustomField, isCustomTask, isDisabled, systemTaskAlertConfig } =
    taskDetailStore;

  return (
    <EntityDetailBody
      canDelete={isCustomTask}
      entityType={EntityType.task}
      layout={layout}
      store={taskDetailStore}
      titleKey="TaskModal.title"
    >
      {systemTaskAlertConfig && (
        <Alert color="warning">
          <p className="text-x-sm">
            {t.rich(systemTaskAlertConfig.translationKey, {
              link: (chunks) => (
                <AppLink inheritSize className="text-current" href={systemTaskAlertConfig.linkHref}>
                  {chunks}
                </AppLink>
              ),
            })}
          </p>
        </Alert>
      )}

      <FormInput required disabled={isDisabled || (!isCustomTask && form.id !== undefined)} id="name" />

      {customColumns.map((column, index) => (
        <CustomFieldValueInput key={column.id} column={column} index={index} isEditing={isEditingCustomField} />
      ))}

      {userStore.canAccess(Resource.users) && (
        <FormAutocompleteAvatar
          getItems={getUsersAction}
          id="userIds"
          items={fetchedEntity?.users ?? []}
          selectionMode="multiple"
          onChipClick={(id) => void userModalStore.loadById(id)}
        />
      )}
    </EntityDetailBody>
  );
});
