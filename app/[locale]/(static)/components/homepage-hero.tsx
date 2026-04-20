"use client";

import type { Hero } from "@/core/fumadocs/schemas/homepage";

import { Button } from "@/components/ui/button";
import { WaveDecoration } from "@/components/marketing/wave-decoration";

import { EuropeanFlagIcon } from "./european-flag-icon";
import { GitHubStarButton } from "./github-star-button";

import { AppLink } from "@/components/shared/app-link";

type Props = {
  heroSection: Hero;
};

export function HomepageHero({ heroSection }: Props) {
  return (
    <div className="relative isolate flex w-full flex-col items-center">
      <WaveDecoration
        className="-top-20 -left-40 w-[min(1080px,92vw)] md:-top-32 md:-left-56"
        opacity={0.55}
        variant="wave-1"
      />

      <WaveDecoration
        className="-top-8 right-0 hidden w-[min(720px,55vw)] md:block md:-top-4 md:-right-16"
        opacity={0.35}
        variant="wave-2"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 z-[5] h-[860px] bg-[radial-gradient(ellipse_65%_75%_at_50%_45%,color-mix(in_oklab,var(--background)_95%,transparent)_0%,color-mix(in_oklab,var(--background)_85%,transparent)_20%,color-mix(in_oklab,var(--background)_60%,transparent)_45%,color-mix(in_oklab,var(--background)_30%,transparent)_65%,color-mix(in_oklab,var(--background)_10%,transparent)_85%,transparent_100%)]"
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <GitHubStarButton />

        <h1 className="text-x-4xl px-4 max-w-4xl text-center">
          <span className="block">{heroSection.title}</span>

          {heroSection.titleAccent && (
            <span className="block font-serif italic text-primary mt-1">{heroSection.titleAccent}</span>
          )}
        </h1>

        <h2 className="text-x-lg pt-4 md:pt-6 px-4 max-w-4xl text-center text-subdued">
          {heroSection.subtitle}

          <EuropeanFlagIcon />
        </h2>

        <div className="flex flex-col items-center my-8 md:my-10 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto">
            <Button asChild className="w-full sm:w-auto shadow-lg" size="lg">
              <AppLink href={heroSection.buttonLeftHref}>{heroSection.buttonLeftText}</AppLink>
            </Button>

            <Button asChild className="w-full sm:w-auto" size="lg" variant="outline">
              <AppLink external href={heroSection.buttonRightHref}>
                {heroSection.buttonRightText}
              </AppLink>
            </Button>
          </div>

          <p className="text-subdued text-x-sm flex items-center justify-center gap-2 mt-6 text-center">
            {heroSection.startFree}
          </p>
        </div>
      </div>
    </div>
  );
}
