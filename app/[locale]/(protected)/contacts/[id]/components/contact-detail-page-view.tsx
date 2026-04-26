"use client";

import { Mail } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { ContactDetailView } from "../../components/contact-detail-view";
import { SendContactEmailModal } from "../../components/send-contact-email-modal";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const ContactDetailPageView = observer(function ContactDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { contactDetailStore, sendContactEmailModalStore } = useRootStore();
  const contact = contactDetailStore.fetchedEntity;

  const firstName = contact?.firstName ?? "";
  const lastName = contact?.lastName ?? "";
  const name = `${firstName} ${lastName}`.trim();

  function handleSendEmail() {
    sendContactEmailModalStore.initialize(id, contact?.emails[0] ?? "");
  }

  const sendEmailButton = contact ? (
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
        entityType={EntityType.contact}
        extraActions={sendEmailButton}
        extraAuditLogRefreshKey={sendContactEmailModalStore.auditLogRefreshKey}
        identity={{ name: name || t("ContactModal.title") }}
        masterData={<ContactDetailView layout="page" />}
        store={contactDetailStore}
      />

      <SendContactEmailModal />
    </>
  );
});
