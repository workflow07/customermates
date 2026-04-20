"use client";

import { ShowcaseFrame } from "@/components/marketing/showcase-frame";
import { AppImage } from "@/components/shared/app-image";

export function AutomationDemo() {
  return (
    <ShowcaseFrame>
      <AppImage
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
