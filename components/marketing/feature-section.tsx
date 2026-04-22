"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SectionBadge } from "@/components/marketing/section-badge";
import { WaveDecoration } from "@/components/marketing/wave-decoration";
import { FeatureIcon } from "@/components/shared/feature-icon";
import { ICONS } from "@/components/shared/icons";
import { AppImage } from "@/components/shared/app-image";

type FeatureItem = {
  description: string;
  icon: string;
  image?: string;
  title: string;
};

type Props = {
  badge: string;
  features: FeatureItem[];
  subtitle: string;
  title: string;
};

export function FeatureSection({ badge, features, subtitle, title }: Props) {
  return (
    <section className="relative isolate w-full max-w-6xl px-4 py-14 md:py-20" id="features">
      <WaveDecoration className="-right-40 top-10 hidden w-[min(820px,70%)] md:block" opacity={0.3} variant="wave-2" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-5 h-80 bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,var(--background)_0%,color-mix(in_oklab,var(--background)_80%,transparent)_40%,transparent_95%)]"
      />

      <div className="relative z-10 mb-10 text-center md:mb-16">
        <SectionBadge className="mb-4">{badge}</SectionBadge>

        <h2 className="text-x-3xl">{title}</h2>

        <p className="text-x-xl mx-auto mt-4 max-w-2xl text-subdued">{subtitle}</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {features.map((feature, index) => {
          const Icon = ICONS[feature.icon];

          return (
            <Card key={index} className="w-full py-4">
              <CardContent className={feature.image ? "flex flex-col gap-2" : "flex flex-col gap-3"}>
                <FeatureIcon icon={Icon} />

                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base font-semibold">{feature.title}</h3>

                  <p className="text-[13px] leading-normal text-subdued">{feature.description}</p>
                </div>

                {feature.image ? (
                  <AppImage
                    alt={feature.title}
                    className="mt-1 aspect-2/1 w-full rounded-md object-cover object-top"
                    height={900}
                    src={feature.image}
                    width={1516}
                  />
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
