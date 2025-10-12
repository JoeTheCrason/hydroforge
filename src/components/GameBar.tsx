import { useState, useEffect, useRef } from "react";
import { GripVertical, X, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface GameBarProps {
  onClose: () => void;
}

export const GameBar = ({ onClose }: GameBarProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [fps, setFps] = useState(60);
  const [ping, setPing] = useState(0);
  const [showFps, setShowFps] = useState(true);
  const [showPing, setShowPing] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
  const barRef = useRef<HTMLDivElement>(null);
  const lastFrameTime = useRef(Date.now());

  useEffect(() => {
    const calculateFps = () => {
      const now = Date.now();
      const delta = now - lastFrameTime.current;
      const currentFps = Math.round(1000 / delta);
      setFps(Math.min(currentFps, 144));
      lastFrameTime.current = now;
    };

    const interval = setInterval(calculateFps, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const measurePing = async () => {
      const start = Date.now();
      try {
        await fetch(window.location.href, { method: 'HEAD', cache: 'no-cache' });
        setPing(Date.now() - start);
      } catch {
        setPing(0);
      }
    };

    measurePing();
    const interval = setInterval(measurePing, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
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

  const moveCrosshair = (dx: number, dy: number) => {
    setCrosshairPos(prev => ({
      x: Math.max(0, Math.min(100, prev.x + dx)),
      y: Math.max(0, Math.min(100, prev.y + dy)),
    }));
  };

  const resetSettings = () => {
    setShowFps(true);
    setShowPing(true);
    setShowCrosshair(false);
    setCrosshairPos({ x: 50, y: 50 });
  };

  return (
    <>
      <div
        ref={barRef}
        style={{ left: position.x, top: position.y }}
        className="fixed z-[60] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl p-4 min-w-[280px] cursor-move group"
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
            <Label className="text-sm">FPS Counter</Label>
            <div className="flex items-center gap-2">
              {showFps && <span className="text-sm font-mono text-primary">{fps} FPS</span>}
              <Switch checked={showFps} onCheckedChange={setShowFps} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Ping Counter</Label>
            <div className="flex items-center gap-2">
              {showPing && <span className="text-sm font-mono text-primary">{ping}ms</span>}
              <Switch checked={showPing} onCheckedChange={setShowPing} />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Crosshair</Label>
              <Switch checked={showCrosshair} onCheckedChange={setShowCrosshair} />
            </div>

            {showCrosshair && (
              <div className="space-y-2 pl-2">
                <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
                  <div />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveCrosshair(0, -1)}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <div />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveCrosshair(-1, 0)}
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCrosshairPos({ x: 50, y: 50 })}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveCrosshair(1, 0)}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <div />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveCrosshair(0, 1)}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  readOnly
                  value={`X: ${crosshairPos.x.toFixed(1)}%, Y: ${crosshairPos.y.toFixed(1)}%`}
                  className="text-center text-xs font-mono"
                />
              </div>
            )}
          </div>

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

      {showCrosshair && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${crosshairPos.x}%`,
            top: `${crosshairPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative w-6 h-6">
            <div className="absolute left-1/2 top-0 w-0.5 h-2 bg-primary -translate-x-1/2" />
            <div className="absolute left-1/2 bottom-0 w-0.5 h-2 bg-primary -translate-x-1/2" />
            <div className="absolute top-1/2 left-0 h-0.5 w-2 bg-primary -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 h-0.5 w-2 bg-primary -translate-y-1/2" />
            <div className="absolute left-1/2 top-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}
    </>
  );
};
