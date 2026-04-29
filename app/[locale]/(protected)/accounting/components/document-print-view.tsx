const ACCENT = "#5e4ae3";
const GRAY = "#6b6b6d";
const BORDER = "#d1d1d6";

export type PrintCompany = {
  name?: string | null;
  logoUrl?: string | null;
  street?: string | null;
  city?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  vatNumber?: string | null;
};

export type PrintContact = {
  firstName: string;
  lastName: string;
  emails: string[];
};

export type PrintLineItem = {
  _key: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type PrintLabels = {
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
};

type Props = {
  docNumber: string;
  createdAt: Date | null;
  dueDate: Date | null;
  statusLabel: string;
  lineItems: PrintLineItem[];
  subtotal: number;
  taxPercent: number;
  grandTotal: number;
  contact: PrintContact | null;
  company: PrintCompany | null;
  formatCurrency: (n: number) => string;
  formatDate: (d: Date) => string;
  labels: PrintLabels;
};

export function DocumentPrintView({
  docNumber,
  createdAt,
  dueDate,
  statusLabel,
  lineItems,
  subtotal,
  taxPercent,
  grandTotal,
  contact,
  company,
  formatCurrency,
  formatDate,
  labels,
}: Props) {
  const taxAmount = grandTotal - subtotal;
  const companyInitial = company?.name?.[0]?.toUpperCase() ?? "?";
  const cityLine = [company?.city, company?.postalCode].filter(Boolean).join(", ");

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#111",
        fontSize: "11px",
        lineHeight: "1.5",
        background: "#fff",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: "3px", backgroundColor: ACCENT, marginBottom: "18px" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
        {/* Company */}
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", maxWidth: "55%" }}>
          {company?.logoUrl ? (
            <img
              alt="logo"
              src={company.logoUrl}
              style={{ height: "38px", width: "auto", objectFit: "contain", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "4px",
                border: `1px solid ${BORDER}`,
                color: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {companyInitial}
            </div>
          )}
          <div>
            {company?.name && (
              <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "2px" }}>{company.name}</div>
            )}
            {company?.street && <div style={{ color: GRAY, fontSize: "10px" }}>{company.street}</div>}
            {cityLine && <div style={{ color: GRAY, fontSize: "10px" }}>{cityLine}</div>}
            {company?.phone && <div style={{ color: GRAY, fontSize: "10px" }}>{company.phone}</div>}
            {company?.email && <div style={{ color: GRAY, fontSize: "10px" }}>{company.email}</div>}
            {company?.vatNumber && (
              <div style={{ color: GRAY, fontSize: "10px" }}>
                {labels.vat}: {company.vatNumber}
              </div>
            )}
          </div>
        </div>

        {/* Document type + number */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: ACCENT, letterSpacing: "-0.5px", lineHeight: "1.1" }}>
            {labels.docTypeLabel}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "600", marginTop: "3px", color: "#333" }}>{docNumber}</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: "14px" }} />

      {/* Bill To + Dates */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <div
            style={{
              fontSize: "8px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              color: GRAY,
              marginBottom: "4px",
            }}
          >
            {labels.billTo}
          </div>
          {contact ? (
            <>
              <div style={{ fontWeight: "600", fontSize: "12px" }}>
                {contact.firstName} {contact.lastName}
              </div>
              {contact.emails[0] && <div style={{ color: GRAY, fontSize: "10px" }}>{contact.emails[0]}</div>}
            </>
          ) : (
            <div style={{ color: "#aaa" }}>—</div>
          )}
        </div>

        <div style={{ fontSize: "10px", textAlign: "right" as const }}>
          {createdAt && (
            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginBottom: "2px" }}>
              <span style={{ color: GRAY }}>{labels.date}</span>
              <span style={{ fontWeight: "500", minWidth: "100px", textAlign: "right" as const }}>
                {formatDate(createdAt)}
              </span>
            </div>
          )}
          {dueDate && (
            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginBottom: "2px" }}>
              <span style={{ color: GRAY }}>{labels.dueDate}</span>
              <span style={{ fontWeight: "500", minWidth: "100px", textAlign: "right" as const }}>
                {formatDate(dueDate)}
              </span>
            </div>
          )}
          <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
            <span style={{ color: GRAY }}>{labels.status}</span>
            <span style={{ fontWeight: "500", minWidth: "100px", textAlign: "right" as const }}>{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Line items table */}
      <table style={{ width: "100%", borderCollapse: "collapse" as const, marginBottom: "0" }}>
        <thead>
          <tr>
            <th
              style={{
                padding: "6px 8px",
                textAlign: "left" as const,
                fontWeight: "700",
                fontSize: "9px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                color: GRAY,
                borderBottom: `1.5px solid ${ACCENT}`,
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              {labels.description}
            </th>
            <th
              style={{
                padding: "6px 8px",
                textAlign: "right" as const,
                fontWeight: "700",
                fontSize: "9px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                color: GRAY,
                borderBottom: `1.5px solid ${ACCENT}`,
                borderTop: `1px solid ${BORDER}`,
                width: "60px",
              }}
            >
              {labels.quantity}
            </th>
            <th
              style={{
                padding: "6px 8px",
                textAlign: "right" as const,
                fontWeight: "700",
                fontSize: "9px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                color: GRAY,
                borderBottom: `1.5px solid ${ACCENT}`,
                borderTop: `1px solid ${BORDER}`,
                width: "100px",
              }}
            >
              {labels.unitPrice}
            </th>
            <th
              style={{
                padding: "6px 8px",
                textAlign: "right" as const,
                fontWeight: "700",
                fontSize: "9px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                color: GRAY,
                borderBottom: `1.5px solid ${ACCENT}`,
                borderTop: `1px solid ${BORDER}`,
                width: "100px",
              }}
            >
              {labels.total}
            </th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((li) => (
            <tr key={li._key}>
              <td style={{ padding: "7px 8px", borderBottom: `1px solid ${BORDER}` }}>{li.description}</td>
              <td style={{ padding: "7px 8px", textAlign: "right" as const, borderBottom: `1px solid ${BORDER}`, fontVariantNumeric: "tabular-nums" }}>
                {li.quantity}
              </td>
              <td style={{ padding: "7px 8px", textAlign: "right" as const, borderBottom: `1px solid ${BORDER}`, fontVariantNumeric: "tabular-nums" }}>
                {formatCurrency(li.unitPrice)}
              </td>
              <td style={{ padding: "7px 8px", textAlign: "right" as const, borderBottom: `1px solid ${BORDER}`, fontVariantNumeric: "tabular-nums" }}>
                {formatCurrency(li.quantity * li.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "12px 0 14px" }}>
        <div style={{ width: "240px", fontSize: "11px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ color: GRAY }}>{labels.subtotal}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ color: GRAY }}>{labels.tax} ({taxPercent}%)</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(taxAmount)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 8px",
              fontWeight: "700",
              fontSize: "13px",
              borderTop: `2px solid ${ACCENT}`,
              marginTop: "2px",
            }}
          >
            <span>{labels.grandTotal}</span>
            <span style={{ color: ACCENT, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${BORDER}`,
          paddingTop: "10px",
          textAlign: "center" as const,
          color: GRAY,
          fontSize: "10px",
        }}
      >
        <div style={{ fontWeight: "600", color: "#333" }}>{labels.thankYou}</div>
        {company?.website && <div style={{ marginTop: "2px" }}>{company.website}</div>}
      </div>
    </div>
  );
}
