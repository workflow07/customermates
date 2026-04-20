"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardFooter } from "@/components/card/app-card-footer";
import { CardHeroHeader } from "@/components/card/card-hero-header";
import { checkPendingStatusAndRedirect } from "@/app/[locale]/actions";

export function PendingCard() {
  const t = useTranslations("");

  useEffect(() => void checkPendingStatusAndRedirect(), []);

  return (
    <div className="size-full flex flex-1 items-center justify-center p-4">
      <AppCard className="max-w-md">
        <CardHeroHeader subtitle={t("PendingCard.subtitle")} title={t("PendingCard.title")} />

        <AppCardBody>
          <p className="text-x-sm text-center">{t("PendingCard.body")}</p>
        </AppCardBody>

        <AppCardFooter>
          <Button className="w-full" onClick={() => void checkPendingStatusAndRedirect()}>
            {t("Common.actions.refresh")}
          </Button>
        </AppCardFooter>
      </AppCard>
    </div>
  );
}
