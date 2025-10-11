import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { GameGrid } from "@/components/GameGrid";

const featuredGames = [
  { id: 1, title: "[!] SUGGEST GAMES .gg/D4c9VFYWyU", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/dc.png" },
  { id: 2, title: "Bad Parenting 1", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/166.png" },
  { id: 3, title: "Baldi's Basics Plus", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/467.png" },
  { id: 4, title: "Bendy and the Ink Machine", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/215.png" },
  { id: 5, title: "Buckshot Roulette", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/205.png" },
  { id: 6, title: "Chat Bot (A.|.I)", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/253.png" },
  { id: 7, title: "Class of '09", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/259.png" },
  { id: 8, title: "Crazy Cars", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/331.png" },
  { id: 9, title: "Cuphead", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/465.png" },
  { id: 10, title: "Half Life", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/262.png" },
  { id: 11, title: "Hollow Knight", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/468.png" },
  { id: 12, title: "Hotline Miami", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/217.png" },
  { id: 13, title: "Karlson", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/542.png" },
  { id: 14, title: "Kindergarten", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/445.png" },
  { id: 15, title: "Kindergarten 2", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/446.png" },
  { id: 16, title: "Minecraft 1.12.2", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/182.png" },
  { id: 17, title: "OMORI", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/427.png" },
  { id: 18, title: "People Playground", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/194.png" },
  { id: 19, title: "Pizza Tower", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/267.png" },
  { id: 20, title: "PUBG", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/461.png" },
  { id: 21, title: "Rust", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/460.png" },
  { id: 22, title: "Skibidi Toilet Tower Defense", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/292.png" },
  { id: 23, title: "Sonic 3D Blast", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/453.png" },
  { id: 24, title: "Sonic Robo Blast 2", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/420.png" },
  { id: 25, title: "Terraria", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/264.png" },
  { id: 26, title: "Titanfall 2", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/466.png" },
  { id: 27, title: "Undertale", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/226.png" },
  { id: 28, title: "Friday Night Funkin'", image: "https://cdn.jsdelivr.net/gh/gn-math/covers@main/188.png" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedGames = useMemo(() => {
    let filtered = featuredGames.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <main className="container py-8 px-4 md:px-6">
        <GameGrid 
          games={filteredAndSortedGames}
          title="Featured Zones"
          defaultOpen={true}
        />
      </main>
    </div>
  );
};

export default Index;
