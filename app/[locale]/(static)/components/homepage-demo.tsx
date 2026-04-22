"use client";

import { useLocale } from "next-intl";

import { DocsDemo } from "@/core/fumadocs/docs-demo";

export function HomepageDemo() {
  const locale = useLocale();

  return <DocsDemo src={`https://demo.customermates.com/${locale}`} title="Customermates Demo" />;
}
