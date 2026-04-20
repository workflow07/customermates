"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { OrganizationDetailView } from "../../components/organization-detail-view";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const OrganizationDetailPageView = observer(function OrganizationDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { organizationDetailStore } = useRootStore();
  const org = organizationDetailStore.fetchedEntity;

  const name = org?.name ?? t("OrganizationModal.title");

  return (
    <EntityDetailLayout
      entityId={id}
      entityType={EntityType.organization}
      identity={{ name }}
      masterData={<OrganizationDetailView layout="page" />}
      store={organizationDetailStore}
    />
  );
});
