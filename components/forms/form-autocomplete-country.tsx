"use client";

import type { ComponentProps } from "react";

import { AppChip } from "@/components/chip/app-chip";
import { COUNTRIES } from "@/constants/countries";

import { FormAutocomplete } from "./form-autocomplete";
import { FormAutocompleteItem } from "./form-autocomplete-item";
import { FormAutocompleteCountryItem } from "./form-autocomplete-country-item";

type CountryItem = { key: string; value: { label: string } };

type Props = Omit<ComponentProps<typeof FormAutocomplete<CountryItem>>, "renderValue" | "children" | "items">;

export function FormAutocompleteCountry(props: Props) {
  const items: CountryItem[] = Object.entries(COUNTRIES).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <FormAutocomplete<CountryItem>
      items={items}
      renderValue={(rendered) =>
        rendered.map((item) => (
          <AppChip key={item.key}>
            <FormAutocompleteCountryItem
              countryKey={item.data?.key ?? item.key}
              label={item.data?.value.label ?? ""}
              size="sm"
            />
          </AppChip>
        ))
      }
      {...props}
    >
      {(country) =>
        FormAutocompleteItem({
          textValue: country.value.label,
          children: <FormAutocompleteCountryItem countryKey={country.key} label={country.value.label} />,
        })
      }
    </FormAutocomplete>
  );
}
