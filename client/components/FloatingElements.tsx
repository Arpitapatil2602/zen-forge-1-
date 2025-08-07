import { useEffect, useState } from "react";
import { Sparkles, Zap, Star, Wand2, Code, Image, MessageCircle, FileText } from "lucide-react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  icon: React.ReactNode;
  speed: number;
  direction: number;
}

const icons = [
  <Sparkles key="sparkles" className="w-full h-full" />,
  <Zap key="zap" className="w-full h-full" />,
  <Star key="star" className="w-full h-full" />,
  <Wand2 key="wand" className="w-full h-full" />,
  <Code key="code" className="w-full h-full" />,
  <Image key="image" className="w-full h-full" />,
  <MessageCircle key="message" className="w-full h-full" />,
  <FileText key="file" className="w-full h-full" />
];

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const createElements = () => {
      const newElements: FloatingElement[] = [];
      
      for (let i = 0; i < 12; i++) {
        newElements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          icon: icons[Math.floor(Math.random() * icons.length)],
          speed: Math.random() * 0.5 + 0.2,
          direction: Math.random() * Math.PI * 2
        });
      }
      
      setElements(newElements);
    };

    createElements();

    const animateElements = () => {
      setElements(prev => prev.map(element => ({
        ...element,
        x: (element.x + Math.cos(element.direction) * element.speed + window.innerWidth) % window.innerWidth,
        y: (element.y + Math.sin(element.direction) * element.speed + window.innerHeight) % window.innerHeight,
        rotation: (element.rotation + 0.5) % 360
      })));
    };

    const interval = setInterval(animateElements, 50);
    const resizeHandler = () => createElements();
    
    window.addEventListener('resize', resizeHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute text-purple-300 transition-all duration-300 ease-out"
          style={{
            left: element.x,
            top: element.y,
            transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.scale})`,
            opacity: element.opacity,
            width: '24px',
            height: '24px'
          }}
        >
          {element.icon}
        </div>
      ))}
    </div>
  );
}
