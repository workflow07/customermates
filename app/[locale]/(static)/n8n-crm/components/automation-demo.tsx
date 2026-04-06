"use client";

import { ShowcaseFrame } from "@/components/showcase-frame";
import { XImage } from "@/components/x-image";

export function AutomationDemo() {
  return (
    <ShowcaseFrame>
      <XImage
        alt="Customermates CRM automation workflow with n8n integration"
        className="w-full h-auto rounded-none"
        height={1080}
        loading="eager"
        src="automation-hero.png"
        width={1920}
      />
    </ShowcaseFrame>
  );
}
