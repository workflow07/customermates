import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const ACCENT = "#5e4ae3";
const GRAY = "#6b6b6d";
const BORDER = "#d1d1d6";

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#111111",
    backgroundColor: "#ffffff",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },
  accentBar: { height: 3, backgroundColor: ACCENT, marginBottom: 16 },
  spaceBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  companyBlock: { maxWidth: "55%" },
  companyName: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  companyDetail: { fontSize: 9, color: GRAY },
  docBlock: { alignItems: "flex-end" },
  docTypeLabel: { fontSize: 20, fontFamily: "Helvetica-Bold", color: ACCENT, lineHeight: 1.1 },
  docNumber: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#333333", marginTop: 3 },
  divider: { borderBottomWidth: 1, borderBottomColor: BORDER, marginBottom: 12 },
  labelSmall: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GRAY, marginBottom: 3 },
  contactName: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  contactEmail: { fontSize: 9, color: GRAY },
  dash: { fontSize: 10, color: "#aaaaaa" },
  metaBlock: { alignItems: "flex-end" },
  metaRow: { flexDirection: "row", marginBottom: 2 },
  metaLabel: { fontSize: 9, color: GRAY, width: 70, textAlign: "right" },
  metaValue: { fontSize: 9, fontFamily: "Helvetica-Bold", width: 95, textAlign: "right" },
  tableHeaderRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeaderText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GRAY },
  tableDataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableText: { fontSize: 10 },
  colDesc: { flex: 1 },
  colQty: { width: 50, textAlign: "right" },
  colPrice: { width: 80, textAlign: "right" },
  colTotal: { width: 80, textAlign: "right" },
  totalsOuter: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10, marginBottom: 14 },
  totalsBox: { width: 220 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalLabel: { fontSize: 10, color: GRAY },
  totalValue: { fontSize: 10 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderTopWidth: 2,
    borderTopColor: ACCENT,
    marginTop: 2,
  },
  grandTotalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  grandTotalValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: ACCENT },
  footer: { borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8, alignItems: "center" },
  footerText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#333333" },
  footerWebsite: { fontSize: 9, color: GRAY, marginTop: 2 },
});

export type PdfDocumentProps = {
  docNumber: string;
  createdAt: Date | null;
  dueDate: Date | null;
  statusLabel: string;
  notes?: string | null;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  taxPercent: number;
  grandTotal: number;
  contact: { firstName: string; lastName: string; emails: string[] } | null;
  company: {
    name?: string | null;
    street?: string | null;
    city?: string | null;
    postalCode?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    vatNumber?: string | null;
  } | null;
  formatCurrency: (n: number) => string;
  formatDate: (d: Date) => string;
  labels: {
    docTypeLabel: string;
    billTo: string;
    date: string;
    dueDate: string;
    status: string;
    description: string;
    quantity: string;
    unitPrice: string;
    total: string;
    subtotal: string;
    tax: string;
    grandTotal: string;
    thankYou: string;
    vat: string;
    notes: string;
  };
};

export function InvoicePdfDocument({
  docNumber,
  createdAt,
  dueDate,
  statusLabel,
  notes,
  lineItems,
  subtotal,
  taxPercent,
  grandTotal,
  contact,
  company,
  formatCurrency,
  formatDate,
  labels,
}: PdfDocumentProps) {
  const taxAmount = grandTotal - subtotal;
  const cityLine = [company?.city, company?.postalCode].filter(Boolean).join(", ");

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        {/* Accent bar */}
        <View style={S.accentBar} />

        {/* Header: company (left) + doc type/number (right) */}
        <View style={[S.spaceBetween, { marginBottom: 16 }]}>
          <View style={S.companyBlock}>
            {!!company?.name && <Text style={S.companyName}>{company.name}</Text>}
            {!!company?.street && <Text style={S.companyDetail}>{company.street}</Text>}
            {!!cityLine && <Text style={S.companyDetail}>{cityLine}</Text>}
            {!!company?.phone && <Text style={S.companyDetail}>{company.phone}</Text>}
            {!!company?.email && <Text style={S.companyDetail}>{company.email}</Text>}
            {!!company?.vatNumber && (
              <Text style={S.companyDetail}>{labels.vat}: {company.vatNumber}</Text>
            )}
          </View>
          <View style={S.docBlock}>
            <Text style={S.docTypeLabel}>{labels.docTypeLabel}</Text>
            <Text style={S.docNumber}>{docNumber}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={S.divider} />

        {/* Bill To + Dates */}
        <View style={[S.spaceBetween, { marginBottom: 14 }]}>
          <View>
            <Text style={S.labelSmall}>{labels.billTo.toUpperCase()}</Text>
            {contact ? (
              <View>
                <Text style={S.contactName}>{contact.firstName} {contact.lastName}</Text>
                {!!contact.emails[0] && <Text style={S.contactEmail}>{contact.emails[0]}</Text>}
              </View>
            ) : (
              <Text style={S.dash}>—</Text>
            )}
          </View>
          <View style={S.metaBlock}>
            {createdAt && (
              <View style={S.metaRow}>
                <Text style={S.metaLabel}>{labels.date}</Text>
                <Text style={S.metaValue}>{formatDate(createdAt)}</Text>
              </View>
            )}
            {dueDate && (
              <View style={S.metaRow}>
                <Text style={S.metaLabel}>{labels.dueDate}</Text>
                <Text style={S.metaValue}>{formatDate(dueDate)}</Text>
              </View>
            )}
            <View style={S.metaRow}>
              <Text style={S.metaLabel}>{labels.status}</Text>
              <Text style={S.metaValue}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        {/* Line items table */}
        <View style={S.tableHeaderRow}>
          <Text style={[S.tableHeaderText, S.colDesc]}>{labels.description.toUpperCase()}</Text>
          <Text style={[S.tableHeaderText, S.colQty]}>{labels.quantity.toUpperCase()}</Text>
          <Text style={[S.tableHeaderText, S.colPrice]}>{labels.unitPrice.toUpperCase()}</Text>
          <Text style={[S.tableHeaderText, S.colTotal]}>{labels.total.toUpperCase()}</Text>
        </View>
        {lineItems.map((li, i) => (
          <View key={i} style={S.tableDataRow}>
            <Text style={[S.tableText, S.colDesc]}>{li.description}</Text>
            <Text style={[S.tableText, S.colQty]}>{String(li.quantity)}</Text>
            <Text style={[S.tableText, S.colPrice]}>{formatCurrency(li.unitPrice)}</Text>
            <Text style={[S.tableText, S.colTotal]}>{formatCurrency(li.quantity * li.unitPrice)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={S.totalsOuter}>
          <View style={S.totalsBox}>
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>{labels.subtotal}</Text>
              <Text style={S.totalValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>{labels.tax} ({taxPercent}%)</Text>
              <Text style={S.totalValue}>{formatCurrency(taxAmount)}</Text>
            </View>
            <View style={S.grandTotalRow}>
              <Text style={S.grandTotalLabel}>{labels.grandTotal}</Text>
              <Text style={S.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {!!notes && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[S.labelSmall, { marginBottom: 4 }]}>{labels.notes.toUpperCase()}</Text>
            <Text style={{ fontSize: 9, color: "#333333", lineHeight: 1.6 }}>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={S.footer}>
          <Text style={S.footerText}>{labels.thankYou}</Text>
          {!!company?.website && <Text style={S.footerWebsite}>{company.website}</Text>}
        </View>
      </Page>
    </Document>
  );
}
