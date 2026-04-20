"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { ContactDetailView } from "../../components/contact-detail-view";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const ContactDetailPageView = observer(function ContactDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { contactDetailStore } = useRootStore();
  const contact = contactDetailStore.fetchedEntity;

  const firstName = contact?.firstName ?? "";
  const lastName = contact?.lastName ?? "";
  const name = `${firstName} ${lastName}`.trim();

  return (
    <EntityDetailLayout
      entityId={id}
      entityType={EntityType.contact}
      identity={{ name: name || t("ContactModal.title") }}
      masterData={<ContactDetailView layout="page" />}
      store={contactDetailStore}
    />
  );
});
