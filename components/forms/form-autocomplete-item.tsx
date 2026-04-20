"use client";

import type { ReactElement, ReactNode } from "react";
import { createElement } from "react";

type Props = {
  textValue?: string;
  children: ReactNode;
};

export function FormAutocompleteItem({ textValue, children }: Props): ReactElement {
  // Use createElement so we can attach a custom `textValue` prop onto a
  // component element (not a host `<span>` — React would warn on unknown DOM
  // attrs). The inner component strips it before render.
  // eslint-disable-next-line react/no-children-prop
  return createElement(AutocompleteItemInner, { textValue, children });
}

function AutocompleteItemInner({ children }: { textValue?: string; children: ReactNode }) {
  return <span>{children}</span>;
}
