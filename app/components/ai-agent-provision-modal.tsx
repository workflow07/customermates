"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AppModal, ModalFooter } from "@/components/modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { CardHeroHeader } from "@/components/card/card-hero-header";
import { FormInput } from "@/components/forms/form-input";
import { AppForm } from "@/components/forms/form-context";
import { useRootStore } from "@/core/stores/root-store.provider";

export const AiAgentProvisionModal = observer(() => {
  const t = useTranslations("");
  const { aiAgentProvisionModalStore: store } = useRootStore();

  return (
    <AppModal store={store} title={t("AiAgent.agentSetup.title")}>
      <AppForm store={store}>
        <AppCard className="max-w-xl">
          <CardHeroHeader subtitle={t("AiAgent.agentSetup.provisioningHint")} title={t("AiAgent.agentSetup.title")} />

          <AppCardBody>
            <div className="space-y-4">
              <FormInput id="openaiApiKey" label={t("AiAgent.agentSetup.openai")} placeholder="sk-proj-..." />

              <FormInput id="anthropicApiKey" label={t("AiAgent.agentSetup.anthropic")} placeholder="sk-ant-..." />
            </div>
          </AppCardBody>

          <ModalFooter>
            <div className="flex w-full flex-col space-y-3 items-center">
              <Button className="w-full" disabled={store.isLoading} type="submit">
                {t("AiAgent.agentSetup.submit")}
              </Button>

              <Button className="w-full" disabled={store.isLoading} type="submit" variant="ghost">
                {t("AiAgent.agentSetup.skip")}
              </Button>
            </div>
          </ModalFooter>
        </AppCard>
      </AppForm>
    </AppModal>
  );
});
