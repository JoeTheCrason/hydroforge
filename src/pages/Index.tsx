import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { GameGrid } from "@/components/GameGrid";
import { GameViewer } from "@/components/GameViewer";
import { useGames, Game } from "@/hooks/useGames";
import { Particles } from "@/components/Particles";
import { DuplicateGameDialog } from "@/components/DuplicateGameDialog";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [duplicateGames, setDuplicateGames] = useState<Game[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const { games, loading } = useGames();

  // Group games by title to find duplicates
  const gamesByTitle = useMemo(() => {
    const grouped = new Map<string, Game[]>();
    games.forEach(game => {
      const normalizedTitle = game.title.toLowerCase().trim();
      if (!grouped.has(normalizedTitle)) {
        grouped.set(normalizedTitle, []);
      }
      grouped.get(normalizedTitle)!.push(game);
    });
    return grouped;
  }, [games]);

  // Get unique games (only one per title)
  const uniqueGames = useMemo(() => {
    return Array.from(gamesByTitle.values()).map(gameGroup => gameGroup[0]);
  }, [gamesByTitle]);

  const handleGameClick = (game: Game) => {
    const normalizedTitle = game.title.toLowerCase().trim();
    const duplicates = gamesByTitle.get(normalizedTitle) || [];
    
    if (duplicates.length > 1) {
      setDuplicateGames(duplicates);
      setShowDuplicateDialog(true);
    } else {
      setSelectedGame(game);
    }
  };

  const featuredGames = useMemo(() => {
    return uniqueGames.filter(game => 
      game.id === -1 || 
      [166, 467, 215, 205, 253, 259, 331, 465, 262, 468, 217, 542, 445, 446, 182, 427, 194, 267, 461, 460, 292, 453, 420, 264, 466, 226, 188].includes(game.id)
    );
  }, [uniqueGames]);

  const allGames = useMemo(() => {
    return uniqueGames.filter(game => game.id !== -1);
  }, [uniqueGames]);

  const filteredAndSortedFeaturedGames = useMemo(() => {
    let filtered = featuredGames.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [featuredGames, searchQuery, sortBy]);

  const filteredAndSortedAllGames = useMemo(() => {
    let filtered = allGames.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [allGames, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Particles />
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <main className="container py-8 px-4 md:px-6 space-y-8">
        <GameGrid 
          games={filteredAndSortedFeaturedGames}
          title="Featured Zones"
          defaultOpen={true}
          onGameClick={handleGameClick}
        />
        
        <GameGrid 
          games={filteredAndSortedAllGames}
          title="All Zones"
          defaultOpen={true}
          onGameClick={handleGameClick}
        />
      </main>

      <GameViewer game={selectedGame} onClose={() => setSelectedGame(null)} />
      <DuplicateGameDialog
        open={showDuplicateDialog}
        games={duplicateGames}
        onSelect={setSelectedGame}
        onClose={() => setShowDuplicateDialog(false)}
      />
    </div>
  );
};

export default Index;
