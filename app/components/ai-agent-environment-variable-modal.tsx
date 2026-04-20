"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AppModal, ModalFooter } from "@/components/modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppCardBody } from "@/components/card/app-card-body";
import { FormInput } from "@/components/forms/form-input";
import { AppForm } from "@/components/forms/form-context";
import { useRootStore } from "@/core/stores/root-store.provider";

export const AiAgentEnvironmentVariableModal = observer(() => {
  const t = useTranslations("");
  const { aiAgentEnvironmentVariableModalStore: store } = useRootStore();

  return (
    <AppModal store={store} title={t("AiAgent.environmentVariable.title")}>
      <AppForm store={store}>
        <AppCard>
          <AppCardHeader>
            <h2 className="text-x-lg">{t("AiAgent.environmentVariable.title")}</h2>
          </AppCardHeader>

          <AppCardBody>
            <p className="text-x-sm">{t("AiAgent.environmentVariable.restartHint")}</p>

            <FormInput
              autoFocus
              required
              id="key"
              label={t("AiAgent.environmentVariable.key")}
              placeholder="MY_ENV_KEY"
            />

            <FormInput
              id="value"
              label={t("AiAgent.environmentVariable.value")}
              placeholder={t("AiAgent.environmentVariable.valuePlaceholder")}
            />
          </AppCardBody>

          <ModalFooter>
            <Button disabled={store.isLoading} variant="secondary" onClick={store.close}>
              {t("Common.actions.close")}
            </Button>

            <Button disabled={store.isLoading} type="submit">
              {t("Common.actions.save")}
            </Button>
          </ModalFooter>
        </AppCard>
      </AppForm>
    </AppModal>
  );
});
