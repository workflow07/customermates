"use client";

import type {
  BaseCustomColumnEntityModalStore,
  EntityDto,
  FormEntityDto,
} from "@/core/base/base-custom-column-entity-modal.store";

import { FileText } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { Editor } from "@/components/editor/editor";
import { Icon } from "@/components/shared/icon";

type Props<Form extends FormEntityDto, Dto extends EntityDto> = {
  store: BaseCustomColumnEntityModalStore<Form, Dto>;
};

export const EntityNotesPanel = observer(function EntityNotesPanel<Form extends FormEntityDto, Dto extends EntityDto>({
  store,
}: Props<Form, Dto>) {
  const t = useTranslations("");

  function handleNotesChange(data: object) {
    store.onChange("notes", data);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 pb-1 shrink-0">
        <Icon className="size-3.5 text-muted-foreground" icon={FileText} />

        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {t("Common.actions.labelNotes")}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4 pt-2">
        <Editor data={store.form.notes} onChange={handleNotesChange} />
      </div>
    </div>
  );
});
