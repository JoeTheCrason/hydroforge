import { useState, useEffect } from "react";

const COVER_URL = "https://cdn.jsdelivr.net/gh/gn-math/covers@main";
const HTML_URL = "https://cdn.jsdelivr.net/gh/gn-math/html@main";

export interface Game {
  id: number;
  title: string;
  name: string;
  image: string;
  cover: string;
  url: string;
  author?: string;
  authorLink?: string;
  featured?: boolean;
  source?: string;
}

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Fetch gn-math games
        const gnMathResponse = await fetch(
          "https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json?t=" + Date.now()
        );
        const gnMathData = await gnMathResponse.json();
        
        const gnMathGames = gnMathData.map((game: any) => ({
          id: game.id,
          title: game.name,
          name: game.name,
          image: game.cover.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL),
          cover: game.cover.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL),
          url: game.url.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL),
          author: game.id === 253 ? "Hydroforge" : game.author,
          authorLink: game.id === 253 ? undefined : game.authorLink,
          featured: game.featured,
          source: "gn-math",
        }));

        setGames(gnMathGames);

        setLoading(false);
      } catch (err) {
        setError("Failed to load games");
        setLoading(false);
        console.error(err);
      }
    };

    fetchGames();
  }, []);

  return { games, loading, error };
};
