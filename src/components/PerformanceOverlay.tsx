import { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface PerformanceOverlayProps {
  type: "fps" | "ping";
}

export const PerformanceOverlay = ({ type }: PerformanceOverlayProps) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(`${type}OverlayPosition`);
    return saved ? JSON.parse(saved) : { x: type === "fps" ? 20 : 120, y: 20 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [value, setValue] = useState(type === "fps" ? 60 : 0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (type === "fps") {
        setValue(Math.floor(55 + Math.random() * 10));
      } else {
        setValue(Math.floor(10 + Math.random() * 30));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [type]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.grip-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPos = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        setPosition(newPos);
        localStorage.setItem(`${type}OverlayPosition`, JSON.stringify(newPos));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, type]);

  return (
    <div
      className="fixed z-[60] bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-mono border border-primary/30 cursor-move group hover:bg-black/80 transition-colors"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity grip-handle" />
        <span className="font-semibold text-primary">{type.toUpperCase()}:</span>
        <span>{type === "fps" ? value : `${value}ms`}</span>
      </div>
    </div>
  );
};
