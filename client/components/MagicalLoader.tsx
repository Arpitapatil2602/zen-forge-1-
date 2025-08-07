import { useEffect, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";

interface MagicalLoaderProps {
  text?: string;
  subtext?: string;
}

export default function MagicalLoader({ 
  text = "Refining your prompt...", 
  subtext = "Weaving magic with AI" 
}: MagicalLoaderProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Main magic circle */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-24 h-24 border-4 border-purple-200 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            <Sparkles className="w-3 h-3 text-indigo-500" />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
            <Sparkles className="w-2 h-2 text-purple-400" />
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
            <Sparkles className="w-2 h-2 text-indigo-400" />
          </div>
        </div>

        {/* Inner counter-rotating ring */}
        <div className="absolute inset-2 w-16 h-16 border-2 border-indigo-300 rounded-full animate-reverse-spin">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Center wand */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse-glow">
            <Wand2 className="w-8 h-8 text-gradient bg-gradient-to-r from-purple-600 to-indigo-600" />
          </div>
        </div>

        {/* Floating sparkles */}
        <div className="absolute -top-4 -left-4 animate-float" style={{ animationDelay: "0s" }}>
          <Sparkles className="w-3 h-3 text-purple-400 opacity-70" />
        </div>
        <div className="absolute -top-2 -right-6 animate-float" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-2 h-2 text-indigo-400 opacity-60" />
        </div>
        <div className="absolute -bottom-4 -right-2 animate-float" style={{ animationDelay: "2s" }}>
          <Sparkles className="w-3 h-3 text-purple-300 opacity-80" />
        </div>
        <div className="absolute -bottom-2 -left-6 animate-float" style={{ animationDelay: "1.5s" }}>
          <Sparkles className="w-2 h-2 text-indigo-300 opacity-50" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {text}{dots}
        </p>
        <p className="text-sm text-muted-foreground">
          {subtext}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-gradient-shift bg-size-200" />
      </div>
    </div>
  );
}
