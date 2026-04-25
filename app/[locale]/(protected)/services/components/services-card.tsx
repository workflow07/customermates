"use client";

import type { GetResult } from "@/core/base/base-get.interactor";
import type { ServiceDto } from "@/features/services/service.schema";
import type { ColumnDef } from "@tanstack/react-table";

import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { EntityType } from "@/generated/prisma";

import { useRootStore } from "@/core/stores/root-store.provider";
import { AppChipStack } from "@/components/chip/app-chip-stack";
import { DataViewContainer, standardTailColumns, useDataViewSync } from "@/components/data-view";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";

type Props = {
  services: GetResult<ServiceDto>;
};

export const ServicesCard = observer(({ services }: Props) => {
  const { servicesStore, dealsStore, intlStore, userModalStore } = useRootStore();
  const openEntity = useOpenEntity();

  useDataViewSync(servicesStore, services, [dealsStore]);

  const columns = useMemo<ColumnDef<ServiceDto>[]>(() => {
    return [
      {
        id: "name",
        cell: ({ row }) => <span className="text-sm truncate">{row.original.name}</span>,
      },
      {
        id: "amount",
        cell: ({ row }) => <span className="text-sm">{intlStore.formatCurrency(row.original.amount)}</span>,
      },
      {
        id: "deals",
        cell: ({ row }) => (
          <AppChipStack
            items={row.original.deals.map((deal) => ({ id: deal.id, label: deal.name }))}
            size="sm"
            onChipClick={(deal) => openEntity(EntityType.deal, deal.id)}
          />
        ),
      },
      ...standardTailColumns({ store: servicesStore, intlStore, userModalStore }),
    ];
  }, [servicesStore, servicesStore.customColumns, intlStore, openEntity, userModalStore]);

  return (
    <DataViewContainer
      columns={columns}
      store={servicesStore}
      onAdd={() => openEntity(EntityType.service, "new")}
      onRowClick={(item) => openEntity(EntityType.service, item.id)}
    />
  );
});
