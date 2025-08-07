import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";

interface PromptExample {
  id: string;
  title: string;
  idea: string;
  useCase: "chat" | "image" | "code" | "content";
  preview: string;
}

const examples: PromptExample[] = [
  {
    id: "1",
    title: "Marketing Campaign",
    idea: "Create a marketing campaign for eco-friendly products",
    useCase: "content",
    preview: "Create engaging, persuasive content for an eco-friendly product marketing campaign..."
  },
  {
    id: "2", 
    title: "Code Assistant",
    idea: "Help me build a React component",
    useCase: "code",
    preview: "Write clean, efficient React component code with TypeScript and proper documentation..."
  },
  {
    id: "3",
    title: "Art Creation",
    idea: "Fantasy landscape with dragons",
    useCase: "image", 
    preview: "Create a stunning fantasy landscape featuring majestic dragons, mystical lighting..."
  },
  {
    id: "4",
    title: "Learning Tutor",
    idea: "Explain quantum physics concepts",
    useCase: "chat",
    preview: "You are a knowledgeable physics tutor specializing in quantum mechanics..."
  }
];

const useCaseColors = {
  chat: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  image: "bg-purple-100 text-purple-800 hover:bg-purple-200", 
  code: "bg-green-100 text-green-800 hover:bg-green-200",
  content: "bg-orange-100 text-orange-800 hover:bg-orange-200"
};

interface PromptExamplesProps {
  onSelectExample: (idea: string, useCase: string) => void;
}

export default function PromptExamples({ onSelectExample }: PromptExamplesProps) {
  const [hoveredExample, setHoveredExample] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-medium">Quick Start Examples</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((example) => (
          <div
            key={example.id}
            className="group relative overflow-hidden rounded-lg border bg-white/50 hover:bg-white/80 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredExample(example.id)}
            onMouseLeave={() => setHoveredExample(null)}
            onClick={() => onSelectExample(example.idea, example.useCase)}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                  {example.title}
                </h4>
                <Badge className={useCaseColors[example.useCase]}>
                  {example.useCase}
                </Badge>
              </div>
              
              {/* Idea */}
              <p className="text-sm text-gray-600 leading-relaxed">
                "{example.idea}"
              </p>
              
              {/* Preview (shown on hover) */}
              <div className={`
                transition-all duration-300 overflow-hidden
                ${hoveredExample === example.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    Preview: {example.preview}
                  </p>
                </div>
              </div>
              
              {/* CTA */}
              <div className={`
                flex items-center justify-end transition-all duration-300
                ${hoveredExample === example.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              `}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1 h-auto"
                >
                  Try this example
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
            
            {/* Animated corner sparkle */}
            <div className={`
              absolute top-2 right-2 transition-all duration-300
              ${hoveredExample === example.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            `}>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
