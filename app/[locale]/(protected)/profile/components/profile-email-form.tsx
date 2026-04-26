"use client";

import { useEffect, useId, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import type { SmtpSettingsDto } from "@/features/company/smtp/get-smtp-settings.interactor";

import { AppForm } from "@/components/forms/form-context";
import { FormInput } from "@/components/forms/form-input";
import { EmailSignatureEditor } from "@/components/forms/email-signature-editor";
import { FormActions } from "@/components/card/form-actions";
import { useSetTopBarActions } from "@/app/components/topbar-actions-context";
import { useRootStore } from "@/core/stores/root-store.provider";
import { useRouter } from "@/i18n/navigation";

type Props = {
  initialSettings: SmtpSettingsDto | null;
};

export const ProfileEmailForm = observer(function ProfileEmailForm({ initialSettings }: Props) {
  const t = useTranslations("SmtpSettings");
  const router = useRouter();
  const formId = useId();
  const { profileEmailStore: store } = useRootStore();

  useEffect(() => {
    store.initFromDto(
      initialSettings ?? {
        smtpHost: null,
        smtpPort: null,
        smtpUser: null,
        smtpPassword: null,
        smtpFromEmail: null,
        emailSignature: null,
      },
    );
  }, [initialSettings]);

  const topBarActions = useMemo(
    () => <FormActions formId={formId} store={store} variant="topbar" />,
    [formId, store],
  );
  useSetTopBarActions(topBarActions);

  return (
    <AppForm
      id={formId}
      store={store}
      onSubmit={(event) =>
        void store.onSubmit(event).then(() => {
          if (!store.error) router.refresh();
        })
      }
    >
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">{t("smtpTitle")}</h2>

          <FormInput id="smtpHost" label={t("smtpHost")} placeholder="smtp.example.com" />

          <FormInput id="smtpPort" label={t("smtpPort")} placeholder="465" type="number" />

          <FormInput id="smtpUser" label={t("smtpUser")} placeholder="user@example.com" />

          <FormInput id="smtpPassword" label={t("smtpPassword")} type="password" />

          <FormInput id="smtpFromEmail" label={t("smtpFromEmail")} placeholder="noreply@example.com" />
        </div>

        <EmailSignatureEditor
          hint={t("emailSignatureHint")}
          label={t("emailSignature")}
          placeholder={t("emailSignaturePlaceholder")}
          value={store.form.emailSignature}
          onChange={(html) => store.onChange("emailSignature", html)}
        />
      </div>
    </AppForm>
  );
});
