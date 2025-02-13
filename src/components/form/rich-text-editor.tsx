import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
}

const RichTextEditor = ({ content }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onBeforeCreate: ({ editor }) => {
      editor.storage.characterCount = {
        characters: 0,
        words: 0,
      };
    },
    onCreate: ({ editor }) => {
      const text = editor.getText();
      editor.storage.characterCount = {
        characters: text.length,
        words: text.split(/\s+/).filter((word) => word.length > 0).length,
      };
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      editor.storage.characterCount = {
        characters: text.length,
        words: text.split(/\s+/).filter((word) => word.length > 0).length,
      };
    },
  });

  if (!editor) {
    return null;
  }

  const { characters = 0, words = 0 } = editor.storage.characterCount || {};

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 flex flex-wrap gap-2">
        <div className="flex space-x-1 border-r pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted-foreground/20' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted-foreground/20' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted-foreground/20' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
      <div className="bg-muted p-2 text-sm text-muted-foreground flex justify-end">
        <span>{words} words</span>
        <span className="mx-2">•</span>
        <span>{characters} characters</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
