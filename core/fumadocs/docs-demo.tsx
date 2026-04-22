"use client";

import { BrowserFrame } from "@/components/marketing/browser-frame";

type Props = {
  src: string;
  title: string;
};

export function DocsDemo({ src, title }: Props) {
  return <BrowserFrame src={src} title={title} />;
}
