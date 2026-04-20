import { redirect } from "next/navigation";

import { VerifyEmailCard } from "./verify-email-card";

import { getAuthService } from "@/core/di";

export default async function VerifyEmailPage() {
  const session = await getAuthService().getSession();

  if (!session) redirect("/auth/signin");

  if (session?.user?.emailVerified) redirect("/");

  return (
    <div className="size-full flex flex-1 items-center justify-center p-4">
      <VerifyEmailCard email={session?.user?.email} />
    </div>
  );
}
