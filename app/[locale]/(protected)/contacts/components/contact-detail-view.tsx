"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { EntityType, Resource } from "@/generated/prisma";

import { createDealByNameAction, getDealsAction } from "../../deals/actions";
import { createOrganizationByNameAction, getOrganizationsAction } from "../../organizations/actions";
import { getUsersAction } from "../../company/actions";

import { EntityDetailBody } from "@/components/modal/entity-detail-body";
import { AppChip } from "@/components/chip/app-chip";
import { CustomFieldValueInput } from "@/components/data-view/custom-columns/custom-field-value-input";
import { FormInput } from "@/components/forms/form-input";
import { FormInputChips } from "@/components/forms/form-input-chips";
import { FormAutocomplete } from "@/components/forms/form-autocomplete";
import { FormAutocompleteAvatar } from "@/components/forms/form-autocomplete-avatar";
import { FormAutocompleteItem } from "@/components/forms/form-autocomplete-item";
import { useOpenEntity } from "@/components/modal/hooks/use-entity-drawer-stack";
import { useRootStore } from "@/core/stores/root-store.provider";

type Props = {
  layout?: "drawer" | "page";
};

export const ContactDetailView = observer(function ContactDetailView({ layout = "drawer" }: Props) {
  const t = useTranslations("ContactModal");
  const { contactDetailStore, userStore, userModalStore } = useRootStore();
  const openEntity = useOpenEntity();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { isEditingCustomField, customColumns, fetchedEntity } = contactDetailStore;

  return (
    <EntityDetailBody
      entityType={EntityType.contact}
      layout={layout}
      store={contactDetailStore}
      titleKey="ContactModal.title"
    >
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput autoFocus required id="firstName" />

        <FormInput id="lastName" />
      </div>

      <FormInputChips
        allowMultiple
        id="emails"
        label={t("emailsLabel")}
        placeholder="email@example.com"
        value={(contactDetailStore.form.emails ?? []).join(",")}
        onValueChange={(v) =>
          contactDetailStore.onChange(
            "emails",
            v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [],
          )
        }
      />

      {hasMounted && userStore.canAccess(Resource.organizations) && (
        <FormAutocomplete
          getItems={getOrganizationsAction}
          id="organizationIds"
          items={fetchedEntity?.organizations ?? []}
          renderValue={(items) => items.map((item) => <AppChip key={item.key}>{item.data?.name}</AppChip>)}
          selectionMode="multiple"
          onChipClick={(id) => openEntity(EntityType.organization, id)}
          onCreate={(name) => createOrganizationByNameAction(name, userStore.user?.id)}
        >
          {(item) => FormAutocompleteItem({ children: item.name })}
        </FormAutocomplete>
      )}

      {hasMounted && userStore.canAccess(Resource.deals) && (
        <FormAutocomplete
          getItems={getDealsAction}
          id="dealIds"
          items={fetchedEntity?.deals ?? []}
          renderValue={(items) => items.map((item) => <AppChip key={item.key}>{item.data?.name}</AppChip>)}
          selectionMode="multiple"
          onChipClick={(id) => openEntity(EntityType.deal, id)}
          onCreate={(name) => createDealByNameAction(name, userStore.user?.id)}
        >
          {(deal) => FormAutocompleteItem({ children: deal.name })}
        </FormAutocomplete>
      )}

      {customColumns.map((column, index) => (
        <CustomFieldValueInput key={column.id} column={column} index={index} isEditing={isEditingCustomField} />
      ))}

      <FormAutocompleteAvatar
        getItems={getUsersAction}
        id="userIds"
        items={fetchedEntity?.users ?? []}
        selectionMode="multiple"
        onChipClick={(id) => void userModalStore.loadById(id)}
      />
    </EntityDetailBody>
  );
});
