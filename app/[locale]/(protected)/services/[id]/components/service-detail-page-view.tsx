"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { ServiceDetailView } from "../../components/service-detail-view";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const ServiceDetailPageView = observer(function ServiceDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { serviceDetailStore } = useRootStore();
  const service = serviceDetailStore.fetchedEntity;

  const name = service?.name ?? t("ServiceModal.title");

  return (
    <EntityDetailLayout
      entityId={id}
      entityType={EntityType.service}
      identity={{ name }}
      masterData={<ServiceDetailView layout="page" />}
      store={serviceDetailStore}
    />
  );
});
