import { redirect } from "next/navigation";

import { VerifyEmailCard } from "./verify-email-card";

import { getAuthService } from "@/core/di";
import { XPageCenter } from "@/components/x-layout-primitives/x-page-center";

export default async function VerifyEmailPage() {
  const session = await getAuthService().getSession();

  if (!session) redirect("/auth/signin");

  if (session?.user?.emailVerified) redirect("/");

  return (
    <XPageCenter>
      <VerifyEmailCard email={session?.user?.email} />
    </XPageCenter>
  );
}
