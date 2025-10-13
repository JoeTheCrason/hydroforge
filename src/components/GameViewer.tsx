import { useEffect, useRef, useState } from "react";
import { X, Maximize2, ExternalLink, RefreshCw, Gamepad2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Game } from "@/hooks/useGames";
import { GameBar } from "@/components/GameBar";
import { PerformanceOverlay } from "@/components/PerformanceOverlay";

interface GameViewerProps {
  game: Game | null;
  onClose: () => void;
}

export const GameViewer = ({ game, onClose }: GameViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showGameBar, setShowGameBar] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (game && iframeRef.current) {
      if (game.url.startsWith("http://") || game.url.startsWith("https://")) {
        if (!game.url.includes("cdn.jsdelivr.net")) {
          window.open(game.url, "_blank");
          onClose();
          return;
        }
      }

      fetch(game.url + "?t=" + Date.now())
        .then((response) => response.text())
        .then((html) => {
          if (iframeRef.current?.contentDocument) {
            iframeRef.current.contentDocument.open();
            iframeRef.current.contentDocument.write(html);
            iframeRef.current.contentDocument.close();
          }
        })
        .catch((error) => {
          console.error("Failed to load game:", error);
          alert("Failed to load game: " + error);
        });
    }
  }, [game, onClose, refreshKey]);

  if (!game) return null;

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open("about:blank", "_blank");
    if (newWindow && game) {
      fetch(game.url + "?t=" + Date.now())
        .then((response) => response.text())
        .then((html) => {
          newWindow.document.open();
          newWindow.document.write(html);
          newWindow.document.close();
        });
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="h-full w-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{game.name}</h2>
            {game.author && (
              <p className="text-sm text-muted-foreground">
                by{" "}
                {game.authorLink ? (
                  <a
                    href={game.authorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {game.author}
                  </a>
                ) : (
                  game.author
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleFullscreen}
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleOpenInNewTab}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPerformance(!showPerformance)}
              title="Performance Overlay"
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowGameBar(!showGameBar)}
              title="Game Bar"
            >
              <Gamepad2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 relative bg-black">
          <iframe
            ref={iframeRef}
            key={refreshKey}
            className="w-full h-full border-0"
            title={game.name}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"
          />
        </div>
      </div>
      {showGameBar && <GameBar onClose={() => setShowGameBar(false)} />}
      {showPerformance && (
        <>
          <PerformanceOverlay type="fps" />
          <PerformanceOverlay type="ping" />
        </>
      )}
    </div>
  );
};
