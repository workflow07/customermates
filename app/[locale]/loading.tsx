import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <Spinner className="text-primary" size="lg" />
    </div>
  );
}
