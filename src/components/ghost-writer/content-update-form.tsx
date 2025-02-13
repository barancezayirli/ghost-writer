import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ContentUpdateFormProps {
  onUpdate: (update: string) => void;
}

export function ContentUpdateForm({ onUpdate }: ContentUpdateFormProps) {
  const [updateInput, setUpdateInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(updateInput);
    setUpdateInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 max-w-7xl mx-auto">
        <Input
          value={updateInput}
          onChange={(e) => setUpdateInput(e.target.value)}
          placeholder="Suggest changes or ask for updates..."
          className="flex-grow"
        />
        <Button type="submit">
          <Send className="h-4 w-4 mr-2" />
          Update
        </Button>
      </form>
    </div>
  );
}
