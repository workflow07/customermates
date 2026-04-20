"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useRootStore } from "@/core/stores/root-store.provider";
import { AppCard } from "@/components/card/app-card";
import { AppCardBody } from "@/components/card/app-card-body";
import { AppCardFooter } from "@/components/card/app-card-footer";
import { CardHeroHeader } from "@/components/card/card-hero-header";
import { AppForm } from "@/components/forms/form-context";
import { FormInput } from "@/components/forms/form-input";
import { AppLink } from "@/components/shared/app-link";

export const ResetPasswordForm = observer(() => {
  const t = useTranslations("ResetPasswordForm");
  const { resetPasswordStore } = useRootStore();
  const { isLoading, showPassword } = resetPasswordStore;
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    if (token && resetPasswordStore.form.token !== token) resetPasswordStore.onInitOrRefresh({ token });
  }, [token]);

  useEffect(() => {
    resetPasswordStore.setWithUnsavedChangesGuard(false);
  }, []);

  return (
    <AppForm store={resetPasswordStore}>
      <AppCard className="max-w-md">
        <CardHeroHeader
          subtitle={t.rich("backToSignIn", {
            backToSignInLink: (chunks) => (
              <AppLink inheritSize href="/auth/signin">
                {chunks}
              </AppLink>
            ),
          })}
          title={t("title")}
        />

        <AppCardBody>
          <FormInput
            required
            endContent={
              <Button
                aria-label={showPassword ? "Hide password" : "Show password"}
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={resetPasswordStore.toggleShowPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            }
            id="password"
            type={showPassword ? "text" : "password"}
          />

          <FormInput required id="confirmPassword" type={showPassword ? "text" : "password"} />
        </AppCardBody>

        <AppCardFooter>
          <Button className="w-full" disabled={isLoading} type="submit">
            {t("resetPasswordCta")}
          </Button>
        </AppCardFooter>
      </AppCard>
    </AppForm>
  );
});
