import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Trash2, Sparkles, Check } from "lucide-react";

export default function PromptBuilder({ tool }) {
  const [blocks, setBlocks] = useState([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const defaultBlocks = tool.prompt_builder_blocks || [
    { name: "Objective", type: "textarea", placeholder: "What do you want to achieve?" },
    { name: "Tone", type: "dropdown", options: ["Professional", "Casual", "Friendly", "Formal", "Creative"], placeholder: "Select tone" },
    { name: "Format", type: "dropdown", options: ["Paragraph", "Bullet Points", "Step-by-Step", "Table", "Code"], placeholder: "Select format" },
    { name: "Context", type: "textarea", placeholder: "Provide relevant context or background" },
    { name: "Constraints", type: "text", placeholder: "Any limitations or requirements?" }
  ];

  const addBlock = (blockConfig) => {
    setBlocks([...blocks, { ...blockConfig, id: Date.now(), value: "" }]);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const updateBlockValue = (id, value) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, value } : block
    ));
  };

  const generatePrompt = () => {
    const parts = blocks
      .filter(block => block.value)
      .map(block => {
        if (block.name === "Objective") {
          return block.value;
        }
        return `${block.name}: ${block.value}`;
      });
    
    const prompt = parts.join("\n\n");
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBlockInput = (block) => {
    switch (block.type) {
      case "textarea":
        return (
          <Textarea
            value={block.value}
            onChange={(e) => updateBlockValue(block.id, e.target.value)}
            placeholder={block.placeholder}
            className="min-h-24"
          />
        );
      case "dropdown":
        return (
          <Select value={block.value} onValueChange={(val) => updateBlockValue(block.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={block.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {block.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={block.value}
            onChange={(e) => updateBlockValue(block.id, e.target.value)}
            placeholder={block.placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt Builder for {tool.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Build custom prompts using advanced parameters to get the best results
          </p>
        </div>
      </div>

      {/* Available Blocks */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Building Blocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {defaultBlocks.map((blockConfig, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => addBlock(blockConfig)}
                className="bg-white dark:bg-gray-900"
              >
                <Plus className="w-3 h-3 mr-1" />
                {blockConfig.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Blocks */}
      {blocks.length > 0 && (
        <div className="space-y-4">
          {blocks.map((block) => (
            <Card key={block.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Label className="text-base font-semibold">{block.name}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBlock(block.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {renderBlockInput(block)}
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={generatePrompt}
            className="w-full theme-gradient text-white hover:theme-gradient-hover py-6 text-lg ripple"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Prompt
          </Button>
        </div>
      )}

      {/* No blocks added yet */}
      {blocks.length === 0 && (
        <Card className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start Building Your Prompt
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Click on the building blocks above to add them to your prompt
            </p>
          </CardContent>
        </Card>
      )}

      {/* Generated Prompt */}
      {generatedPrompt && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Prompt</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-gray-950 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
              {generatedPrompt}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helpful Tips */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Sparkles className="w-5 h-5" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800 dark:text-amber-300">
          <ul className="space-y-2 list-disc list-inside">
            <li>Be specific about what you want to achieve</li>
            <li>Provide relevant context and examples</li>
            <li>Specify the desired format and length</li>
            <li>Iterate and refine based on results</li>
            <li>Save successful prompts for future use</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}