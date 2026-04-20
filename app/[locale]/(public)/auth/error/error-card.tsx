"use client";

import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppLink } from "@/components/shared/app-link";
import { AppCardFooter } from "@/components/card/app-card-footer";
import { CardHeroHeader } from "@/components/card/card-hero-header";

export const ErrorCard = observer(() => {
  const t = useTranslations("ErrorCard");
  const errorKey = useSearchParams().get("type");

  return (
    <AppCard className="max-w-md">
      <CardHeroHeader subtitle={t("subtitle")} title={t("title")} />

      <AppCardBody>
        <p className="text-x-sm text-center">{errorKey ? t(errorKey) : t("contactSupport")}</p>
      </AppCardBody>

      <AppCardFooter>
        <Button asChild className="w-full" variant="destructive">
          <AppLink href="/">{t("ctaLabel")}</AppLink>
        </Button>
      </AppCardFooter>
    </AppCard>
  );
});
