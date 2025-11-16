import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const categories = [
  "Aki Motor",
  "Aki Mobil",
  "Aki Second",
  "Klem",
  "Kondom",
  "Kabel Paralel",
  "Aki Bekas",
];

export const Sidebar = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategorySelect,
}: SidebarProps) => {
  const handleCategoryClick = (category: string) => {
    onCategorySelect(selectedCategory === category ? null : category);
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
          <h2 className="text-xl font-bold text-secondary">Kategori Produk</h2>
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
            <li>
              <button
                onClick={() => {
                  onCategorySelect(null);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? "bg-secondary text-secondary-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent"
                }`}
              >
                Semua Produk
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => {
                    handleCategoryClick(category);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent"
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
