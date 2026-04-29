import type { PdfDocumentProps } from "./document-pdf";
import React from "react";

async function buildBlob(props: PdfDocumentProps): Promise<Blob> {
  const [{ pdf }, { InvoicePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./document-pdf"),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pdf(React.createElement(InvoicePdfDocument, props) as React.ReactElement<any>).toBlob();
}

export async function downloadPdf(props: PdfDocumentProps, filename: string): Promise<void> {
  const blob = await buildBlob(props);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function generatePdfBase64(props: PdfDocumentProps): Promise<string> {
  const blob = await buildBlob(props);
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
