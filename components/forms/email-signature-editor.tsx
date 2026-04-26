"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { ResizableImage } from "@/components/editor/resizable-image.extension";
import { Bold, Italic, List, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/forms/form-label";
import { LinkPopover } from "@/components/editor/link-popover";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  value?: string;
  onChange?: (html: string) => void;
};

export function EmailSignatureEditor({ id, label, hint, placeholder, value, onChange }: Props) {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      ResizableImage.configure({ allowBase64: true }),
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

  function handleImageButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (src) editor?.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}

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

          <Button
            aria-label="Insert image"
            size="icon-sm"
            type="button"
            variant="ghost"
            onClick={handleImageButtonClick}
          >
            <ImageIcon className="size-3.5" />
          </Button>

          <input
            ref={fileInputRef}
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            type="file"
            onChange={handleFileChange}
          />
        </div>

        <div className="min-h-28 px-3 py-2 text-sm">
          <EditorContent
            editor={editor}
            className={cn(
              "[&_.tiptap]:outline-none [&_.tiptap]:min-h-24",
              "[&_.tiptap_p]:my-0.5",
              "[&_.tiptap_a]:text-primary [&_.tiptap_a]:underline",
              "[&_.tiptap_img]:max-h-20 [&_.tiptap_img]:object-contain [&_.tiptap_img]:inline-block",
            )}
          />
        </div>
      </div>

      {hint && <p className="text-subdued text-xs">{hint}</p>}
    </div>
  );
}
