import type { Metadata } from "next";

import { SignInForm } from "./sign-in-form";

import { generateMetadataFromMeta } from "@/core/fumadocs/metadata";
import { IS_CLOUD_HOSTED } from "@/constants/env";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromMeta({ locale, route: "/auth/signin" });
}

export default function SignInPage() {
  return (
    <div className="size-full flex flex-1 items-center justify-center p-4">
      <SignInForm showSocialProviders={IS_CLOUD_HOSTED} />
    </div>
  );
}
