import type { FormEvent } from "react";
import type { RootStore } from "@/core/stores/root.store";
import type { SmtpSettingsDto } from "@/features/company/smtp/get-smtp-settings.interactor";

import { action, makeObservable } from "mobx";

import { getEmailSettingsAction, updateEmailSettingsAction } from "../actions";

import { BaseFormStore } from "@/core/base/base-form.store";

type Form = {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
  emailSignature: string;
};

export class ProfileEmailStore extends BaseFormStore<Form> {
  constructor(public readonly rootStore: RootStore) {
    super(rootStore, {
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
      smtpFromEmail: "",
      emailSignature: "",
    });

    makeObservable(this, { onSubmit: action });
  }

  initFromDto(dto: SmtpSettingsDto) {
    this.onInitOrRefresh({
      smtpHost: dto.smtpHost ?? "",
      smtpPort: dto.smtpPort != null ? String(dto.smtpPort) : "",
      smtpUser: dto.smtpUser ?? "",
      smtpPassword: dto.smtpPassword ?? "",
      smtpFromEmail: dto.smtpFromEmail ?? "",
      emailSignature: dto.emailSignature ?? "",
    });
  }

  refresh = async () => {
    const dto = await getEmailSettingsAction();
    if (dto) this.initFromDto(dto);
  };

  onSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    this.setIsLoading(true);

    try {
      const res = await updateEmailSettingsAction({
        smtpHost: this.form.smtpHost || null,
        smtpPort: this.form.smtpPort ? Number(this.form.smtpPort) : null,
        smtpUser: this.form.smtpUser || null,
        smtpPassword: this.form.smtpPassword || null,
        smtpFromEmail: this.form.smtpFromEmail || null,
        emailSignature: this.form.emailSignature || null,
      });

      if (res.ok) {
        this.onInitOrRefresh({ ...this.form });
        const user = this.rootStore.userStore.user;
        if (user) {
          this.rootStore.userStore.setUser({ ...user, emailSignature: this.form.emailSignature || null });
        }
      } else {
        this.setError(res.error);
      }
    } finally {
      this.setIsLoading(false);
    }
  };
}
