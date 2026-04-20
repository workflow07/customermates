"use client";

import type { BaseModalStore } from "@/core/base/base-modal.store";

import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";

import { Button } from "@/components/ui/button";
import { AppModal, ModalFooter } from "@/components/modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardHeader } from "@/components/card/app-card-header";

type Props = {
  store: BaseModalStore;
};

export const AssigneeGuardModal = observer(({ store }: Props) => {
  const t = useTranslations("Common");

  if (!store) return null;

  return (
    <AppModal
      open={store.isSubmittingWithGuard}
      title={t("assigneeGuard.title")}
      onClose={() => store.setIsSubmittingWithGuard(false)}
    >
      <AppCard>
        <AppCardHeader>
          <h2 className="text-x-lg">{t("assigneeGuard.title")}</h2>
        </AppCardHeader>

        <AppCardBody>
          <p className="text-x-sm">{t("assigneeGuard.message")}</p>
        </AppCardBody>

        <ModalFooter>
          <Button variant="secondary" onClick={() => store.setIsSubmittingWithGuard(false)}>
            {t("actions.cancel")}
          </Button>
        </ModalFooter>
      </AppCard>
    </AppModal>
  );
});
