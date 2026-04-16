"use server";

import type { RegisterUserData } from "@/features/user/register/register-user.interactor";

import { redirect } from "next/navigation";

import { getRegisterUserInteractor } from "@/core/di";
import { serializeResult } from "@/core/utils/action-result";

export async function onboardingAction(data: RegisterUserData) {
  const result = await serializeResult(getRegisterUserInteractor().invoke(data));
  if (result.ok) redirect("/");
  return result;
}
