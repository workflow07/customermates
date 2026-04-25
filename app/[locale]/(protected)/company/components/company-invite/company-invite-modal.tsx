"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormLabel } from "@/components/forms/form-label";
import { AppModal, ModalFooter } from "@/components/modal";
import { AppCard } from "@/components/card/app-card";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppCardBody } from "@/components/card/app-card-body";
import { Icon } from "@/components/shared/icon";
import { useRootStore } from "@/core/stores/root-store.provider";

import { InviteByEmailForm } from "./invite-by-email-form";

export const CompanyInviteModal = observer(() => {
  const t = useTranslations("");

  const { companyInviteModalStore, intlStore } = useRootStore();

  const { form, isLoading } = companyInviteModalStore;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(form.inviteLink);
      toast.success(
        t("Common.notifications.copiedToClipboard", {
          value: form.inviteLink,
        }),
        {
          icon: <Icon icon={Clipboard} size="sm" />,
        },
      );
    } catch {
      toast.error(t("Common.notifications.copyFailed"));
    }
  }

  function getDescription() {
    const baseDescription = t("CompanyInviteModal.description");

    if (!form.expiresAt || isLoading) return baseDescription;

    return `${baseDescription} ${t("CompanyInviteModal.expiresAt", {
      date: intlStore.formatDescriptiveShortDateTime(form.expiresAt),
    })}`;
  }

  const resolvedValue = isLoading ? t("CompanyInviteModal.generating") : form.inviteLink;

  return (
    <AppModal store={companyInviteModalStore} title={t("CompanyInviteModal.title")}>
      <AppCard>
        <AppCardHeader>
          <h2 className="text-x-lg grow">{t("CompanyInviteModal.title")}</h2>
        </AppCardHeader>

        <AppCardBody>
          <Tabs defaultValue="link">
            <TabsList>
              <TabsTrigger value="link">{t("OnboardingWizard.invite.tabs.link")}</TabsTrigger>

              <TabsTrigger value="email">{t("OnboardingWizard.invite.tabs.email")}</TabsTrigger>
            </TabsList>

            <TabsContent className="mt-3" value="link">
              <div className="space-y-1.5">
                <FormLabel htmlFor="inviteLink">{t("CompanyInviteModal.label")}</FormLabel>

                <div className="flex gap-2 items-center">
                  <Input readOnly className="truncate" disabled={isLoading} id="inviteLink" value={resolvedValue} />

                  <Button disabled={isLoading} size="icon" variant="ghost" onClick={() => void handleCopy()}>
                    <Icon icon={Clipboard} />
                  </Button>
                </div>

                <p className="text-subdued text-xs">{getDescription()}</p>
              </div>
            </TabsContent>

            <TabsContent className="mt-3" value="email">
              <InviteByEmailForm />
            </TabsContent>
          </Tabs>
        </AppCardBody>

        <ModalFooter className="p-6 pt-0">
          <Button autoFocus variant="secondary" onClick={() => companyInviteModalStore.close()}>
            {t("Common.actions.close")}
          </Button>
        </ModalFooter>
      </AppCard>
    </AppModal>
  );
});
