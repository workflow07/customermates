"use client";

import { observer } from "mobx-react-lite";

import { Spinner } from "@/components/ui/spinner";
import { useRootStore } from "@/core/stores/root-store.provider";

export const LoadingOverlay = observer(() => {
  const { loadingOverlayStore } = useRootStore();

  if (!loadingOverlayStore.isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <Spinner className="text-primary" size="lg" />
    </div>
  );
});
