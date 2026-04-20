"use client";

import type { ReactNode } from "react";
import type { BaseFormStore } from "@/core/base/base-form.store";
import type { BaseModalStore } from "@/core/base/base-modal.store";
import type {
  BaseCustomColumnEntityModalStore,
  EntityDto,
  FormEntityDto,
} from "@/core/base/base-custom-column-entity-modal.store";
import type { EntityType } from "@/generated/prisma";

import { Database, Clock, Pencil, SquarePen, Plus, Trash2, Columns3 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Action, CustomColumnType, Resource } from "@/generated/prisma";

import { AssigneeGuardModal } from "@/app/components/assignee-guard-modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppForm } from "@/components/forms/form-context";
import { ModalFooter } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Editor } from "@/components/editor/editor";
import { useRootStore } from "@/core/stores/root-store.provider";
import { useDeleteConfirmation } from "@/components/modal/hooks/use-delete-confirmation";

enum EntityDetailViewMode {
  masterData = "masterData",
  notes = "notes",
  sideBySide = "sideBySide",
}

const COOKIE_NAME = "entityModalViewMode";

type Layout = "drawer" | "page";

type Props<Form extends FormEntityDto, Dto extends EntityDto> = {
  store: BaseCustomColumnEntityModalStore<Form, Dto>;
  entityType: EntityType;
  titleKey: string;
  children: ReactNode;
  canDelete?: boolean;
  layout?: Layout;
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    function handler(event: MediaQueryListEvent) {
      return setMatches(event.matches);
    }

    mediaQuery.addEventListener("change", handler);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export const EntityDetailBody = observer(
  <Form extends FormEntityDto, Dto extends EntityDto>({
    store,
    entityType,
    titleKey,
    children,
    canDelete = true,
    layout = "drawer",
  }: Props<Form, Dto>) => {
    const t = useTranslations("");
    const isLargeScreen = useMediaQuery("(min-width: 1024px)");
    const rootStore = useRootStore();

    const [viewMode, setViewMode] = useState<EntityDetailViewMode>(() => {
      const saved = Cookies.get(COOKIE_NAME);
      if (saved && Object.values(EntityDetailViewMode).includes(saved as EntityDetailViewMode))
        return saved as EntityDetailViewMode;

      return isLargeScreen ? EntityDetailViewMode.sideBySide : EntityDetailViewMode.masterData;
    });

    useEffect(() => {
      if (!isLargeScreen && viewMode === EntityDetailViewMode.sideBySide) setViewMode(EntityDetailViewMode.masterData);
    }, [isLargeScreen, viewMode]);

    function handleViewModeChange(mode: EntityDetailViewMode) {
      setViewMode(mode);
      Cookies.set(COOKIE_NAME, mode, { expires: 365 });
    }

    const { canManage } = store;
    const { customColumnModalStore, entityHistoryModalStore, userStore } = useRootStore();
    const { showDeleteConfirmation } = useDeleteConfirmation();

    const { form, isLoading, isEditingCustomField, toggleEditingCustomField } = store;
    const hasId = form && typeof form === "object" && "id" in form && Boolean(form.id);

    const showMasterData =
      layout === "page" || viewMode === EntityDetailViewMode.masterData || viewMode === EntityDetailViewMode.sideBySide;
    const showNotes =
      layout === "drawer" && (viewMode === EntityDetailViewMode.notes || viewMode === EntityDetailViewMode.sideBySide);

    function handleNotesChange(data: object) {
      store.onChange("notes", data);
    }

    if (layout === "page") return <div className="flex flex-col gap-4 w-full">{children}</div>;

    const isAddFlow = !hasId;

    return (
      <>
        <AppForm store={store as unknown as BaseFormStore}>
          <AppCard className="border-0 shadow-none rounded-none bg-transparent">
            <AppCardHeader>
              <h2 className="text-x-lg grow">{t(titleKey)}</h2>

              {!isAddFlow && (
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    {isEditingCustomField ? (
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" type="button" variant="secondary" onClick={toggleEditingCustomField}>
                              {t("Common.actions.cancel")}
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent>{t("Common.actions.cancel")}</TooltipContent>
                        </Tooltip>

                        <Button
                          size="sm"
                          type="button"
                          variant="default"
                          onClick={() => {
                            customColumnModalStore.initialize(CustomColumnType.plain, entityType);
                            customColumnModalStore.open();
                          }}
                        >
                          <Icon className="mr-1" icon={Plus} />

                          {t("Common.actions.addCustomField")}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                aria-label={t("Common.actions.showMasterData")}
                                size="icon"
                                type="button"
                                variant={viewMode === EntityDetailViewMode.masterData ? "default" : "ghost"}
                                onClick={() => handleViewModeChange(EntityDetailViewMode.masterData)}
                              >
                                <Icon icon={Database} />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>{t("Common.actions.showMasterData")}</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                aria-label={t("Common.actions.showNotes")}
                                size="icon"
                                type="button"
                                variant={viewMode === EntityDetailViewMode.notes ? "default" : "ghost"}
                                onClick={() => handleViewModeChange(EntityDetailViewMode.notes)}
                              >
                                <Icon icon={SquarePen} />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>{t("Common.actions.showNotes")}</TooltipContent>
                          </Tooltip>

                          {isLargeScreen && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  aria-label={t("Common.actions.showSideBySide")}
                                  size="icon"
                                  type="button"
                                  variant={viewMode === EntityDetailViewMode.sideBySide ? "default" : "ghost"}
                                  onClick={() => handleViewModeChange(EntityDetailViewMode.sideBySide)}
                                >
                                  <Icon icon={Columns3} />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>{t("Common.actions.showSideBySide")}</TooltipContent>
                            </Tooltip>
                          )}
                        </div>

                        {rootStore.isCloudHosted && userStore.can(Resource.auditLog, Action.readAll) && (
                          <>
                            <Separator className="h-5" orientation="vertical" />

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  aria-label={t("Common.actions.showHistory")}
                                  size="icon"
                                  type="button"
                                  variant="ghost"
                                  onClick={() => {
                                    if (typeof form.id === "string")
                                      void entityHistoryModalStore.loadByEntityId(form.id);
                                  }}
                                >
                                  <Icon icon={Clock} />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>{t("Common.actions.showHistory")}</TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        {canManage && (
                          <>
                            <Separator className="h-5" orientation="vertical" />

                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    aria-label={t("Common.actions.editCustomFields")}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                    onClick={toggleEditingCustomField}
                                  >
                                    <Icon icon={Pencil} />
                                  </Button>
                                </TooltipTrigger>

                                <TooltipContent>{t("Common.actions.editCustomFields")}</TooltipContent>
                              </Tooltip>

                              {canDelete && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      aria-label={t("Common.actions.delete")}
                                      disabled={isLoading}
                                      size="icon"
                                      type="button"
                                      variant="ghost"
                                      onClick={() => showDeleteConfirmation(() => void store.delete())}
                                    >
                                      <Icon className="text-destructive" icon={Trash2} />
                                    </Button>
                                  </TooltipTrigger>

                                  <TooltipContent>{t("Common.actions.delete")}</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </TooltipProvider>
              )}
            </AppCardHeader>

            <AppCardBody>
              {isAddFlow ? (
                <div className="flex flex-col gap-6">
                  {children}

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {t("Common.actions.labelNotes")}
                    </span>

                    <Editor data={form.notes} onChange={handleNotesChange} />
                  </div>
                </div>
              ) : viewMode === EntityDetailViewMode.sideBySide ? (
                <div className="grid grid-cols-7 gap-6">
                  {showMasterData && (
                    <div className="col-span-3 flex flex-col gap-4 sticky top-0 self-start">{children}</div>
                  )}

                  {showNotes && (
                    <div className="col-span-4 flex flex-col gap-4 sticky top-0 self-start h-full">
                      <Editor data={form.notes} onChange={handleNotesChange} />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {showMasterData && children}

                  {showNotes && <Editor data={form.notes} onChange={handleNotesChange} />}
                </>
              )}
            </AppCardBody>

            <ModalFooter className="p-6 pt-0">
              <Button disabled={isLoading || !store.hasUnsavedChanges || store.isDisabled} type="submit">
                {t("Common.actions.save")}
              </Button>
            </ModalFooter>
          </AppCard>
        </AppForm>

        <AssigneeGuardModal store={store as unknown as BaseModalStore} />
      </>
    );
  },
);
