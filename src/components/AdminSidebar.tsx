import { X, LayoutDashboard, ShoppingCart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
    { path: "/cashier", label: "Kasir", icon: ShoppingCart },
    { path: "/reports", label: "Laporan Penjualan", icon: BarChart3 },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-sidebar border-l border-sidebar-border z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary">Menu Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:text-secondary"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      isActive
                        ? "bg-secondary text-secondary-foreground font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
