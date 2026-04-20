import type { Metadata } from "next";

import { ForgotPasswordForm } from "./forgot-password-form";

import { generateMetadataFromMeta } from "@/core/fumadocs/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromMeta({ locale, route: "/auth/forgot-password" });
}

export default function ForgotPasswordPage() {
  return (
    <div className="size-full flex flex-1 items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
