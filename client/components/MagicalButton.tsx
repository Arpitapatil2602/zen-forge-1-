import { ReactNode, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MagicalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "magical";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export default function MagicalButton({
  children,
  onClick,
  disabled = false,
  className,
  variant = "magical",
  size = "md",
  loading = false
}: MagicalButtonProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sparkleIdRef = useRef(0);

  const createSparkle = () => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const sparkle: Sparkle = {
      id: sparkleIdRef.current++,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      scale: Math.random() * 0.5 + 0.5,
      opacity: 1,
      rotation: Math.random() * 360
    };
    
    setSparkles(prev => [...prev, sparkle]);

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
    }, 1000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovered && !disabled) {
      interval = setInterval(createSparkle, 300);
    }
    
    return () => clearInterval(interval);
  }, [isHovered, disabled]);

  const handleClick = () => {
    if (!disabled && !loading) {
      // Create burst of sparkles
      for (let i = 0; i < 5; i++) {
        setTimeout(createSparkle, i * 50);
      }
      onClick?.();
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "relative overflow-hidden transition-all duration-300 ease-out transform";
    
    if (variant === "magical") {
      return cn(
        baseClasses,
        "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0",
        "hover:bg-pos-100 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25",
        "hover:scale-105 active:scale-95",
        "border-0",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      );
    }
    
    return baseClasses;
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-8 py-3 text-lg";
      default:
        return "px-6 py-2.5";
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant={variant === "magical" ? undefined : variant}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        getButtonClasses(),
        getSizeClasses(),
        className
      )}
    >
      {/* Animated gradient overlay */}
      {variant === "magical" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            transform: `scale(${sparkle.scale}) rotate(${sparkle.rotation}deg)`,
            opacity: sparkle.opacity,
            animation: "sparkle 1s ease-out forwards"
          }}
        >
          ✨
        </div>
      ))}
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      <span className={cn("relative z-10", loading && "opacity-0")}>
        {children}
      </span>
    </Button>
  );
}
