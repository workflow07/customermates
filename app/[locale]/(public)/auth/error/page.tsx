"use client";

import { ErrorCard } from "./error-card";

import { CenteredCardPage } from "@/components/shared/centered-card-page";

export default function ErrorPage() {
  return (
    <CenteredCardPage>
      <ErrorCard />
    </CenteredCardPage>
  );
}
