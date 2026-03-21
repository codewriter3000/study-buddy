'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        'data-placeholder': placeholder || 'Write the definition...',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    background: active ? '#ff6c95' : '#2a2d3e',
    color: active ? '#fff' : '#9b9ec8',
    transition: 'all 0.2s',
  });

  return (
    <div
      style={{
        backgroundColor: '#212534',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '8px 12px',
          backgroundColor: '#1c1f2c',
          borderBottom: '1px solid rgba(155, 158, 200, 0.1)',
        }}
      >
        <button
          type="button"
          style={btnStyle(editor.isActive('bold'))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          style={btnStyle(editor.isActive('italic'))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          style={btnStyle(editor.isActive('bulletList'))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          style={btnStyle(editor.isActive('orderedList'))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          title="Ordered List"
        >
          1. List
        </button>
        <button
          type="button"
          style={btnStyle(false)}
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          title="Link"
        >
          Link
        </button>
        <button
          type="button"
          style={btnStyle(false)}
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Image"
        >
          Img
        </button>
      </div>
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
