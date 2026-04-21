import { NextResponse } from "next/server";

import {
  getSendWelcomeAndDemoInteractor,
  getSendTrialExtensionOfferInteractor,
  getSendTrialInactivationReminderInteractor,
  getDeactivateTrialUsersAndSendNoticeInteractor,
  getDeactivateUsersAfterSubscriptionGracePeriodInteractor,
} from "@/core/di";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await Promise.all([
    getSendWelcomeAndDemoInteractor().invoke(),
    getSendTrialExtensionOfferInteractor().invoke(),
    getSendTrialInactivationReminderInteractor().invoke(),
    getDeactivateTrialUsersAndSendNoticeInteractor().invoke(),
    getDeactivateUsersAfterSubscriptionGracePeriodInteractor().invoke(),
  ]);

  return new NextResponse("ok");
}
