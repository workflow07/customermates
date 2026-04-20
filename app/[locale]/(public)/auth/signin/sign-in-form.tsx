"use client";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { continueWithGoogleAction, continueWithMicrosoftAction } from "../actions";

import SignInProviderButton from "./sign-in-provider-button";

import { AppLink } from "@/components/shared/app-link";
import { FormInput } from "@/components/forms/form-input";
import { useRootStore } from "@/core/stores/root-store.provider";
import { AppForm } from "@/components/forms/form-context";
import { FormCheckbox } from "@/components/forms/form-checkbox";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardFooter } from "@/components/card/app-card-footer";
import { CardHeroHeader } from "@/components/card/card-hero-header";

type Props = {
  showSocialProviders: boolean;
};

export const SignInForm = observer(({ showSocialProviders }: Props) => {
  const searchParams = useSearchParams();

  const t = useTranslations("SignInForm");

  const { signInStore } = useRootStore();
  const { callbackURL, isLoading } = signInStore;

  useEffect(() => {
    signInStore.setCallbackURL(searchParams.get("callbackURL") ?? undefined);
  }, [searchParams]);

  useEffect(() => {
    signInStore.setWithUnsavedChangesGuard(false);
  }, []);

  return (
    <AppForm store={signInStore}>
      <AppCard className="max-w-lg">
        <CardHeroHeader
          subtitle={t.rich("switchToSignUp", {
            registerLink: (chunks) => (
              <AppLink inheritSize href="/auth/signup">
                {chunks}
              </AppLink>
            ),
          })}
          title={t("signInTitle")}
        />

        <AppCardBody>
          {showSocialProviders && (
            <>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <SignInProviderButton
                  className="w-full sm:flex-1"
                  label={t("buttonLabel", { provider: "Google" })}
                  providerId="google"
                  onClick={() => void continueWithGoogleAction(callbackURL)}
                />

                <SignInProviderButton
                  className="w-full sm:flex-1"
                  label={t("buttonLabel", { provider: "Microsoft" })}
                  providerId="microsoft"
                  onClick={() => void continueWithMicrosoftAction(callbackURL)}
                />
              </div>

              <div className="my-3 flex items-center">
                <Separator aria-hidden="true" className="h-px flex-1" />

                <span className="text-x-sm text-subdued mx-4">{t("or")}</span>

                <Separator aria-hidden="true" className="h-px flex-1" />
              </div>
            </>
          )}

          <FormInput required id="email" type="email" />

          <FormInput
            required
            endContent={
              <Button
                aria-label={signInStore.showPassword ? "Hide password" : "Show password"}
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={signInStore.toggleShowPassword}
              >
                {signInStore.showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            }
            id="password"
            type={signInStore.showPassword ? "text" : "password"}
          />

          <div className="flex w-full justify-between items-start gap-3">
            <FormCheckbox id="rememberMe" label={t("rememberMe")} />

            <AppLink href="/auth/forgot-password">{t("forgotPassword")}</AppLink>
          </div>
        </AppCardBody>

        <AppCardFooter>
          <div className="flex w-full flex-col space-y-3 items-center">
            <Button className="w-full" disabled={isLoading} type="submit">
              {t("signInCta")}
            </Button>

            <p className="text-x-xs text-subdued text-center mt-2">
              {t.rich("agreeToTerms", {
                dataPrivacyLink: (chunks) => (
                  <AppLink inheritSize className="text-inherit underline" href="/privacy" target="_blank">
                    {chunks}
                  </AppLink>
                ),
                termsOfServiceLink: (chunks) => (
                  <AppLink inheritSize className="text-inherit underline" href="/terms" target="_blank">
                    {chunks}
                  </AppLink>
                ),
              })}
            </p>
          </div>
        </AppCardFooter>
      </AppCard>
    </AppForm>
  );
});
