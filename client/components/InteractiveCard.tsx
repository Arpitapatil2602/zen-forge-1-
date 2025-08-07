import { ReactNode, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function InteractiveCard({ 
  children, 
  className, 
  glowColor = "rgba(139, 92, 246, 0.3)" 
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 blur-xl",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Shimmer effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />

      <Card
        className={cn(
          "relative transform transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:-translate-y-1",
          "border-0 shadow-lg bg-white/70 backdrop-blur-sm",
          "hover:shadow-2xl hover:shadow-purple-500/10",
          className
        )}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${(mousePosition.y - (cardRef.current?.offsetHeight || 0) / 2) * -0.02}deg) rotateY(${(mousePosition.x - (cardRef.current?.offsetWidth || 0) / 2) * 0.02}deg)`
            : 'none'
        }}
      >
        {children}
      </Card>
    </div>
  );
}
