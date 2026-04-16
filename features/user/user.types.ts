import type { UserRoleDto } from "@/features/role/role.types";

import type { User } from "@/generated/prisma";

type SensitiveUserFields =
  | "crmApiKeyId"
  | "crmApiKey"
  | "agentGatewayToken"
  | "agentHooksToken"
  | "welcomeEmailSentAt"
  | "trialExpiredOfferSentAt"
  | "trialInactivationReminderSentAt"
  | "trialInactivationNoticeSentAt";

export type ExtendedUser = Omit<User, SensitiveUserFields> & {
  role: UserRoleDto | null;
};
