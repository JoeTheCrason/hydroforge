import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { GameGrid } from "@/components/GameGrid";
import { GameViewer } from "@/components/GameViewer";
import { useGames, Game } from "@/hooks/useGames";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { games, loading } = useGames();

  const featuredGames = useMemo(() => {
    return games.filter(game => 
      game.id === -1 || 
      [166, 467, 215, 205, 253, 259, 331, 465, 262, 468, 217, 542, 445, 446, 182, 427, 194, 267, 461, 460, 292, 453, 420, 264, 466, 226, 188].includes(game.id)
    );
  }, [games]);

  const allGames = useMemo(() => {
    return games;
  }, [games]);

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
    <div className="min-h-screen bg-background">
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
          onGameClick={setSelectedGame}
        />
        
        <GameGrid 
          games={filteredAndSortedAllGames}
          title="All Zones"
          defaultOpen={false}
          onGameClick={setSelectedGame}
        />
      </main>

      <GameViewer game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
};

export default Index;
