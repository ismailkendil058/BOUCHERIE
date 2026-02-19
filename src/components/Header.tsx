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
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Boucherie de la Paix
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary">Halal Certifié AVS</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm tracking-wide uppercase hover:text-primary transition-colors">Accueil</Link>
            <Link to="/products" className="text-sm tracking-wide uppercase hover:text-primary transition-colors">Produits</Link>
            <Link to="/cart" className="relative text-sm tracking-wide uppercase hover:text-primary transition-colors flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              Panier
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm tracking-wide uppercase hover:text-primary transition-colors flex items-center gap-1">
                <User className="w-4 h-4" /> Admin
              </Link>
            )}
            {!isAdmin && (
              <Link to="/admin/login" className="text-sm tracking-wide uppercase hover:text-primary transition-colors">
                <User className="w-4 h-4" />
              </Link>
            )}
          </nav>

          {/* Mobile nav toggle */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden border-t border-border bg-background"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide uppercase">Accueil</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide uppercase">Produits</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide uppercase">Panier</Link>
              {isAdmin ? (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide uppercase">Dashboard Admin</Link>
              ) : (
                <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="text-sm tracking-wide uppercase">Connexion Admin</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
