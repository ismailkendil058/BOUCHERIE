import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useStore();
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      <Header />
      <main className="min-h-screen pb-24">
        {/* Banner Section */}
        <div className="relative h-[40vh] bg-foreground overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600"
              className="w-full h-full object-cover opacity-40 blur-[2px]"
              alt="Boucherie Header"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background" />
          </div>
          <div className="relative text-center px-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4 block"
            >
              Sélection Artisanale
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white"
            >
              Nos <span className="text-primary italic">Produits</span>
            </motion.h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          {/* Controls Bar */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100 mb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher une pièce d'exception..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-secondary/50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary/20 transition-all text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSearchParams({})}
                  className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${activeCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-foreground hover:bg-primary/5 border border-transparent hover:border-primary/10"}`}
                >
                  Tous
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ category: cat.id })}
                    className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${activeCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-foreground hover:bg-primary/5 border border-transparent hover:border-primary/10"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />

                    {product.halalCertified && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-foreground text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-primary/5">
                        Halal AVS
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-lg mb-0.5">{product.price.toFixed(2)}€ <span className="text-[10px] font-normal opacity-70">/{product.priceUnit === "kg" ? "kg" : "pc"}</span></p>
                    </div>
                  </div>

                  <div className="mt-4 px-1">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-medium text-[10px]">{product.category}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-32 bg-secondary/30 rounded-3xl border-2 border-dashed border-border">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-muted-foreground">Aucun produit trouvé dans cette sélection.</p>
              <button
                onClick={() => { setSearchQuery(""); setSearchParams({}); }}
                className="mt-4 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
