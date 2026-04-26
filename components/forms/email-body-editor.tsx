"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/forms/form-label";
import { LinkPopover } from "@/components/editor/link-popover";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (html: string) => void;
  required?: boolean;
};

export function EmailBodyEditor({ id, label, placeholder, value, onChange, required }: Props) {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, code: false, codeBlock: false, blockquote: false, horizontalRule: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : html);
    },
  });

  if (!editor) return null;

  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isBulletList = editor.isActive("bulletList");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <FormLabel htmlFor={id}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FormLabel>
      )}

      <div className="rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <div className="flex items-center gap-0.5 border-b border-input px-1 py-1">
          <Button
            aria-label="Bold"
            className={cn(isBold && "bg-accent text-accent-foreground")}
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="size-3.5" />
          </Button>

          <Button
            aria-label="Italic"
            className={cn(isItalic && "bg-accent text-accent-foreground")}
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-3.5" />
          </Button>

          <Button
            aria-label="Bullet list"
            className={cn(isBulletList && "bg-accent text-accent-foreground")}
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-3.5" />
          </Button>

          <LinkPopover editor={editor} open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen} />
        </div>

        <div className="min-h-40 px-3 py-2 text-sm">
          <EditorContent
            editor={editor}
            className="[&_.tiptap]:outline-none [&_.tiptap]:min-h-36 [&_.tiptap_p]:my-0.5 [&_.tiptap_a]:text-primary [&_.tiptap_a]:underline"
          />
        </div>
      </div>
    </div>
  );
}
