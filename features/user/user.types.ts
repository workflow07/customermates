import type { UserRoleDto } from "@/features/role/role.types";

import type { User } from "@/generated/prisma";

type SensitiveUserFields =
  | "welcomeEmailSentAt"
  | "trialExpiredOfferSentAt"
  | "trialInactivationReminderSentAt"
  | "trialInactivationNoticeSentAt";

export type ExtendedUser = Omit<User, SensitiveUserFields> & {
  role: UserRoleDto | null;
};
