"use client";

import { Mail } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { DealDetailView } from "../../components/deal-detail-view";
import { SendContactEmailModal } from "../../../contacts/components/send-contact-email-modal";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const DealDetailPageView = observer(function DealDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { dealDetailStore, sendContactEmailModalStore } = useRootStore();
  const deal = dealDetailStore.fetchedEntity;

  const name = deal?.name ?? t("DealModal.title");

  function handleSendEmail() {
    const firstContact = deal?.contacts[0];
    sendContactEmailModalStore.initialize(firstContact?.id ?? "", firstContact?.emails[0] ?? "");
  }

  const sendEmailButton = deal?.contacts.length ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="h-8" size="sm" type="button" variant="outline" onClick={handleSendEmail}>
          <Icon icon={Mail} />

          <span className="hidden sm:inline">{t("SendContactEmail.title")}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>{t("SendContactEmail.title")}</TooltipContent>
    </Tooltip>
  ) : null;

  return (
    <>
      <EntityDetailLayout
        entityId={id}
        entityType={EntityType.deal}
        extraActions={sendEmailButton}
        extraAuditLogRefreshKey={sendContactEmailModalStore.auditLogRefreshKey}
        identity={{ name }}
        masterData={<DealDetailView layout="page" />}
        store={dealDetailStore}
      />

      <SendContactEmailModal />
    </>
  );
});
