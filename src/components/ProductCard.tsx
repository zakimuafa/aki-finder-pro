import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  type: string;
  stock: number;
  category: string;
}

export const ProductCard = ({
  name,
  type,
  stock,
  category,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            {category}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3">Volt: {type}</p>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold ${
              stock > 0 ? "text-accent" : "text-destructive"
            }`}
          >
            Stok: {stock}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge
          variant={stock > 0 ? "default" : "destructive"}
          className="w-full justify-center"
        >
          {stock > 0 ? "Tersedia" : "Habis"}
        </Badge>
      </CardFooter>
    </Card>
  );
};
