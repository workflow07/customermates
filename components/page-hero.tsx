"use client";

import { Button } from "@heroui/button";

import { GitHubStarButton } from "@/app/[locale]/(static)/components/github-star-button";
import { XLink } from "@/components/x-link";

type Props = {
  buttonLeftHref: string;
  buttonLeftText: string;
  buttonRightHref: string;
  buttonRightText: string;
  description: string;
  hint: string;
  title: string;
};

export function PageHero({
  title,
  description,
  buttonLeftHref,
  buttonLeftText,
  buttonRightHref,
  buttonRightText,
  hint,
}: Props) {
  return (
    <>
      <GitHubStarButton />

      <h1 className="text-x-4xl px-4 max-w-4xl text-center mx-auto">{title}</h1>

      <h2 className="text-x-lg pt-4 md:pt-6 px-4 max-w-4xl text-center text-subdued mx-auto">{description}</h2>

      <div className="flex flex-col items-center my-8 md:my-10 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto">
          <Button
            as={XLink}
            className="w-full sm:w-auto"
            color="primary"
            href={buttonLeftHref}
            size="lg"
            variant="shadow"
          >
            {buttonLeftText}
          </Button>

          <Button
            as={XLink}
            className="w-full sm:w-auto"
            href={buttonRightHref}
            size="lg"
            target="_blank"
            variant="bordered"
          >
            {buttonRightText}
          </Button>
        </div>

        <p className="text-subdued text-x-sm flex items-center justify-center gap-2 mt-6 text-center">{hint}</p>
      </div>
    </>
  );
}
