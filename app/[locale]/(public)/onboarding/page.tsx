import { redirect } from "next/navigation";

import { OnboardingForm } from "./components/onboarding-form";

import { getAuthService, getUserService } from "@/core/di";

export default async function OnboardingPage() {
  const isRegistered = await getUserService().isRegistered();

  if (isRegistered) redirect("/");

  const session = await getAuthService().getSessionOrRedirect();

  const name = session.user?.name ?? "";
  const isEmail = name.includes("@");
  const spaceIndex = name.indexOf(" ");
  const firstName = isEmail ? undefined : spaceIndex === -1 ? name : name.slice(0, spaceIndex);
  const lastName = isEmail ? undefined : spaceIndex === -1 ? undefined : name.slice(spaceIndex + 1);
  const avatarUrl = session.user?.image?.startsWith("https:") ? session.user.image : "";

  return (
    <div className="size-full flex flex-1 items-center justify-center p-4">
      <OnboardingForm
        avatarUrl={avatarUrl}
        email={session.user?.email ?? ""}
        firstName={firstName}
        lastName={lastName}
      />
    </div>
  );
}
