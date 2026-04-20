import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { AutomationHero } from "./components/automation-hero";
import { AutomationDemo } from "./components/automation-demo";
import { AutomationBenefits } from "./components/automation-benefits";
import { AutomationPricing } from "./components/automation-pricing";

import { CTASection } from "@/components/marketing/cta-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { FeatureSection } from "@/components/marketing/feature-section";
import { Footer } from "@/app/components/footer";
import { generateMetadataFromMeta } from "@/core/fumadocs/metadata";
import { automationSource, pricingSource } from "@/core/fumadocs/source";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromMeta({ locale, route: "/n8n-crm" });
}

export default async function AutomationPage() {
  const locale = await getLocale();
  const automationPage = automationSource.getPage(["automation"], locale);
  const pricingPage = pricingSource.getPage(["pricing"], locale);

  if (!automationPage) notFound();

  const { hero, benefits, features, pricingTitle, faq, cta } = automationPage.data;
  const pricingData = pricingPage?.data.pricing;

  return (
    <div className="flex flex-col items-center justify-center">
      <AutomationHero {...hero} />

      <AutomationDemo />

      <AutomationBenefits benefitsSection={benefits} />

      <FeatureSection {...features} />

      {pricingData && pricingTitle && (
        <AutomationPricing pricingSection={pricingData} pricingSectionTitle={pricingTitle} />
      )}

      <FAQSection {...faq} />

      <CTASection {...cta} />

      <Footer />
    </div>
  );
}
