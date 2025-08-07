import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Copy, Save, Share2, Wand2, Trash2, Zap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RefinePromptRequest, RefinePromptResponse } from "@shared/api";
import AnimatedBackground from "@/components/AnimatedBackground";
import InteractiveCard from "@/components/InteractiveCard";
import MagicalButton from "@/components/MagicalButton";
import MagicalLoader from "@/components/MagicalLoader";
import PromptExamples from "@/components/PromptExamples";
import FloatingElements from "@/components/FloatingElements";

type UseCase = "chat" | "image" | "code" | "content";

interface RefinedPrompt {
  id: string;
  original: string;
  refined: string;
  useCase: UseCase;
  timestamp: Date;
}

const useCaseColors = {
  chat: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  image: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  code: "bg-green-100 text-green-800 hover:bg-green-200",
  content: "bg-orange-100 text-orange-800 hover:bg-orange-200"
};

export default function Index() {
  const [roughIdea, setRoughIdea] = useState("");
  const [useCase, setUseCase] = useState<UseCase | "">("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<RefinedPrompt[]>([]);
  const { toast } = useToast();

  // Load saved prompts from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("promptforge-saved-prompts");
    if (saved) {
      try {
        const parsedPrompts = JSON.parse(saved).map((prompt: any) => ({
          ...prompt,
          timestamp: new Date(prompt.timestamp)
        }));
        setSavedPrompts(parsedPrompts);
      } catch (error) {
        console.error("Error loading saved prompts:", error);
      }
    }
  }, []);

  // Save prompts to localStorage whenever savedPrompts changes
  useEffect(() => {
    if (savedPrompts.length > 0) {
      localStorage.setItem("promptforge-saved-prompts", JSON.stringify(savedPrompts));
    }
  }, [savedPrompts]);

  const refinePrompt = async () => {
    if (!roughIdea.trim() || !useCase) {
      toast({
        title: "Missing Information",
        description: "Please enter your idea and select a use case.",
        variant: "destructive"
      });
      return;
    }

    setIsRefining(true);

    try {
      const requestBody: RefinePromptRequest = {
        roughIdea,
        useCase: useCase as UseCase
      };

      const response = await fetch("/api/refine-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data: RefinePromptResponse = await response.json();

      if (data.success) {
        setRefinedPrompt(data.refinedPrompt);
        toast({
          title: "Prompt Refined!",
          description: "Your prompt has been successfully refined and optimized."
        });
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error refining prompt:", error);
      toast({
        title: "Refinement Failed",
        description: "There was an error refining your prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefining(false);
    }
  };

  const savePrompt = () => {
    if (!refinedPrompt) return;
    
    const newPrompt: RefinedPrompt = {
      id: Date.now().toString(),
      original: roughIdea,
      refined: refinedPrompt,
      useCase: useCase as UseCase,
      timestamp: new Date()
    };
    
    setSavedPrompts(prev => [newPrompt, ...prev]);
    toast({
      title: "Prompt Saved",
      description: "Your refined prompt has been saved successfully."
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard."
    });
  };

  const sharePrompt = async () => {
    const shareData = {
      title: "PromptForge - Refined Prompt",
      text: `Check out this refined prompt from PromptForge:\n\n${refinedPrompt}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Prompt shared successfully!"
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(refinedPrompt);
        }
      }
    } else {
      // Fallback to copying with share-friendly format
      const shareText = `Check out this refined prompt from PromptForge:\n\n"${refinedPrompt}"\n\nCreate your own at: ${window.location.href}`;
      copyToClipboard(shareText);
      toast({
        title: "Copied for Sharing",
        description: "Prompt copied with sharing text to clipboard!"
      });
    }
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(prompt => prompt.id !== id));
    toast({
      title: "Prompt Deleted",
      description: "Saved prompt removed successfully."
    });
  };

  const loadPrompt = (prompt: RefinedPrompt) => {
    setRoughIdea(prompt.original);
    setUseCase(prompt.useCase);
    setRefinedPrompt(prompt.refined);
    toast({
      title: "Prompt Loaded",
      description: "Saved prompt loaded into editor."
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />

      {/* Header */}
      <header className="relative border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-xl animate-pulse-glow">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-float" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift bg-size-200">
                  PromptForge
                </h1>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  Transform Ideas into AI Magic ✨
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 animate-float" style={{ animationDelay: "1s" }}>
                <Star className="w-3 h-3 mr-1" />
                Open Source
              </Badge>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 animate-float" style={{ animationDelay: "0.5s" }}>
                <Zap className="w-3 h-3 mr-1" />
                Free
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <InteractiveCard glowColor="rgba(59, 130, 246, 0.3)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                  Quick Start Examples
                </CardTitle>
                <CardDescription>
                  Click any example to get started instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptExamples
                  onSelectExample={(idea, useCase) => {
                    setRoughIdea(idea);
                    setUseCase(useCase as UseCase);
                  }}
                />
              </CardContent>
            </InteractiveCard>

            <InteractiveCard glowColor="rgba(139, 92, 246, 0.3)">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-indigo-600" />
                  Craft Your Prompt
                </CardTitle>
                <CardDescription>
                  Start with a rough idea and we'll refine it into a powerful AI prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="idea">Your Rough Idea</Label>
                  <Textarea
                    id="idea"
                    placeholder="e.g., I want to create a marketing campaign for a new eco-friendly product..."
                    value={roughIdea}
                    onChange={(e) => setRoughIdea(e.target.value)}
                    className="min-h-24 sm:min-h-32 mt-2 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="usecase">Use Case</Label>
                  <Select value={useCase} onValueChange={setUseCase}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select how you'll use this prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">💬 Chat/Conversation</SelectItem>
                      <SelectItem value="image">🎨 Image Generation</SelectItem>
                      <SelectItem value="code">💻 Code Generation</SelectItem>
                      <SelectItem value="content">📝 Content Creation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                {isRefining ? (
                  <div className="w-full">
                    <MagicalLoader
                      text="Refining your prompt"
                      subtext="AI magic in progress"
                    />
                  </div>
                ) : (
                  <MagicalButton
                    onClick={refinePrompt}
                    disabled={!roughIdea.trim() || !useCase}
                    className="w-full"
                    size="lg"
                    loading={isRefining}
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    ✨ Refine with AI Magic
                  </MagicalButton>
                )}
              </CardFooter>
            </InteractiveCard>

            {/* Saved Prompts */}
            {savedPrompts.length > 0 && (
              <InteractiveCard glowColor="rgba(34, 197, 94, 0.3)">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Saved Prompts
                    <Badge variant="secondary" className="text-xs">
                      {savedPrompts.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Click to load, or use the delete button to remove
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                    {savedPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="p-3 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={useCaseColors[prompt.useCase]}>
                            {prompt.useCase}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {prompt.timestamp.toLocaleDateString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePrompt(prompt.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p
                          className="text-sm text-slate-700 truncate cursor-pointer hover:text-slate-900"
                          onClick={() => loadPrompt(prompt)}
                          title="Click to load this prompt"
                        >
                          {prompt.original}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </InteractiveCard>
            )}
          </div>

          {/* Output Section */}
          <div>
            <InteractiveCard glowColor="rgba(168, 85, 247, 0.3)" className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Refined Prompt
                </CardTitle>
                <CardDescription>
                  Your polished, ready-to-use AI prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                {refinedPrompt ? (
                  <div className="space-y-4">
                    <Textarea
                      value={refinedPrompt}
                      onChange={(e) => setRefinedPrompt(e.target.value)}
                      className="min-h-32 sm:min-h-48 font-mono text-xs sm:text-sm"
                      placeholder="Your refined prompt will appear here..."
                    />
                    {useCase && (
                      <Badge className={useCaseColors[useCase as UseCase]}>
                        {useCase}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="min-h-48 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your refined prompt will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
              {refinedPrompt && (
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <MagicalButton
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(refinedPrompt)}
                    className="flex-1 w-full sm:w-auto border-blue-200 hover:border-blue-400 text-blue-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Magic
                  </MagicalButton>
                  <MagicalButton
                    variant="outline"
                    size="sm"
                    onClick={savePrompt}
                    className="flex-1 w-full sm:w-auto border-green-200 hover:border-green-400 text-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Spell
                  </MagicalButton>
                  <MagicalButton
                    variant="outline"
                    size="sm"
                    onClick={sharePrompt}
                    className="flex-1 w-full sm:w-auto border-purple-200 hover:border-purple-400 text-purple-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Wonder
                  </MagicalButton>
                </CardFooter>
              )}
            </InteractiveCard>
          </div>
        </div>
      </div>
    </div>
  );
}
