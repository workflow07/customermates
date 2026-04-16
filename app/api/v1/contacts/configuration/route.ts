import { NextResponse } from "next/server";

import { getGetContactsConfigurationInteractor } from "@/core/di";
import { handleError } from "@/core/api/interactor-handler";

export async function GET() {
  try {
    const result = await getGetContactsConfigurationInteractor().invoke();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
