"use server";

import type { GlobalSearchData } from "@/features/search/global-search.interactor";

import { getGlobalSearchInteractor } from "@/core/di";

export async function globalSearchAction(data: GlobalSearchData) {
  const interactor = getGlobalSearchInteractor();

  return await interactor.invoke(data);
}
