"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AppModal, ModalFooter } from "@/components/modal";
import { AppForm } from "@/components/forms/form-context";
import { FormInput } from "@/components/forms/form-input";
import { EmailBodyEditor } from "@/components/forms/email-body-editor";
import { AppCard } from "@/components/card/app-card";
import { AppCardHeader } from "@/components/card/app-card-header";
import { AppCardBody } from "@/components/card/app-card-body";
import { useRootStore } from "@/core/stores/root-store.provider";

export const SendContactEmailModal = observer(function SendContactEmailModal() {
  const t = useTranslations();
  const { sendContactEmailModalStore: store } = useRootStore();
  const { isLoading, close } = store;

  return (
    <AppModal store={store} title={t("SendContactEmail.title")}>
      <AppForm store={store}>
        <AppCard>
          <AppCardHeader>
            <h2 className="text-x-lg">{t("SendContactEmail.title")}</h2>
          </AppCardHeader>

          <AppCardBody className="space-y-3">
            <FormInput required id="to" type="email" />

            <FormInput required id="subject" />

            <EmailBodyEditor
              required
              label={t("Common.inputs.body")}
              placeholder={t("SendContactEmail.bodyPlaceholder")}
              value={store.form.body}
              onChange={(html) => store.onChange("body", html)}
            />
          </AppCardBody>

          <ModalFooter className="p-6 pt-0">
            <Button disabled={isLoading} variant="secondary" onClick={close}>
              {t("Common.actions.cancel")}
            </Button>

            <Button disabled={isLoading} type="submit">
              {t("SendContactEmail.send")}
            </Button>
          </ModalFooter>
        </AppCard>
      </AppForm>
    </AppModal>
  );
});
