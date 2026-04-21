import type { MouseEvent as ReactMouseEvent } from "react";

// Selector for interactive DOM elements that should suppress row/card click-through.
// If a click originates inside (or on) any of these, the row's onClick is a no-op,
// so opening a chip dropdown, picking a menu item, toggling a select, or hitting a
// button/link nested in a row doesn't also trigger row-level navigation.
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[role='button']",
  "[role='checkbox']",
  "[role='menu']",
  "[role='menuitem']",
  "[role='menuitemcheckbox']",
  "[role='menuitemradio']",
  "[role='option']",
  "[role='radio']",
  "[role='switch']",
  "[role='tab']",
  "[aria-haspopup]",
  "[data-slot='dropdown-menu-trigger']",
  "[data-slot='dropdown-menu-content']",
  "[data-slot='dropdown-menu-item']",
  "[data-slot='select-trigger']",
  "[data-slot='select-content']",
  "[data-slot='popover-trigger']",
  "[data-slot='popover-content']",
  "[data-slot='tooltip-trigger']",
].join(",");

export function isInteractiveClick(e: ReactMouseEvent<HTMLElement>): boolean {
  const target = e.target as HTMLElement | null;
  return Boolean(target?.closest(INTERACTIVE_SELECTOR));
}
