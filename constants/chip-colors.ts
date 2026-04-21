/**
 * Chip / badge color vocabulary.
 *
 * Matches shadcn's `Badge` variant names one-to-one so there's no translation
 * layer between persisted values and the render variant. If you're tempted to
 * add a name here that differs from a shadcn variant, don't — keep them in
 * lockstep and add the variant to `components/ui/badge.tsx` first.
 */
export const CHIP_COLORS = ["default", "secondary", "destructive", "success", "warning", "info"] as const;

export type ChipColor = (typeof CHIP_COLORS)[number];
