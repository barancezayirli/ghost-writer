import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContentSettings as Settings } from '@/types/ghost-writer';

interface ContentSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function ContentSettings({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating = false,
}: ContentSettingsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2 mb-8">
      <div className="w-full sm:flex-grow grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Select
          value={settings.language}
          onValueChange={(value) => onSettingsChange({ language: value as Settings['language'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={settings.tone}
          onValueChange={(value) => onSettingsChange({ tone: value as Settings['tone'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="humorous">Humorous</SelectItem>
            <SelectItem value="serious">Serious</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={settings.mode}
          onValueChange={(value) => onSettingsChange({ mode: value as Settings['mode'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast">Fast</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={settings.target}
          onValueChange={(value) => onSettingsChange({ target: value as Settings['target'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blog">Blog Post</SelectItem>
            <SelectItem value="x">X (Twitter)</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onGenerate}
        size="lg"
        className="w-full sm:w-auto px-6"
        disabled={isGenerating}
      >
        <Send className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
}
