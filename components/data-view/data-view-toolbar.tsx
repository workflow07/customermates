"use client";

import type { BaseDataViewStore, HasId } from "@/core/base/base-data-view.store";
import type { ReactNode } from "react";

import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { DataViewDisplayOptions } from "./header/display-options";
import { DataViewSearch } from "./header/search";
import { FilterPopover } from "./header/filter-popover";

type Props<E extends HasId> = {
  store: BaseDataViewStore<E>;
  onAdd?: () => void;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  actions?: ReactNode;
};

export const DataViewToolbar = observer(function DataViewToolbar<E extends HasId>({
  store,
  onAdd,
  isSearchable = true,
  searchPlaceholder,
  actions,
}: Props<E>) {
  const t = useTranslations("Common.actions");
  if (!store.isReady) return null;

  return (
    <div className="flex items-center gap-2">
      {isSearchable && (
        <div className="shrink-0">
          <DataViewSearch placeholder={searchPlaceholder} store={store} />
        </div>
      )}

      <div className="flex items-center gap-1">
        <FilterPopover store={store} />

        <DataViewDisplayOptions store={store} />

        {onAdd && !store.isDisabled && (
          <Button className="ml-1 h-8" size="sm" onClick={onAdd}>
            <Plus className="size-3.5" />

            <span className="hidden sm:inline">{t("add")}</span>
          </Button>
        )}

        {actions}
      </div>
    </div>
  );
});
