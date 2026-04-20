"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType } from "@/generated/prisma";

import { DealDetailView } from "../../components/deal-detail-view";

import { EntityDetailLayout } from "@/components/modal/entity-detail-layout";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  id: string;
};

export const DealDetailPageView = observer(function DealDetailPageView({ id }: Props) {
  const t = useTranslations("");
  const { dealDetailStore } = useRootStore();
  const deal = dealDetailStore.fetchedEntity;

  const name = deal?.name ?? t("DealModal.title");

  return (
    <EntityDetailLayout
      entityId={id}
      entityType={EntityType.deal}
      identity={{ name }}
      masterData={<DealDetailView layout="page" />}
      store={dealDetailStore}
    />
  );
});
