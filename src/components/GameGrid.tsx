import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GameCard } from "./GameCard";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Game } from "@/hooks/useGames";

interface GameGridProps {
  games: Game[];
  title: string;
  defaultOpen?: boolean;
  onGameClick: (game: Game) => void;
}

export const GameGrid = ({ games, title, defaultOpen = true, onGameClick }: GameGridProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-lg font-semibold hover:bg-secondary/50 p-0 h-auto">
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
            {title} ({games.length})
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              image={game.image}
              onClick={() => onGameClick(game)}
              isContactCard={game.id === -1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
