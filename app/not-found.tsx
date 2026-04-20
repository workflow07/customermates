import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

import { AppCard } from "../components/card/app-card";
import { AppCardBody } from "../components/card/app-card-body";
import { AppCardFooter } from "../components/card/app-card-footer";
import { CardHeroHeader } from "../components/card/card-hero-header";
import { AppLink } from "../components/shared/app-link";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFoundPage");

  return (
    <div className="size-full flex flex-1 items-center justify-center p-4">
      <AppCard className="max-w-md">
        <CardHeroHeader subtitle={t("subtitle")} title={t("title")} />

        <AppCardBody>
          <p className="text-x-sm text-center">{t("body")}</p>
        </AppCardBody>

        <AppCardFooter>
          <Button asChild className="w-full">
            <AppLink href="/">{t("ctaLabel")}</AppLink>
          </Button>
        </AppCardFooter>
      </AppCard>
    </div>
  );
}
