import Image from "@tiptap/extension-image";
import { ResizableNodeView } from "@tiptap/react";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          const w = (el as HTMLImageElement).style.width;
          return w ? parseInt(w, 10) : null;
        },
        renderHTML: (attrs) =>
          attrs.width ? { style: `width: ${attrs.width as number}px; max-width: 100%;` } : {},
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const img = document.createElement("img");
      img.src = (node.attrs.src as string) ?? "";
      img.alt = (node.attrs.alt as string) ?? "";
      img.draggable = false;
      img.style.display = "block";
      img.style.maxWidth = "100%";

      const view = new ResizableNodeView({
        node,
        editor,
        element: img,
        getPos,
        onCommit: (width: number) => {
          const pos = typeof getPos === "function" ? getPos() : undefined;
          if (pos == null) return;
          editor.view.dispatch(editor.view.state.tr.setNodeAttribute(pos, "width", Math.round(width)));
        },
        onUpdate: () => true,
        options: {
          directions: ["bottom-right"],
          preserveAspectRatio: true,
          className: {
            container: "inline-block align-bottom",
            wrapper: "relative inline-block",
            handle:
              "size-3 rounded-sm bg-primary border-2 border-background cursor-se-resize z-10 shadow-sm hover:scale-110 transition-transform",
            resizing: "opacity-75",
          },
        },
      });

      return view;
    };
  },
});
