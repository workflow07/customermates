import type { RootStore } from "@/core/stores/root.store";
import type { FormEvent } from "react";

import { makeObservable, observable, action } from "mobx";
import { toast } from "sonner";

import { sendContactEmailAction } from "../actions";

import { BaseModalStore } from "@/core/base/base-modal.store";

type Form = {
  contactId: string;
  to: string;
  subject: string;
  body: string;
  signature: string | null;
  documentHtml: string | null;
  pdfBase64: string | null;
  pdfFilename: string | null;
};

export class SendContactEmailModalStore extends BaseModalStore<Form> {
  auditLogRefreshKey = 0;

  constructor(public readonly rootStore: RootStore) {
    super(rootStore, { contactId: "", to: "", subject: "", body: "", signature: null, documentHtml: null, pdfBase64: null, pdfFilename: null });

    makeObservable(this, {
      auditLogRefreshKey: observable,
      initialize: action,
    });
  }

  initialize(contactId: string, toEmail: string, documentHtml?: string | null, pdfBase64?: string | null, pdfFilename?: string | null) {
    const signature = this.rootStore.userStore.user?.emailSignature ?? null;
    this.onInitOrRefresh({ contactId, to: toEmail, subject: "", body: "", signature, documentHtml: documentHtml ?? null, pdfBase64: pdfBase64 ?? null, pdfFilename: pdfFilename ?? null });
    this.open();
  }

  onSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    this.setIsLoading(true);

    try {
      const res = await sendContactEmailAction({
        contactId: this.form.contactId,
        to: this.form.to,
        subject: this.form.subject,
        body: this.form.body,
        signature: this.form.signature,
        documentHtml: this.form.documentHtml,
        pdfBase64: this.form.pdfBase64,
        pdfFilename: this.form.pdfFilename,
      });

      if (res.ok) {
        this.close();
        this.onInitOrRefresh({ contactId: "", to: "", subject: "", body: "", signature: null });
        this.auditLogRefreshKey += 1;
        toast.success(this.rootStore.localeStore.getTranslation("SendContactEmail.success"));
      } else {
        this.setError(res.error);
      }
    } finally {
      this.setIsLoading(false);
    }
  };
}
