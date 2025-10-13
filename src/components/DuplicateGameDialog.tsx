import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Game } from "@/hooks/useGames";

interface DuplicateGameDialogProps {
  open: boolean;
  games: Game[];
  onSelect: (game: Game) => void;
  onClose: () => void;
}

export const DuplicateGameDialog = ({ open, games, onSelect, onClose }: DuplicateGameDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Version</DialogTitle>
          <DialogDescription>
            This game is available from multiple sources. Which version would you like to play?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {games.map((game) => (
            <Button
              key={`${game.id}-${game.source}`}
              variant="outline"
              className="h-auto p-4 justify-start text-left"
              onClick={() => {
                onSelect(game);
                onClose();
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{game.title}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    Source: {game.source || "gn-math"}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};