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
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Nos Produits</h1>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-10" />

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-none focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSearchParams({})}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition-colors ${activeCategory === "all" ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`px-5 py-2 text-xs uppercase tracking-widest border transition-colors ${activeCategory === cat.id ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="aspect-square overflow-hidden mb-4 bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    {product.halalCertified && (
                      <span className="text-[10px] uppercase tracking-widest text-primary">Halal AVS</span>
                    )}
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.price.toFixed(2)} € / {product.priceUnit === "kg" ? "kg" : "pièce"}
                    </p>
                    <span className="inline-block mt-2 text-xs uppercase tracking-widest border-b border-foreground pb-0.5 group-hover:border-primary group-hover:text-primary transition-colors">
                      Voir le produit
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-20">Aucun produit trouvé dans cette catégorie.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
