import { Action, Resource } from "@/generated/prisma/client";

import { UserDetailsCard } from "./components/user-details-card";
import { UserSettingsCard } from "./components/user-settings-card";
import { ApiKeysCard } from "./components/api-keys-card";

import { getGetUserDetailsInteractor, getUserService, getGetApiKeysInteractor, getRouteGuardService } from "@/core/di";
import { XPageRowContent } from "@/components/x-layout-primitives/x-page-row-content";
import { XPageRow } from "@/components/x-layout-primitives/x-page-row";
import { XPageContainer } from "@/components/x-layout-primitives/x-page-container";

export default async function ProfilePage() {
  await getRouteGuardService().ensureAccessOrRedirect();

  const canAccessApi = await getUserService().hasPermission(Resource.api, Action.readAll);

  const [userDetails, apiKeys] = await Promise.all([
    getGetUserDetailsInteractor().invoke(),
    canAccessApi ? getGetApiKeysInteractor().invoke() : [],
  ]);

  return (
    <XPageContainer>
      <XPageRow columns="2/1">
        <XPageRowContent>
          <UserDetailsCard userDetails={userDetails} />
        </XPageRowContent>

        <XPageRowContent>
          <UserSettingsCard />

          {canAccessApi && <ApiKeysCard apiKeys={apiKeys} />}
        </XPageRowContent>
      </XPageRow>
    </XPageContainer>
  );
}
