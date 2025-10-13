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
          author: game.author,
          authorLink: game.authorLink,
          featured: game.featured,
          source: "gn-math",
        }));

        // Fetch 3kh0 games list
        try {
          const khGamesResponse = await fetch(
            "https://api.github.com/repos/3kh0/3kh0-lite/contents/projects?t=" + Date.now()
          );
          const khGamesData = await khGamesResponse.json();
          
          const khGames = await Promise.all(
            khGamesData
              .filter((item: any) => item.type === "dir")
              .map(async (item: any, index: number) => {
                try {
                  // Try to fetch metadata
                  const metaResponse = await fetch(
                    `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/metadata.json`
                  );
                  const metadata = await metaResponse.json();
                  
                  return {
                    id: 10000 + index,
                    title: metadata.title || item.name,
                    name: metadata.title || item.name,
                    image: `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/${metadata.icon || "icon.png"}`,
                    cover: `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/${metadata.icon || "icon.png"}`,
                    url: `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/index.html`,
                    source: "3kh0",
                  };
                } catch {
                  // Fallback if metadata doesn't exist
                  return {
                    id: 10000 + index,
                    title: item.name.replace(/-/g, " "),
                    name: item.name.replace(/-/g, " "),
                    image: `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/icon.png`,
                    cover: `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/icon.png`,
                    url: `https://raw.githubusercontent.com/3kh0/3kh0-lite/main/projects/${item.name}/index.html`,
                    source: "3kh0",
                  };
                }
              })
          );

          setGames([...gnMathGames, ...khGames]);
        } catch (khError) {
          console.error("Failed to load 3kh0 games:", khError);
          setGames(gnMathGames);
        }

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
