"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { triggerServerErrorAction } from "./actions";

import { Button } from "@/components/ui/button";
import { CenteredCardPage } from "@/components/shared/centered-card-page";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { CardHeroHeader } from "@/components/card/card-hero-header";

export default function ErrorTestPage() {
  const t = useTranslations("ErrorTestPage");
  const [loading, setLoading] = useState(false);

  function triggerUnexpectedClientError() {
    throw new Error("Test client-side error - should trigger XUnexpectedErrorToaster");
  }

  async function triggerUnexpectedServerError() {
    setLoading(true);
    await triggerServerErrorAction();
    setLoading(false);
  }

  return (
    <CenteredCardPage>
      <AppCard className="max-w-md">
        <CardHeroHeader subtitle={t("subtitle")} title={t("title")} />

        <AppCardBody>
          <div className="space-y-6">
            <div className="border-t border-border pt-6">
              <h3 className="text-x-lg mb-2">{t("clientSideErrors.title")}</h3>

              <p className="text-x-sm text-subdued mb-4">{t("clientSideErrors.description")}</p>

              <Button className="w-full" variant="destructive" onClick={triggerUnexpectedClientError}>
                {t("clientSideErrors.triggerClientError")}
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-x-lg mb-2">{t("serverSideError.title")}</h3>

              <p className="text-x-sm text-subdued mb-4">{t("serverSideError.description")}</p>

              <Button
                className="w-full"
                disabled={loading}
                variant="destructive"
                onClick={() => {
                  void triggerUnexpectedServerError();
                }}
              >
                {t("serverSideError.triggerServerError")}
              </Button>
            </div>
          </div>
        </AppCardBody>
      </AppCard>
    </CenteredCardPage>
  );
}
