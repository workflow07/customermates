import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { Footer } from "@/app/components/footer";
import { generateMetadataFromMeta } from "@/core/fumadocs/metadata";
import { legalSource } from "@/core/fumadocs/source";
import { getMDXComponents } from "@/core/fumadocs/mdx-components";
import { Toc } from "@/components/shared/toc";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromMeta({ locale, route: "/imprint" });
}

export default async function ImprintPage() {
  const locale = await getLocale();
  const page = legalSource.getPage(["imprint"], locale);

  if (!page) notFound();

  const MDX = page.data.body;
  const components = getMDXComponents();

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="pt-12 md:pt-16 pb-16 md:pb-24 w-full">
        <article className="max-w-6xl mx-auto px-4">
          <Toc items={page.data.toc}>
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <MDX components={components} />
            </div>
          </Toc>
        </article>
      </section>

      <Footer />
    </div>
  );
}
