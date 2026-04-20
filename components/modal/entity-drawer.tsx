"use client";

import type { EntityDrawerEntry } from "./hooks/use-entity-drawer-stack";

import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { EntityType } from "@/generated/prisma";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "radix-ui";
import { useRootStore } from "@/core/stores/root-store.provider";
import { useEntityDrawerStack } from "@/components/modal/hooks/use-entity-drawer-stack";
import { ContactDetailView } from "@/app/[locale]/(protected)/contacts/components/contact-detail-view";
import { OrganizationDetailView } from "@/app/[locale]/(protected)/organizations/components/organization-detail-view";
import { DealDetailView } from "@/app/[locale]/(protected)/deals/components/deal-detail-view";
import { ServiceDetailView } from "@/app/[locale]/(protected)/services/components/service-detail-view";
import { TaskDetailView } from "@/app/[locale]/(protected)/tasks/components/task-detail-view";

export const EntityDrawer = observer(function EntityDrawer() {
  const { top, popTop } = useEntityDrawerStack();
  const rootStore = useRootStore();
  const lastLoadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!top) {
      lastLoadedRef.current = null;
      return;
    }
    const key = `${top.entityType}:${top.id}`;
    if (lastLoadedRef.current === key) return;
    lastLoadedRef.current = key;

    const store = resolveModalStore(rootStore, top.entityType);
    if (!store) return;
    if (top.id === "new") void store.add();
    else void store.loadById(top.id);
  }, [top, rootStore]);

  function handleOpenChange(open: boolean) {
    if (!open) popTop();
  }

  return (
    <Sheet open={Boolean(top)} onOpenChange={handleOpenChange}>
      <SheetContent className="p-0 overflow-y-auto" side="right">
        <VisuallyHidden.Root>
          <SheetTitle>{top ? top.entityType : "Detail"}</SheetTitle>
        </VisuallyHidden.Root>

        {top && <DrawerBodyDispatch entry={top} />}
      </SheetContent>
    </Sheet>
  );
});

type RootStore = ReturnType<typeof useRootStore>;

function resolveModalStore(root: RootStore, entityType: EntityType) {
  switch (entityType) {
    case EntityType.contact:
      return root.contactDetailStore;
    case EntityType.organization:
      return root.organizationDetailStore;
    case EntityType.deal:
      return root.dealDetailStore;
    case EntityType.service:
      return root.serviceDetailStore;
    case EntityType.task:
      return root.taskDetailStore;
    default:
      return null;
  }
}

function DrawerBodyDispatch({ entry }: { entry: EntityDrawerEntry }) {
  switch (entry.entityType) {
    case EntityType.contact:
      return <ContactDetailView layout="drawer" />;
    case EntityType.organization:
      return <OrganizationDetailView layout="drawer" />;
    case EntityType.deal:
      return <DealDetailView layout="drawer" />;
    case EntityType.service:
      return <ServiceDetailView layout="drawer" />;
    case EntityType.task:
      return <TaskDetailView layout="drawer" />;
    default:
      return null;
  }
}
