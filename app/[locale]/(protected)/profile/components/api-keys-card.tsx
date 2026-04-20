"use client";

import type { ApiKey } from "@/features/api-key/get-api-keys.interactor";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { useRootStore } from "@/core/stores/root-store.provider";
import { useDeleteConfirmation } from "@/components/modal/hooks/use-delete-confirmation";
import { useSetTopBarActions } from "@/app/components/topbar-actions-context";

type Props = {
  apiKeys: ApiKey[];
};

export const ApiKeysCard = observer(({ apiKeys }: Props) => {
  const t = useTranslations("");
  const { showDeleteConfirmation } = useDeleteConfirmation();
  const { apiKeyModalStore, apiKeysStore, intlStore } = useRootStore();

  useEffect(() => apiKeysStore.setItems({ items: apiKeys }), [apiKeys]);

  const topBarActions = useMemo(
    () => (
      <Button className="h-8" size="sm" onClick={() => void apiKeyModalStore.add()}>
        <Plus className="size-3.5" />

        <span className="hidden sm:inline">{t("Common.actions.add")}</span>
      </Button>
    ),
    [apiKeyModalStore, t],
  );
  useSetTopBarActions(topBarActions);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <p className="text-subdued text-sm">{t("ProfileSections.apiKeysDescription")}</p>

      {apiKeysStore.items.length === 0 ? (
        <p className="text-subdued text-x-md">{t("Common.table.emptyContent")}</p>
      ) : (
        <div className="space-y-2">
          {apiKeysStore.items.map((key) => (
            <div key={key.id} className="flex items-center justify-between rounded-lg bg-card p-4 shadow-xs">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{key.name || t("ApiKeysCard.unnamed")}</p>

                <div className="mt-1 flex flex-col gap-1 text-xs text-subdued">
                  <span>
                    {`${t("Common.table.columns.createdAt")}: ${intlStore.formatNumericalShortDateTime(key.createdAt)}`}
                  </span>

                  {key.expiresAt && (
                    <span>
                      {`${t("Common.table.columns.expiresAt")}: ${intlStore.formatNumericalShortDateTime(key.expiresAt)}`}
                    </span>
                  )}

                  {key.lastRequest && (
                    <span>
                      {`${t("Common.table.columns.lastRequest")}: ${intlStore.formatNumericalShortDateTime(key.lastRequest)}`}
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => showDeleteConfirmation(() => void apiKeysStore.delete(key.id), key.name ?? undefined)}
              >
                <Icon className="text-destructive" icon={Trash2} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
