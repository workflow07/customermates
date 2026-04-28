"use client";

import type { EstimateDto } from "@/features/estimates/estimate.schema";
import type { ContactDto } from "@/features/contacts/contact.schema";
import type { DealDto } from "@/features/deals/deal.schema";

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Plus, Trash2, Mail, Save, ChevronLeft, FileDown, Copy } from "lucide-react";

import { useRootStore } from "@/core/stores/root-store.provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/forms/form-label";
import { SendContactEmailModal } from "@/app/[locale]/(protected)/contacts/components/send-contact-email-modal";
import { DocumentPrintView } from "@/app/[locale]/(protected)/accounting/components/document-print-view";
import { EstimateDetailStore } from "./estimate-detail.store";

type Props = {
  estimate: EstimateDto | null;
  contacts: ContactDto[];
  deals: DealDto[];
};

const STATUSES = ["draft", "sent", "paid", "overdue"] as const;

export const EstimateDetailView = observer(({ estimate, contacts, deals }: Props) => {
  const t = useTranslations("Accounting");
  const router = useRouter();
  const { intlStore, sendContactEmailModalStore, layoutStore, companyStore } = useRootStore();

  const store = useMemo(() => new EstimateDetailStore(), []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (estimate) store.initFromDto(estimate);
    else store.initNew();
  }, [estimate, store]);

  const docNumber = store.id && estimate
    ? `EST-${String(estimate.number).padStart(3, "0")}`
    : t("newEstimate");

  useEffect(() => {
    layoutStore.setRuntimeTitle(docNumber);
    return () => layoutStore.setRuntimeTitle(null);
  }, [docNumber, layoutStore]);

  async function handleSave() {
    const wasNew = !estimate;
    const saved = await store.save();
    if (saved && wasNew) {
      router.replace(`/accounting/estimates/${saved.id}`);
    }
  }

  async function handleDelete() {
    const ok = await store.delete();
    if (ok) router.push("/accounting/estimates");
  }

  async function handleConvertToInvoice() {
    const invoice = await store.convertToInvoice();
    if (invoice) router.push(`/accounting/invoices/${invoice.id}`);
  }

  function handleSendByEmail() {
    const contact = contacts.find((c) => c.id === store.contactId);
    if (!contact || !contact.emails[0]) return;
    sendContactEmailModalStore.initialize(contact.id, contact.emails[0]);
  }

  const selectedContact = contacts.find((c) => c.id === store.contactId);
  const selectedDeal = deals.find((d) => d.id === store.dealId);

  return (
    <>
      <SendContactEmailModal />

      {/* Print-only layout — rendered client-side only to avoid store hydration mismatch */}
      {mounted && (
      <div className="hidden print:block" style={{ pageBreakAfter: "avoid", breakAfter: "avoid" }}>
        <DocumentPrintView
          company={companyStore.company ? {
            name: companyStore.company.name,
            logoUrl: companyStore.company.logoUrl,
            street: companyStore.company.street,
            city: companyStore.company.city,
            postalCode: companyStore.company.postalCode,
            phone: companyStore.company.phone,
            email: companyStore.company.email,
            website: companyStore.company.website,
            vatNumber: companyStore.company.vatNumber,
          } : null}
          contact={selectedContact ?? null}
          createdAt={estimate?.createdAt ?? null}
          docNumber={docNumber}
          dueDate={store.dueDate}
          formatCurrency={(n) => intlStore.formatCurrency(n)}
          formatDate={(d) => intlStore.formatDescriptiveLongDate(d)}
          grandTotal={store.grandTotal}
          labels={{
            docTypeLabel: t("print.estimate"),
            billTo: t("print.billTo"),
            date: t("print.date"),
            dueDate: t("dueDate"),
            status: t("status"),
            description: t("description"),
            quantity: t("quantity"),
            unitPrice: t("unitPrice"),
            total: t("total"),
            subtotal: t("subtotal"),
            tax: t("print.tax"),
            grandTotal: t("grandTotal"),
            notes: t("notes"),
            thankYou: t("print.thankYou"),
            vat: t("print.vat"),
          }}
          lineItems={store.lineItems}
          notes={store.notes}
          statusLabel={t(`statuses.${store.status}`)}
          subtotal={store.subtotal}
          taxPercent={store.taxPercent}
        />
      </div>
      )}

      {/* Editable UI — hidden when printing */}
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full print:hidden">
        {/* PDF export tip */}
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <span className="font-semibold shrink-0">Tip:</span>
          <span>To remove the browser header &amp; footer from the PDF, open the print dialog &rarr; <strong>More settings</strong> &rarr; uncheck <strong>Headers and footers</strong>.</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button size="icon-sm" variant="ghost" onClick={() => router.push("/accounting/estimates")}>
            <ChevronLeft className="size-4" />
          </Button>
          <h1 className="text-xl font-semibold flex-1">{docNumber}</h1>
          <div className="flex items-center gap-2">
            {store.contactId && (
              <Button size="sm" variant="outline" onClick={handleSendByEmail}>
                <Mail className="size-4 mr-1.5" />
                {t("sendByEmail")}
              </Button>
            )}
            {store.id && (
              <Button
                disabled={store.isConverting}
                size="sm"
                variant="outline"
                onClick={() => void handleConvertToInvoice()}
              >
                <Copy className="size-4 mr-1.5" />
                {t("convertToInvoice")}
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <FileDown className="size-4 mr-1.5" />
              {t("exportPdf")}
            </Button>
            {store.id && (
              <Button
                disabled={store.isDeleting}
                size="sm"
                variant="ghost"
                onClick={() => void handleDelete()}
              >
                <Trash2 className="size-4 mr-1.5" />
                {t("deleteEstimate")}
              </Button>
            )}
            <Button disabled={store.isSaving} size="sm" onClick={() => void handleSave()}>
              <Save className="size-4 mr-1.5" />
              {t("save")}
            </Button>
          </div>
        </div>

        {/* Top fields */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <FormLabel>{t("status")}</FormLabel>
            <Select
              value={store.status}
              onValueChange={(v) => store.setField("status", v as typeof store.status)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`statuses.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <FormLabel>{t("dueDate")}</FormLabel>
            <Input
              type="date"
              value={store.dueDate ? store.dueDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                store.setField("dueDate", e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>

          <div className="space-y-1.5">
            <FormLabel>{t("contact")}</FormLabel>
            <Select
              value={store.contactId ?? "__none__"}
              onValueChange={(v) => store.setField("contactId", v === "__none__" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">—</SelectItem>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <FormLabel>{t("deal")}</FormLabel>
            <Select
              value={store.dealId ?? "__none__"}
              onValueChange={(v) => store.setField("dealId", v === "__none__" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">—</SelectItem>
                {deals.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Line items */}
        <div className="space-y-2">
          <h2 className="text-sm font-medium">{t("lineItems")}</h2>
          <div className="rounded-md border border-input overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t("description")}</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground w-24">{t("quantity")}</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground w-32">{t("unitPrice")}</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground w-32">{t("total")}</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {store.lineItems.map((li) => (
                  <tr key={li._key}>
                    <td className="px-2 py-1.5">
                      <Input
                        className="h-8 border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:border-ring"
                        placeholder={t("description")}
                        value={li.description}
                        onChange={(e) => store.updateLineItem(li._key, "description", e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        className="h-8 border-none shadow-none bg-transparent focus-visible:ring-0 text-right tabular-nums"
                        inputMode="decimal"
                        value={li.quantity}
                        onChange={(e) => store.updateLineItem(li._key, "quantity", parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input
                        className="h-8 border-none shadow-none bg-transparent focus-visible:ring-0 text-right tabular-nums"
                        inputMode="decimal"
                        value={li.unitPrice}
                        onChange={(e) => store.updateLineItem(li._key, "unitPrice", parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td suppressHydrationWarning className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {intlStore.formatCurrency((li.quantity || 0) * (li.unitPrice || 0))}
                    </td>
                    <td className="px-1 py-1.5 text-center">
                      <Button
                        className="size-7 text-muted-foreground hover:text-destructive"
                        size="icon"
                        variant="ghost"
                        onClick={() => store.removeLineItem(li._key)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-3 py-2 border-t border-input">
              <Button size="sm" variant="ghost" onClick={() => store.addLineItem()}>
                <Plus className="size-3.5 mr-1" />
                {t("addLineItem")}
              </Button>
            </div>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-1.5 pt-2">
            <div className="flex items-center gap-8 text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span suppressHydrationWarning className="tabular-nums w-32 text-right">{intlStore.formatCurrency(store.subtotal)}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{t("taxPercent")}</span>
              <div className="w-24">
                <Input
                  className="h-7 text-right tabular-nums text-xs"
                  inputMode="decimal"
                  value={store.taxPercent}
                  onChange={(e) => store.setField("taxPercent", parseFloat(e.target.value) || 0)}
                />
              </div>
              <span suppressHydrationWarning className="tabular-nums w-32 text-right">{intlStore.formatCurrency(store.grandTotal - store.subtotal)}</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold border-t border-input pt-1.5">
              <span>{t("grandTotal")}</span>
              <span suppressHydrationWarning className="tabular-nums w-32 text-right">{intlStore.formatCurrency(store.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <FormLabel>{t("notes")}</FormLabel>
          <Textarea
            className="resize-none"
            placeholder={t("notes")}
            rows={3}
            value={store.notes ?? ""}
            onChange={(e) => store.setField("notes", e.target.value || null)}
          />
        </div>
      </div>
    </>
  );
});
