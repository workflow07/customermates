"use client";

import type { ReactNode } from "react";
import type { BaseFormStore } from "@/core/base/base-form.store";
import type { BaseModalStore } from "@/core/base/base-modal.store";
import type {
  BaseCustomColumnEntityModalStore,
  EntityDto,
  FormEntityDto,
} from "@/core/base/base-custom-column-entity-modal.store";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { EntityType } from "@/generated/prisma";

import { AssigneeGuardModal } from "@/app/components/assignee-guard-modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppForm } from "@/components/forms/form-context";
import { ModalFooter } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor/editor";
import { useRouter } from "@/i18n/navigation";

type Layout = "drawer" | "page";

const DETAIL_HREF_BY_ENTITY: Record<EntityType, string> = {
  [EntityType.contact]: "/contacts",
  [EntityType.organization]: "/organizations",
  [EntityType.deal]: "/deals",
  [EntityType.service]: "/services",
  [EntityType.task]: "/tasks",
};

type Props<Form extends FormEntityDto, Dto extends EntityDto> = {
  store: BaseCustomColumnEntityModalStore<Form, Dto>;
  entityType: EntityType;
  titleKey: string;
  children: ReactNode;
  layout?: Layout;
};

export const EntityDetailBody = observer(
  <Form extends FormEntityDto, Dto extends EntityDto>({
    store,
    entityType,
    titleKey,
    children,
    layout = "drawer",
  }: Props<Form, Dto>) => {
    const t = useTranslations("");
    const router = useRouter();

    const { form, isLoading, lastCreatedId, canManage, isReadOnly } = store;

    useEffect(() => {
      if (!lastCreatedId) return;
      const id = store.consumeLastCreatedId();
      if (!id) return;
      router.push(`${DETAIL_HREF_BY_ENTITY[entityType]}/${id}`);
    }, [lastCreatedId, entityType, router, store]);

    function handleNotesChange(data: object) {
      store.onChange("notes", data);
    }

    if (layout === "page") return <div className="flex flex-col gap-4 w-full">{children}</div>;

    return (
      <>
        <AppForm store={store as unknown as BaseFormStore}>
          <AppCard className="border-0 shadow-none rounded-none bg-transparent">
            <AppCardHeader>
              <h2 className="text-x-lg grow">{t(titleKey)}</h2>
            </AppCardHeader>

            <AppCardBody>
              <div className="flex flex-col gap-6">
                {children}

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t("Common.actions.labelNotes")}
                  </span>

                  <Editor data={form.notes} readOnly={isReadOnly} onChange={handleNotesChange} />
                </div>
              </div>
            </AppCardBody>

            {canManage && (
              <ModalFooter className="p-6 pt-0">
                <Button disabled={isLoading || !store.hasUnsavedChanges || store.isDisabled} type="submit">
                  {t("Common.actions.save")}
                </Button>
              </ModalFooter>
            )}
          </AppCard>
        </AppForm>

        <AssigneeGuardModal store={store as unknown as BaseModalStore} />
      </>
    );
  },
);
