import { useStore } from "@/contexts/StoreContext";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Grid3X3, LogOut } from "lucide-react";

const AdminLayout = () => {
  const { isAdmin, logout } = useStore();

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`;

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-background border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-sm uppercase tracking-widest">Admin</h2>
          <p className="text-xs text-muted-foreground">Boucherie de la Paix</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <NavLink to="/admin" end className={linkClass}><LayoutDashboard className="w-4 h-4" /> Dashboard</NavLink>
          <NavLink to="/admin/orders" className={linkClass}><ShoppingCart className="w-4 h-4" /> Commandes</NavLink>
          <NavLink to="/admin/products" className={linkClass}><Package className="w-4 h-4" /> Produits</NavLink>
          <NavLink to="/admin/categories" className={linkClass}><Grid3X3 className="w-4 h-4" /> Catégories</NavLink>
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => logout()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-secondary p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
