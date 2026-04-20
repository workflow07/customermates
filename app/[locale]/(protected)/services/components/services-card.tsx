"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { ServiceDto } from "@/features/services/service.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { EntityType } from "@/generated/prisma";

import { useRootStore } from "@/core/stores/root-store.provider";
import { AvatarStack } from "@/components/shared/avatar-stack";
import { AppChipStack } from "@/components/chip/app-chip-stack";
import { CustomFieldValue } from "@/components/data-view/custom-columns/custom-field-value";
import { DataViewContainer } from "@/components/data-view";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";

type Props = {
  services: GetResult<ServiceDto>;
};

export const ServicesCard = observer(({ services }: Props) => {
  const t = useTranslations("");

  const { servicesStore, dealsStore, intlStore, userModalStore } = useRootStore();
  const openEntity = useOpenEntity();

  useEffect(() => servicesStore.setItems(services), [services]);

  useEffect(() => {
    const cleanupUrlSync = servicesStore.withUrlSync();
    const unregisterDeals = dealsStore.registerOnChange(() => servicesStore.refresh());
    return () => {
      cleanupUrlSync();
      unregisterDeals();
    };
  }, []);

  const columns = useMemo<ColumnDef<ServiceDto>[]>(() => {
    return [
      {
        id: "name",
        accessorKey: "name",
        header: t("Common.table.columns.name"),
        cell: ({ row }) => <span className="text-sm truncate">{row.original.name}</span>,
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("Common.table.columns.amount"),
        cell: ({ row }) => <span className="text-sm">{intlStore.formatCurrency(row.original.amount)}</span>,
      },
      {
        id: "deals",
        header: t("Common.table.columns.deals"),
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.deals.map((deal) => ({ id: deal.id, label: deal.name }))}
            size="sm"
            onChipClick={(deal) => openEntity(EntityType.deal, deal.id)}
          />
        ),
      },
      ...servicesStore.customColumns.map<ColumnDef<ServiceDto>>((column) => ({
        id: column.id,
        header: column.label,
        cell: ({ row }) => <CustomFieldValue column={column} item={row.original} store={servicesStore} />,
      })),
      {
        id: "users",
        header: t("Common.table.columns.users"),
        cell: ({ row }) => (
          <AvatarStack
            items={row.original.users || []}
            onAvatarClick={(user) => void userModalStore.loadById(user.id)}
          />
        ),
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: t("Common.table.columns.updatedAt"),
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.updatedAt)}</span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: t("Common.table.columns.createdAt"),
        cell: ({ row }) => (
          <span className="text-sm">{intlStore.formatNumericalShortDateTime(row.original.createdAt)}</span>
        ),
      },
    ];
  }, [t, servicesStore, servicesStore.customColumns, intlStore, openEntity, userModalStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={servicesStore}
      onAdd={() => openEntity(EntityType.service, "new")}
      onRowClick={(item) => openEntity(EntityType.service, item.id)}
    />
  );
});
