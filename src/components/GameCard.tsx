import { Card } from "@/components/ui/card";

interface GameCardProps {
  title: string;
  image: string;
  onClick?: () => void;
}

export const GameCard = ({ title, image, onClick }: GameCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2">{title}</h3>
      </div>
    </Card>
  );
};
