"use server";

import type { UpsertAgentKeysData } from "@/ee/agent/provision-agent.interactor";
import type { SetAgentEnvironmentVariableData } from "@/ee/agent/set-agent-environment-variable.interactor";

import {
  getCheckAgentHealthInteractor,
  getGetAgentControlUrlInteractor,
  getGetAgentProvisionedInteractor,
  getProvisionAgentInteractor,
  getResetAgentInteractor,
  getSetAgentEnvironmentVariableInteractor,
  getVerifyAgentMachineInteractor,
} from "@/core/di";
import { serializeResult } from "@/core/utils/action-result";

export async function checkAgentHealthAction(): Promise<{ healthy: boolean }> {
  const healthy = await getCheckAgentHealthInteractor().invoke();
  return { healthy };
}

export async function getAgentProvisionedAction(): Promise<{ provisioned: boolean }> {
  const provisioned = await getGetAgentProvisionedInteractor().invoke();
  return { provisioned };
}

export async function upsertAgentKeysAction(data: UpsertAgentKeysData) {
  return serializeResult(getProvisionAgentInteractor().invoke(data));
}

export async function resetAgentAction() {
  return getResetAgentInteractor().invoke();
}

export async function verifyAgentMachineAction(): Promise<{ exists: boolean }> {
  const exists = await getVerifyAgentMachineInteractor().invoke();
  return { exists };
}

export async function getAgentControlUrlAction(): Promise<{ url: string; token: string; machineId: string } | null> {
  return await getGetAgentControlUrlInteractor().invoke();
}

export async function setAgentEnvironmentVariableAction(data: SetAgentEnvironmentVariableData) {
  return serializeResult(getSetAgentEnvironmentVariableInteractor().invoke(data));
}
