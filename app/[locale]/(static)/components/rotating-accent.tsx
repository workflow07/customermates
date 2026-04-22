"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

const SWAP_DURATION_MS = 500;

export function RotatingAccent({ words, intervalMs = 2400, className }: Props) {
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearPrevRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!media.matches && words.length > 1);

    const listener = (e: MediaQueryListEvent) => setEnabled(!e.matches && words.length > 1);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [words.length]);

  useEffect(() => {
    if (!enabled) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        setPreviousIndex(i);
        return (i + 1) % words.length;
      });
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, intervalMs, words.length]);

  useEffect(() => {
    if (previousIndex == null) return;
    if (clearPrevRef.current) clearTimeout(clearPrevRef.current);
    clearPrevRef.current = setTimeout(() => setPreviousIndex(null), SWAP_DURATION_MS);
    return () => {
      if (clearPrevRef.current) clearTimeout(clearPrevRef.current);
    };
  }, [previousIndex]);

  const current = enabled ? words[index] : words[0];
  const longest = words.reduce((acc, w) => (w.length > acc.length ? w : acc), words[0] ?? "");

  return (
    <span className={cn("block", className)}>
      <span className="relative inline-block align-baseline">
        <span aria-hidden className="invisible whitespace-nowrap">
          {longest}
        </span>

        <span className="absolute inset-0 flex justify-center overflow-hidden">
          {previousIndex != null && (
            <span
              key={`out-${previousIndex}`}
              aria-hidden
              className="whitespace-nowrap motion-safe:animate-[rotatingAccentOut_500ms_ease-in-out_forwards]"
            >
              {words[previousIndex]}
            </span>
          )}

          <span
            key={`in-${index}`}
            aria-live="polite"
            className="absolute whitespace-nowrap motion-safe:animate-[rotatingAccentIn_500ms_ease-in-out_forwards]"
          >
            {current}
          </span>
        </span>
      </span>
    </span>
  );
}
