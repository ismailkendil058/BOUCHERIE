import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { itemCount } = useCart();
  const { isAdmin } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="group flex flex-col">
            <span className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
              Boucherie <span className="text-primary italic">Paix</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-4 bg-primary transition-all group-hover:w-8" />
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-muted-foreground group-hover:text-primary transition-colors">Halal Certifié AVS</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {["Accueil", "Produits", "Panier"].map((item) => {
              const to = item === "Accueil" ? "/" : `/${item.toLowerCase().replace("panier", "cart")}`;
              return (
                <Link
                  key={item}
                  to={to}
                  className="relative text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors group py-2"
                >
                  {item}
                  {item === "Panier" && itemCount > 0 && (
                    <span className="ml-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>
              );
            })}

            {isAdmin ? (
              <Link to="/admin" className="p-2 border border-border rounded-full hover:bg-primary hover:text-white transition-all group">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/admin/login" className="p-2 border border-border rounded-full hover:bg-primary hover:text-white transition-all group">
                <User className="w-5 h-5" />
              </Link>
            )}
          </nav>

          {/* Mobile nav toggle */}
          <div className="flex md:hidden items-center gap-6">
            <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl overflow-hidden z-50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <nav className="flex flex-col py-8 px-6 gap-6">
              {[
                { name: "Accueil", path: "/" },
                { name: "Nos Produits", path: "/products" },
                { name: "Mon Panier", path: "/cart" },
                isAdmin ? { name: "Dashboard Admin", path: "/admin" } : { name: "Accès Admin", path: "/admin/login" }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-bold uppercase tracking-widest text-foreground hover:text-primary flex justify-between items-center"
                  >
                    {item.name}
                    <div className="w-8 h-[1px] bg-border group-hover:bg-primary transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
