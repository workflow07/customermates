"use client";

import type { InvoiceDto } from "@/features/invoices/invoice.schema";
import type { ContactDto } from "@/features/contacts/contact.schema";
import type { DealDto } from "@/features/deals/deal.schema";

import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Plus, Trash2, Mail, Save, ChevronLeft, FileDown } from "lucide-react";

import { useRootStore } from "@/core/stores/root-store.provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLabel } from "@/components/forms/form-label";
import { SendContactEmailModal } from "@/app/[locale]/(protected)/contacts/components/send-contact-email-modal";
import { InvoiceDetailStore } from "./invoice-detail.store";

type Props = {
  invoice: InvoiceDto | null;
  contacts: ContactDto[];
  deals: DealDto[];
};

const STATUSES = ["draft", "sent", "paid", "overdue"] as const;

export const InvoiceDetailView = observer(({ invoice, contacts, deals }: Props) => {
  const t = useTranslations("Accounting");
  const router = useRouter();
  const { intlStore, sendContactEmailModalStore, layoutStore } = useRootStore();

  const store = useMemo(() => new InvoiceDetailStore(), []);

  useEffect(() => {
    if (invoice) store.initFromDto(invoice);
    else store.initNew();
  }, [invoice, store]);

  const docNumber = store.id && invoice
    ? `INV-${String(invoice.number).padStart(3, "0")}`
    : t("newInvoice");

  useEffect(() => {
    layoutStore.setRuntimeTitle(docNumber);
    return () => layoutStore.setRuntimeTitle(null);
  }, [docNumber, layoutStore]);

  async function handleSave() {
    const wasNew = !invoice;
    const saved = await store.save();
    if (saved && wasNew) {
      router.replace(`/accounting/invoices/${saved.id}`);
    }
  }

  async function handleDelete() {
    const ok = await store.delete();
    if (ok) router.push("/accounting/invoices");
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

      {/* Print-only layout */}
      <div className="hidden print:block print:p-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">{docNumber}</h1>
          {store.dueDate && (
            <div className="text-right text-sm">
              <div className="text-gray-500">{t("dueDate")}</div>
              <div className="font-medium">{store.dueDate.toLocaleDateString()}</div>
            </div>
          )}
        </div>

        {(selectedContact || selectedDeal) && (
          <div className="mb-6 text-sm space-y-0.5">
            {selectedContact && (
              <div>
                <span className="text-gray-500">{t("contact")}: </span>
                {selectedContact.firstName} {selectedContact.lastName}
              </div>
            )}
            {selectedDeal && (
              <div>
                <span className="text-gray-500">{t("deal")}: </span>
                {selectedDeal.name}
              </div>
            )}
          </div>
        )}

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 font-semibold">{t("description")}</th>
              <th className="text-right py-2 font-semibold w-20">{t("quantity")}</th>
              <th className="text-right py-2 font-semibold w-32">{t("unitPrice")}</th>
              <th className="text-right py-2 font-semibold w-32">{t("total")}</th>
            </tr>
          </thead>
          <tbody>
            {store.lineItems.map((li) => (
              <tr key={li._key} className="border-b border-gray-200">
                <td className="py-2">{li.description}</td>
                <td className="py-2 text-right tabular-nums">{li.quantity}</td>
                <td className="py-2 text-right tabular-nums">{intlStore.formatCurrency(li.unitPrice)}</td>
                <td className="py-2 text-right tabular-nums">
                  {intlStore.formatCurrency((li.quantity || 0) * (li.unitPrice || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">{t("subtotal")}</span>
              <span className="tabular-nums">{intlStore.formatCurrency(store.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">{t("taxPercent")} ({store.taxPercent}%)</span>
              <span className="tabular-nums">{intlStore.formatCurrency(store.grandTotal - store.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold border-t border-black pt-2">
              <span>{t("grandTotal")}</span>
              <span className="tabular-nums">{intlStore.formatCurrency(store.grandTotal)}</span>
            </div>
          </div>
        </div>

        {store.notes && (
          <div className="mt-6 text-sm">
            <div className="font-semibold mb-1">{t("notes")}</div>
            <div className="text-gray-600 whitespace-pre-wrap">{store.notes}</div>
          </div>
        )}
      </div>

      {/* Editable UI — hidden when printing */}
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full print:hidden">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button size="icon-sm" variant="ghost" onClick={() => router.push("/accounting/invoices")}>
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
                {t("deleteInvoice")}
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
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
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
              <span className="tabular-nums w-32 text-right">{intlStore.formatCurrency(store.subtotal)}</span>
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
              <span className="tabular-nums w-32 text-right">{intlStore.formatCurrency(store.grandTotal - store.subtotal)}</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold border-t border-input pt-1.5">
              <span>{t("grandTotal")}</span>
              <span className="tabular-nums w-32 text-right">{intlStore.formatCurrency(store.grandTotal)}</span>
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
