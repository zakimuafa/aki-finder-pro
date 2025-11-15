import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  type: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export const ProductCard = ({ name, type, price, stock, category, image }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border">
      <CardHeader className="p-0">
        <div className="h-48 bg-muted flex items-center justify-center">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-muted-foreground text-sm">Gambar Produk</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {category}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{type}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-secondary">
            Rp {price.toLocaleString('id-ID')}
          </span>
          <span className={`text-sm font-semibold ${stock > 0 ? 'text-accent' : 'text-destructive'}`}>
            Stok: {stock}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge 
          variant={stock > 0 ? "default" : "destructive"}
          className="w-full justify-center"
        >
          {stock > 0 ? 'Tersedia' : 'Habis'}
        </Badge>
      </CardFooter>
    </Card>
  );
};
