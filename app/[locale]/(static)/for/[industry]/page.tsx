import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { Footer } from "@/app/components/footer";
import { PageHero } from "@/components/page-hero";
import { XCTASection } from "@/components/x-cta-section";
import { ShowcaseFrame } from "@/components/showcase-frame";
import { XImage } from "@/components/x-image";
import { generateMetadataFromMeta } from "@/core/fumadocs/metadata";
import { forPagesSource } from "@/core/fumadocs/source";
import { getMDXComponents } from "@/core/fumadocs/mdx-components";
import { XTOC } from "@/components/x-toc";

interface Props {
  params: Promise<{
    locale: string;
    industry: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, industry } = await params;

  return generateMetadataFromMeta({
    locale,
    route: "/for/:industry",
    params: { industry },
  });
}

export default async function ForIndustryPage({ params }: Props) {
  const locale = await getLocale();
  const { industry } = await params;
  const page = forPagesSource.getPage([industry], locale);

  if (!page) notFound();

  const MDX = page.data.body;
  const components = getMDXComponents();

  return (
    <div className="relative flex flex-col items-center justify-center pt-16 md:pt-24">
      <PageHero {...page.data.hero} />

      <div className="w-full max-w-6xl mx-auto px-4 mb-8">
        <ShowcaseFrame className="mb-0">
          <XImage
            isLocalized
            alt={page.data.hero.title}
            className="w-full h-auto rounded-none"
            height={1080}
            loading="eager"
            src={`${industry}.png`}
            width={1920}
          />
        </ShowcaseFrame>
      </div>

      <section className="py-12 md:py-16 w-full max-w-6xl mx-auto px-4">
        <XTOC items={page.data.toc}>
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
            <MDX components={components} />
          </div>
        </XTOC>
      </section>

      <XCTASection {...page.data.cta} />

      <Footer />
    </div>
  );
}
