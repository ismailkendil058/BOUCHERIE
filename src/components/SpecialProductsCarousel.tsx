import { useRef } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const SpecialProductsCarousel = () => {
  const { products } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const specials = products.filter((p) => p.featured && p.inStock);

  if (specials.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Nos Spécialités</h2>
            <Star className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {specials.map((product, i) => (
            <motion.div
              key={product.id}
              className="snap-start flex-none w-[62vw] sm:w-[38vw] md:w-[260px] lg:w-[280px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              viewport={{ once: true }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-primary-foreground" />
                    Spécial
                  </div>
                  {product.halalCertified && (
                    <div className="absolute top-2 right-2 bg-background/90 text-foreground text-[10px] uppercase tracking-widest px-2 py-0.5">
                      Halal
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="pt-3 pb-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5 truncate">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-sm md:text-base leading-snug truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold mt-1">
                    {product.price.toFixed(2)} €
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      /{product.priceUnit === "kg" ? "kg" : "pièce"}
                    </span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialProductsCarousel;
