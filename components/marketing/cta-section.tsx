"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/shared/app-image";

import { WaveDecoration } from "./wave-decoration";

type Props = {
  action: string;
  buttonLeftHref: string;
  buttonLeftText: string;
  buttonRightHref: string;
  buttonRightText: string;
  description: string;
  hint: string;
  image?: ReactNode;
};

export function CTASection({
  action,
  buttonLeftHref,
  buttonLeftText,
  buttonRightHref,
  buttonRightText,
  description,
  hint,
  image,
}: Props) {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative isolate overflow-hidden rounded-3xl bg-card px-6 py-16 md:px-12 md:py-24">
          <WaveDecoration
            className="-right-16 -top-16 w-[min(720px,80%)] md:-right-24 md:-top-24"
            opacity={0.5}
            variant="wave-2"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,var(--card)_0%,color-mix(in_oklab,var(--card)_85%,transparent)_30%,color-mix(in_oklab,var(--card)_50%,transparent)_60%,transparent_95%)]"
          />

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="mx-auto px-4">
              <div className="mb-6 flex justify-center md:mb-8">
                {image ?? <AppImage alt="Customermates" height={27} src="customermates.svg" width={240} />}
              </div>
            </div>

            <h2 className="text-x-3xl mb-4 md:mb-6">{action}</h2>

            <p className="text-x-lg mx-auto mb-6 max-w-3xl text-subdued md:mb-10">{description}</p>

            <div className="mb-6 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row md:mb-8 md:gap-6">
              <Button asChild className="w-full sm:w-auto" size="lg" variant="default">
                <Link href={buttonLeftHref}>{buttonLeftText}</Link>
              </Button>

              <Button asChild className="w-full sm:w-auto" size="lg" variant="outline">
                <Link href={buttonRightHref} target="_blank">
                  {buttonRightText}
                </Link>
              </Button>
            </div>

            <p className="text-x-sm flex items-center justify-center gap-2 text-subdued">{hint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
