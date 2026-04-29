const ACCENT = "#5e4ae3";
const GRAY = "#6b6b6d";
const BORDER = "#d1d1d6";

type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type Params = {
  docTypeLabel: string;
  docNumber: string;
  company: { name?: string | null } | null;
  contact: { firstName: string; lastName: string } | null;
  notes?: string | null;
  lineItems: LineItem[];
  subtotal: number;
  taxPercent: number;
  grandTotal: number;
  formatCurrency: (n: number) => string;
  createdAt: Date | null;
  dueDate: Date | null;
  formatDate: (d: Date) => string;
  statusLabel: string;
  labels: {
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
    notes: string;
  };
};

function esc(str: string | number): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildDocumentEmailHtml(p: Params): string {
  const taxAmount = p.grandTotal - p.subtotal;

  const lineItemRows = p.lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding:7px 8px;border-bottom:1px solid ${BORDER};">${esc(li.description)}</td>
        <td style="padding:7px 8px;text-align:right;border-bottom:1px solid ${BORDER};">${esc(li.quantity)}</td>
        <td style="padding:7px 8px;text-align:right;border-bottom:1px solid ${BORDER};">${esc(p.formatCurrency(li.unitPrice))}</td>
        <td style="padding:7px 8px;text-align:right;border-bottom:1px solid ${BORDER};">${esc(p.formatCurrency(li.quantity * li.unitPrice))}</td>
      </tr>`,
    )
    .join("");

  const metaRows = [
    p.createdAt ? `<div style="margin-bottom:2px;">${esc(p.labels.date)}: <strong style="color:#111;">${esc(p.formatDate(p.createdAt))}</strong></div>` : "",
    p.dueDate ? `<div style="margin-bottom:2px;">${esc(p.labels.dueDate)}: <strong style="color:#111;">${esc(p.formatDate(p.dueDate))}</strong></div>` : "",
    `<div>${esc(p.labels.status)}: <strong style="color:#111;">${esc(p.statusLabel)}</strong></div>`,
  ]
    .filter(Boolean)
    .join("");

  const billTo = p.contact
    ? `<div style="margin-bottom:16px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${GRAY};margin-bottom:4px;">${esc(p.labels.billTo)}</div>
        <div style="font-weight:600;">${esc(p.contact.firstName)} ${esc(p.contact.lastName)}</div>
      </div>`
    : "";

  return `
<div style="margin-top:32px;border-top:2px solid ${ACCENT};padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111;line-height:1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px;">
    <tr>
      <td style="vertical-align:top;">
        <div style="font-size:22px;font-weight:800;color:${ACCENT};line-height:1.1;">${esc(p.docTypeLabel)}</div>
        <div style="font-size:13px;font-weight:600;color:#333;margin-top:4px;">${esc(p.docNumber)}</div>
      </td>
      <td align="right" style="vertical-align:top;font-size:11px;color:${GRAY};">${metaRows}</td>
    </tr>
  </table>

  ${billTo}

  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <thead>
      <tr>
        <th style="padding:6px 8px;text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${GRAY};border-top:1px solid ${BORDER};border-bottom:1.5px solid ${ACCENT};">${esc(p.labels.description)}</th>
        <th style="padding:6px 8px;text-align:right;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${GRAY};border-top:1px solid ${BORDER};border-bottom:1.5px solid ${ACCENT};width:60px;">${esc(p.labels.quantity)}</th>
        <th style="padding:6px 8px;text-align:right;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${GRAY};border-top:1px solid ${BORDER};border-bottom:1.5px solid ${ACCENT};width:100px;">${esc(p.labels.unitPrice)}</th>
        <th style="padding:6px 8px;text-align:right;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${GRAY};border-top:1px solid ${BORDER};border-bottom:1.5px solid ${ACCENT};width:100px;">${esc(p.labels.total)}</th>
      </tr>
    </thead>
    <tbody>${lineItemRows}</tbody>
  </table>

  <table align="right" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:12px;min-width:240px;font-size:11px;">
    <tr>
      <td style="padding:4px 8px;color:${GRAY};border-bottom:1px solid ${BORDER};">${esc(p.labels.subtotal)}</td>
      <td style="padding:4px 8px;text-align:right;border-bottom:1px solid ${BORDER};">${esc(p.formatCurrency(p.subtotal))}</td>
    </tr>
    <tr>
      <td style="padding:4px 8px;color:${GRAY};border-bottom:1px solid ${BORDER};">${esc(p.labels.tax)} (${esc(p.taxPercent)}%)</td>
      <td style="padding:4px 8px;text-align:right;border-bottom:1px solid ${BORDER};">${esc(p.formatCurrency(taxAmount))}</td>
    </tr>
    <tr>
      <td style="padding:6px 8px;font-weight:700;font-size:14px;border-top:2px solid ${ACCENT};">${esc(p.labels.grandTotal)}</td>
      <td style="padding:6px 8px;text-align:right;font-weight:700;font-size:14px;color:${ACCENT};border-top:2px solid ${ACCENT};">${esc(p.formatCurrency(p.grandTotal))}</td>
    </tr>
  </table>

  ${p.notes ? `<div style="clear:both;margin-top:24px;padding-top:16px;border-top:1px solid ${BORDER};">
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${GRAY};margin-bottom:6px;">${esc(p.labels.notes)}</div>
    <div style="font-size:12px;color:#333;line-height:1.6;white-space:pre-wrap;">${esc(p.notes)}</div>
  </div>` : ""}
</div>`;
}
