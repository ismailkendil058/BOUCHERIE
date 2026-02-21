import { useStore } from "@/contexts/StoreContext";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Grid3X3, LogOut, Menu, Truck } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLayout = () => {
  const { isAdmin, loading, logout } = useStore();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`;

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-sm uppercase tracking-widest">Admin</h2>
        <p className="text-xs text-muted-foreground">Boucherie de la Paix</p>
      </div>
      <nav className="flex-1 py-4 space-y-1">
        <NavLink to="/admin" end className={linkClass} onClick={onNavigate}>
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass} onClick={onNavigate}>
          <ShoppingCart className="w-4 h-4" /> Commandes
        </NavLink>
        <NavLink to="/admin/products" className={linkClass} onClick={onNavigate}>
          <Package className="w-4 h-4" /> Produits
        </NavLink>
        <NavLink to="/admin/categories" className={linkClass} onClick={onNavigate}>
          <Grid3X3 className="w-4 h-4" /> Catégories
        </NavLink>
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={async () => {
            const logoutPromise = logout();
            toast.promise(logoutPromise, {
              loading: "Déconnexion...",
              success: "Déconnecté avec succès",
              error: "Erreur lors de la déconnexion",
            });
            await logoutPromise;
            if (onNavigate) onNavigate();
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full p-2"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary/30">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest">Admin</h2>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-background border-r border-border flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-65px)] md:h-screen">
        <div className="max-w-7xl mx-auto pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
