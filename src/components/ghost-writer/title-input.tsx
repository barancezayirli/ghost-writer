import { Textarea } from '@/components/ui/textarea';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div className="mb-6">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your title or subject here..."
        className="w-full p-4 text-lg border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        rows={3}
      />
    </div>
  );
}
