import { useState, useEffect, useRef } from "react";
import { GripVertical, X, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface GameBarProps {
  onClose: () => void;
}

export const GameBar = ({ onClose }: GameBarProps) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("gameBarPosition");
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 360, y: 80 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showCrosshair, setShowCrosshair] = useState(() => {
    const saved = localStorage.getItem("showCrosshair");
    return saved === "true";
  });
  const [crosshairPos, setCrosshairPos] = useState(() => {
    const saved = localStorage.getItem("crosshairPos");
    return saved ? JSON.parse(saved) : { x: 50, y: 50 };
  });
  const [crosshairType, setCrosshairType] = useState(() => {
    return localStorage.getItem("crosshairType") || "default";
  });
  const [crosshairRotation, setCrosshairRotation] = useState(() => {
    const saved = localStorage.getItem("crosshairRotation");
    return saved ? parseInt(saved) : 0;
  });
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      setPosition(newPos);
      localStorage.setItem("gameBarPosition", JSON.stringify(newPos));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    localStorage.setItem("showCrosshair", showCrosshair.toString());
  }, [showCrosshair]);

  useEffect(() => {
    localStorage.setItem("crosshairPos", JSON.stringify(crosshairPos));
  }, [crosshairPos]);

  useEffect(() => {
    localStorage.setItem("crosshairType", crosshairType);
  }, [crosshairType]);

  useEffect(() => {
    localStorage.setItem("crosshairRotation", crosshairRotation.toString());
  }, [crosshairRotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const moveCrosshair = (direction: 'up' | 'down' | 'left' | 'right') => {
    setCrosshairPos(prev => {
      const step = 0.5;
      switch (direction) {
        case 'up': return { ...prev, y: Math.max(0, prev.y - step) };
        case 'down': return { ...prev, y: Math.min(100, prev.y + step) };
        case 'left': return { ...prev, x: Math.max(0, prev.x - step) };
        case 'right': return { ...prev, x: Math.min(100, prev.x + step) };
      }
    });
  };

  const handleXChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setCrosshairPos(prev => ({ ...prev, x: num }));
    }
  };

  const handleYChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setCrosshairPos(prev => ({ ...prev, y: num }));
    }
  };

  const resetCrosshair = () => {
    setCrosshairPos({ x: 50, y: 50 });
  };

  const resetSettings = () => {
    setShowCrosshair(false);
    setCrosshairPos({ x: 50, y: 50 });
    setCrosshairType("default");
    setCrosshairRotation(0);
    localStorage.removeItem("showCrosshair");
    localStorage.removeItem("crosshairPos");
    localStorage.removeItem("crosshairType");
    localStorage.removeItem("crosshairRotation");
  };

  return (
    <>
      <div
        ref={barRef}
        style={{ left: position.x, top: position.y }}
        className="fixed z-[60] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl p-4 min-w-[320px] cursor-move group"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-semibold text-sm">Game Bar</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Crosshair</Label>
            <Switch checked={showCrosshair} onCheckedChange={setShowCrosshair} />
          </div>

          {showCrosshair && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Crosshair Type</Label>
                  <Select value={crosshairType} onValueChange={setCrosshairType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="dot">Dot</SelectItem>
                      <SelectItem value="cross">Cross</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Rotation</Label>
                    <span className="text-xs text-muted-foreground">{crosshairRotation}°</span>
                  </div>
                  <Slider
                    value={[crosshairRotation]}
                    onValueChange={(values) => setCrosshairRotation(values[0])}
                    min={0}
                    max={360}
                    step={15}
                  />
                </div>

                <Label className="text-xs font-semibold">Position Controls</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">X (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={crosshairPos.x.toFixed(2)}
                      onChange={(e) => handleXChange(e.target.value)}
                      className="h-9 text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Y (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={crosshairPos.y.toFixed(2)}
                      onChange={(e) => handleYChange(e.target.value)}
                      className="h-9 text-center"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <Button size="sm" variant="outline" onClick={() => moveCrosshair('up')}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <div />
                  <Button size="sm" variant="outline" onClick={() => moveCrosshair('left')}>
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetCrosshair}>
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => moveCrosshair('right')}>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <div />
                  <Button size="sm" variant="outline" onClick={() => moveCrosshair('down')}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <div />
                </div>
              </div>
            </>
          )}

          <Separator />

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={resetSettings}
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>

    </>
  );
};
