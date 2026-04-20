"use client";

import type { BaseDataViewStore, HasId } from "@/core/base/base-data-view.store";

import { TrashIcon, XIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { bulkDeleteEntitiesAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useDeleteConfirmation } from "@/components/modal/hooks/use-delete-confirmation";

import { MassUpdatePopover } from "./mass-update-popover";

type Props<E extends HasId> = {
  store: BaseDataViewStore<E>;
};

export const MassActionsBar = observer(function MassActionsBar<E extends HasId>({ store }: Props<E>) {
  const t = useTranslations("");
  const { showDeleteConfirmation } = useDeleteConfirmation();
  const [isLoading, setIsLoading] = useState(false);

  const entityType = store.entityType;
  if (!store.hasSelection || !entityType) return null;

  async function handleDelete() {
    const ids = Array.from(store.selectedIds);
    if (ids.length === 0 || !entityType) return;

    setIsLoading(true);
    try {
      await bulkDeleteEntitiesAction({ entityType, ids });
      store.clearSelection();
      await store.refresh();
      toast.success(t("Common.notifications.deleted"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("Common.notifications.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-b border-border">
      <span className="text-sm font-medium whitespace-nowrap">
        {t("MassActions.selectedCount", { count: store.selectedCount })}
      </span>

      <MassUpdatePopover store={store} />

      <div className="grow" />

      <Button
        className="h-8"
        disabled={isLoading}
        size="sm"
        type="button"
        variant="outline"
        onClick={() => showDeleteConfirmation(() => void handleDelete())}
      >
        <TrashIcon className="size-4 text-destructive" />

        {t("MassActions.delete")}
      </Button>

      <Button
        aria-label={t("Common.actions.clear")}
        className="h-8"
        size="icon-sm"
        type="button"
        variant="outline"
        onClick={() => store.clearSelection()}
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
});
