"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaCode,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaEraser,
} from "react-icons/fa";

export default function RichEditorBox({
  label,
  height = 200,
  value = "",
  onChange,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your problem statement..." }),
    ],
    content: value || "<p><br></p><p><br></p>", // initial content
    editorProps: {
      attributes: {
        class: `prose prose-sm prose-invert px-4 py-3 min-h-[${height}px] bg-gray-900 text-white outline-none font-sans rounded-b-md`,
      },
    },
  });

  // Sync external value changes into the editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p><br></p><p><br></p>");
    }
  }, [value, editor]);

  // Notify parent on content update
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onChange]);

  const btnStyle =
    "hover:text-white text-gray-400 p-2 transition hover:bg-gray-800 rounded";

  return (
    <div className="mb-8">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="rounded-md border border-gray-700 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 px-2 py-2 bg-gray-800 border-b border-gray-700">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={btnStyle}
            aria-label="Bold"
          >
            <FaBold />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={btnStyle}
            aria-label="Italic"
          >
            <FaItalic />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={btnStyle}
            aria-label="Underline"
          >
            <FaUnderline />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={btnStyle}
            aria-label="Strikethrough"
          >
            <FaStrikethrough />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={btnStyle}
            aria-label="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={btnStyle}
            aria-label="Ordered List"
          >
            <FaListOl />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={btnStyle}
            aria-label="Code Block"
          >
            <FaCode />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={btnStyle}
            aria-label="Blockquote"
          >
            <FaQuoteRight />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            className={btnStyle}
            aria-label="Undo"
          >
            <FaUndo />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            className={btnStyle}
            aria-label="Redo"
          >
            <FaRedo />
          </button>
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
            className={btnStyle}
            aria-label="Clear Formatting"
          >
            <FaEraser />
          </button>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
