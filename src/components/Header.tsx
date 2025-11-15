import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-toko-aki.png";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Toko Aki" className="h-10 w-10 object-contain" />
          <span className="text-secondary font-bold text-xl hidden sm:inline">Toko Aki</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-secondary hover:text-secondary hover:bg-secondary/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};
