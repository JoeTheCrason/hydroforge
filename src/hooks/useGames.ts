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
}

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json?t=" + Date.now()
        );
        const data = await response.json();
        
        const transformedGames = data.map((game: any) => ({
          id: game.id,
          title: game.name,
          name: game.name,
          image: game.cover.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL),
          cover: game.cover.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL),
          url: game.url.replace("{COVER_URL}", COVER_URL).replace("{HTML_URL}", HTML_URL),
          author: game.author,
          authorLink: game.authorLink,
          featured: game.featured,
        }));

        setGames(transformedGames);
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
