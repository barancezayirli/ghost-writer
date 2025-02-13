"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Send, RefreshCw, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/blocks/rich-text-editor";
import { toast } from "@/hooks/use-toast";

export default function GhostWriter() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [updateInput, setUpdateInput] = useState("");

  const addKeyword = () => {
    if (
      currentKeyword.trim() !== "" &&
      !keywords.includes(currentKeyword.trim())
    ) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const generateArticle = () => {
    // This is a placeholder for the actual content generation
    // In a real application, you would call your AI service here
    const placeholderContent = `
      <h1>Generated Article</h1>
      <p>This is a placeholder for the generated content. In a real application, this would be the output from your AI service based on the user's inputs.</p>
      <ul>
        <li>You can edit this content using the rich text editor.</li>
        <li>Try out the formatting options in the toolbar above.</li>
      </ul>
    `;
    setGeneratedContent(placeholderContent);
  };

  const handleRetry = () => {
    // Implement retry logic here
    generateArticle();
  };

  const handleLike = () => {
    // Implement like logic here
    toast({
      title: "Liked!",
      description: "Thank you for your feedback.",
    });
  };

  const handleDislike = () => {
    // Implement dislike logic here
    toast({
      title: "Disliked",
      description: "We'll try to improve. Thank you for your feedback.",
    });
  };

  const handleCopy = () => {
    // Implement copy logic here
    navigator.clipboard.writeText(generatedContent || "");
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement update logic here
    console.log("Updating content with:", updateInput);
    // In a real application, you would send this to your AI service
    // and update the generatedContent with the response
    setUpdateInput("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Ghost Writer</h1>
      </header>

      <div className="mb-6">
        <Textarea
          placeholder="Enter your title or subject here..."
          className="w-full p-4 text-lg border-2 border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
        />
      </div>

      <Card className="w-full mb-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="text-sm px-2 py-1"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add keywords..."
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addKeyword();
                  }
                }}
                className="flex-grow"
              />
              <Button onClick={addKeyword} variant="secondary" size="sm">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2 mb-8">
        <div className="w-full sm:flex-grow grid grid-cols-2 sm:grid-cols-5 gap-2">
          <Select>
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
          <Select>
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fast">Fast</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select>
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
          onClick={generateArticle}
          size="lg"
          className="w-full sm:w-auto px-6"
        >
          <Send className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>

      {generatedContent && (
        <div className="space-y-4 mt-8 border-t pt-8">
          <RichTextEditor content={generatedContent} />

          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="outline" size="icon" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLike}>
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDislike}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={handleUpdate}
            className="flex items-center space-x-2 mt-4"
          >
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
      )}
    </div>
  );
}
