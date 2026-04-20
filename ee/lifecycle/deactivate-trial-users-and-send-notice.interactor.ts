import type { AgentMachineService } from "@/ee/agent/agent-machine.service";
import type { EmailService } from "@/features/email/email.service";

import { getTranslations } from "next-intl/server";

import type { User } from "@/generated/prisma";

import { SystemInteractor } from "@/core/decorators/system-interactor.decorator";
import TrialInactivationNotice from "@/components/emails/trial-inactivation-notice";
import { ROUTING_DEFAULT_LOCALE } from "@/i18n/routing";

export abstract class DeactivateTrialUsersAndSendNoticeRepo {
  abstract findUsersWithTrialEndedBetween6And7Days(): Promise<User[]>;
  abstract claimTrialInactivationNoticeSent(userId: string, sentAt: Date): Promise<boolean>;
  abstract clearMachineIdsForUser(userId: string): Promise<void>;
  abstract deactivateUser(userId: string): Promise<void>;
}

@SystemInteractor
export class DeactivateTrialUsersAndSendNoticeInteractor {
  constructor(
    private repo: DeactivateTrialUsersAndSendNoticeRepo,
    private emailService: EmailService,
    private machineService: AgentMachineService,
  ) {}

  async invoke(): Promise<void> {
    const users = await this.repo.findUsersWithTrialEndedBetween6And7Days();

    for (const user of users.filter((item) => !item.trialInactivationNoticeSentAt)) {
      const claimed = await this.repo.claimTrialInactivationNoticeSent(user.id, new Date());
      if (!claimed) continue;

      if (user.flyMachineId) await this.machineService.destroyMachine(user.flyMachineId);
      if (user.flyVolumeId) await this.machineService.destroyVolume(user.flyVolumeId);

      await this.repo.clearMachineIdsForUser(user.id);
      await this.repo.deactivateUser(user.id);

      const locale = user.displayLanguage === "system" ? ROUTING_DEFAULT_LOCALE : user.displayLanguage;
      const t = await getTranslations({
        locale,
        namespace: "TrialInactivationNotice",
      });
      await this.emailService.send({
        to: user.email,
        subject: t("subject"),
        react: TrialInactivationNotice({
          greeting: t("greeting", { firstName: user.firstName }),
          body: t("body"),
          dismiss: t("dismiss"),
          signoff: t("signoff"),
          subject: t("subject"),
          title: t("title"),
        }),
      });
    }
  }
}
