"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { resendVerificationEmailAction } from "../actions";

import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardFooter } from "@/components/card/app-card-footer";
import { CardHeroHeader } from "@/components/card/card-hero-header";

export function VerifyEmailCard({ email }: { email?: string }) {
  const t = useTranslations("VerifyEmailCard");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleResend() {
    if (!email) return;

    setIsLoading(true);
    try {
      await resendVerificationEmailAction(email);
      setIsSent(true);
      toast.success(t("resendSuccess"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppCard className="max-w-md">
      <CardHeroHeader subtitle={t("subtitle")} title={t("title")} />

      <AppCardBody>
        <p className="text-x-sm text-center">{t("body")}</p>
      </AppCardBody>

      <AppCardFooter>
        <Button className="w-full" disabled={isSent || !email || isLoading} onClick={() => void handleResend()}>
          {t("ctaLabel")}
        </Button>
      </AppCardFooter>
    </AppCard>
  );
}
