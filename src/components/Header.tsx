import { Menu, LogOut, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-toko-aki.png";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl hidden sm:inline">
            DR.Battery
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!user ? (
            <Button
              onClick={() => navigate("/auth")}
              variant="secondary"
              size="sm"
              className="flex"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login / Daftar
            </Button>
          ) : (
            <>
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin")}
                  variant="secondary"
                  size="sm"
                  className="flex"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-white hover:text-white hover:bg-white/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-white hover:text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
