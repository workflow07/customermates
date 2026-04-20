"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AppModal, ModalFooter } from "@/components/modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppForm } from "@/components/forms/form-context";
import { FormInput } from "@/components/forms/form-input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FormLabel } from "@/components/forms/form-label";
import { useState } from "react";
import { useRootStore } from "@/core/stores/root-store.provider";
import { Alert } from "@/components/shared/alert";
import { CopyableCode } from "@/components/shared/copyable-code";

const ExpiresInPicker = observer(function ExpiresInPicker() {
  const t = useTranslations("ApiKeyModal");
  const { apiKeyModalStore } = useRootStore();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const today = new Date();
  const max = new Date();
  max.setDate(max.getDate() + 364);

  return (
    <div className="space-y-1.5">
      <FormLabel htmlFor="expiresIn">{t("expiresIn")}</FormLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            disabled={apiKeyModalStore.isDisabled}
            id="expiresIn"
            type="button"
            variant="outline"
          >
            <CalendarIcon className="mr-2 size-4" />

            {date ? format(date, "PPP") : <span>{t("expiresInPlaceholder")}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            autoFocus
            disabled={(d) => d < today || d > max}
            mode="single"
            selected={date}
            onSelect={(next) => {
              setDate(next ?? undefined);
              let expiresIn = next ? Math.ceil((next.getTime() - new Date().getTime()) / 1000) : undefined;
              if (expiresIn !== undefined && expiresIn <= 1) expiresIn = undefined;
              apiKeyModalStore.onChange("expiresIn", expiresIn);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

export const ApiKeyModal = observer(() => {
  const t = useTranslations("");
  const { apiKeyModalStore } = useRootStore();
  const { createdKey, isLoading, close, hasUnsavedChanges } = apiKeyModalStore;

  return (
    <AppModal store={apiKeyModalStore} title={t("ApiKeyModal.title")}>
      <AppForm store={apiKeyModalStore}>
        <AppCard>
          <AppCardHeader>
            <h2 className="text-x-lg">{t("ApiKeyModal.title")}</h2>
          </AppCardHeader>

          <AppCardBody>
            {createdKey ? (
              <Alert hideIcon className="mb-4" color="success">
                <div className="flex flex-col gap-2">
                  <p className="text-x-md">{t("ApiKeyModal.keyCreated")}</p>

                  <CopyableCode value={createdKey} />

                  <p className="text-x-sm">{t("ApiKeyModal.keyWarning")}</p>
                </div>
              </Alert>
            ) : (
              <>
                <FormInput required id="name" />

                <ExpiresInPicker />
              </>
            )}
          </AppCardBody>

          {!createdKey && (
            <ModalFooter className="p-6 pt-0">
              <Button disabled={isLoading} variant="secondary" onClick={close}>
                {t("Common.actions.cancel")}
              </Button>

              <Button disabled={isLoading || !hasUnsavedChanges} type="submit">
                {t("Common.actions.save")}
              </Button>
            </ModalFooter>
          )}
        </AppCard>
      </AppForm>
    </AppModal>
  );
});
