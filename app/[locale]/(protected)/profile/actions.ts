"use server";

import type { UpdateUserDetailsData } from "@/features/user/upsert/update-user-details.interactor";
import type { UpdateUserSettingsData } from "@/features/user/upsert/update-user-settings.interactor";
import type { CreateApiKeyData } from "@/features/api-key/create-api-key.interactor";
import type { DeleteApiKeyData } from "@/features/api-key/delete-api-key.interactor";
import type { UpdateSmtpSettingsData } from "@/features/company/smtp/update-smtp-settings.interactor";

import {
  getUpdateUserDetailsInteractor,
  getUpdateUserSettingsInteractor,
  getCreateApiKeyInteractor,
  getDeleteApiKeyInteractor,
  getGetApiKeysInteractor,
  getGetSmtpSettingsInteractor,
  getUpdateSmtpSettingsInteractor,
} from "@/core/di";
import { serializeResult } from "@/core/utils/action-result";

export async function updateUserAction(data: UpdateUserDetailsData) {
  return serializeResult(getUpdateUserDetailsInteractor().invoke(data));
}

export async function updateSettingsAction(data: UpdateUserSettingsData) {
  return serializeResult(getUpdateUserSettingsInteractor().invoke(data));
}

export async function createApiKeyAction(data: CreateApiKeyData) {
  return serializeResult(getCreateApiKeyInteractor().invoke(data));
}

export async function deleteApiKeyAction(data: DeleteApiKeyData) {
  return serializeResult(getDeleteApiKeyInteractor().invoke(data));
}

export async function refreshApiKeysAction() {
  const result = await getGetApiKeysInteractor().invoke();
  return result.data;
}

export async function getEmailSettingsAction() {
  const result = await getGetSmtpSettingsInteractor().invoke();
  return result.ok ? result.data : null;
}

export async function updateEmailSettingsAction(data: UpdateSmtpSettingsData) {
  return serializeResult(getUpdateSmtpSettingsInteractor().invoke(data));
}
