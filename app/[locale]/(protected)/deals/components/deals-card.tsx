"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { DealDto } from "@/features/deals/deal.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { EntityType } from "@/generated/prisma";

import { AvatarStack } from "@/components/shared/avatar-stack";
import { AppChipStack } from "@/components/chip/app-chip-stack";
import { CustomFieldValue } from "@/components/data-view/custom-columns/custom-field-value";
import { DataViewContainer } from "@/components/data-view";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  deals: GetResult<DealDto>;
};

export const DealsCard = observer(({ deals }: Props) => {
  const { dealsStore, intlStore, organizationsStore, contactsStore, servicesStore, userModalStore } = useRootStore();
  const openEntity = useOpenEntity();
  const t = useTranslations("");

  useEffect(() => dealsStore.setItems(deals), [deals]);

  useEffect(() => {
    const cleanupUrlSync = dealsStore.withUrlSync();
    const unregisterOrgs = organizationsStore.registerOnChange(() => dealsStore.refresh());
    const unregisterContacts = contactsStore.registerOnChange(() => dealsStore.refresh());
    const unregisterServices = servicesStore.registerOnChange(() => dealsStore.refresh());
    return () => {
      cleanupUrlSync();
      unregisterOrgs();
      unregisterContacts();
      unregisterServices();
    };
  }, []);

  const columns = useMemo<ColumnDef<DealDto>[]>(() => {
    return [
      {
        id: "name",
        accessorKey: "name",
        header: t("Common.table.columns.name"),
        cell: ({ row }) => <span className="text-sm truncate">{row.original.name ?? ""}</span>,
      },
      {
        id: "totalValue",
        accessorKey: "totalValue",
        header: t("Common.table.columns.totalValue"),
        cell: ({ row }) => <span className="text-sm">{intlStore.formatCurrency(row.original.totalValue)}</span>,
      },
      {
        id: "totalQuantity",
        accessorKey: "totalQuantity",
        header: t("Common.table.columns.totalQuantity"),
        cell: ({ row }) => <span className="text-sm">{intlStore.formatNumber(row.original.totalQuantity)}</span>,
      },
      {
        id: "contacts",
        header: t("Common.table.columns.contacts"),
        cell: ({ row }) => (
          <AvatarStack
            items={row.original.contacts || []}
            onAvatarClick={(contact) => openEntity(EntityType.contact, contact.id)}
          />
        ),
      },
      {
        id: "organizations",
        header: t("Common.table.columns.organizations"),
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.organizations.map((org) => ({ id: org.id, label: org.name }))}
            size="sm"
            onChipClick={(org) => openEntity(EntityType.organization, org.id)}
          />
        ),
      },
      {
        id: "services",
        header: t("Common.table.columns.services"),
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.services.map((service) => ({
              id: service.id,
              label: `${service.name} – ${intlStore.formatCurrency(service.amount * service.quantity)}`,
            }))}
            size="sm"
            onChipClick={(service) => openEntity(EntityType.service, service.id)}
          />
        ),
      },
      ...dealsStore.customColumns.map<ColumnDef<DealDto>>((column) => ({
        id: column.id,
        header: column.label,
        cell: ({ row }) => <CustomFieldValue column={column} item={row.original} store={dealsStore} />,
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
  }, [t, dealsStore, dealsStore.customColumns, intlStore, openEntity, userModalStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={dealsStore}
      onAdd={() => openEntity(EntityType.deal, "new")}
      onRowClick={(item) => openEntity(EntityType.deal, item.id)}
    />
  );
});
