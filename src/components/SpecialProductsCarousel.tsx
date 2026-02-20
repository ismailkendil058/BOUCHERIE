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
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-12 h-[1px] bg-primary" />
              <span className="text-primary font-medium uppercase tracking-[0.2em] text-xs">Sélection Premium</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
            >
              Nos <span className="text-primary italic">Spécialités</span>
            </motion.h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-sm bg-background"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-sm bg-background"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
            >
              Tout voir
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {specials.map((product, i) => (
            <motion.div
              key={product.id}
              className="snap-start flex-none w-[75vw] sm:w-[50vw] md:w-[320px] lg:w-[350px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-500">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Star className="w-3 h-3 fill-white" />
                      Incontournable
                    </div>
                  </div>

                  {product.halalCertified && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      Halal AVS
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-bold text-base text-foreground leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Info (fallback/redundant for accessibility and mobile) */}
                <div className="mt-4 px-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-semibold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-primary">
                      {product.price.toFixed(2)}€
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        /{product.priceUnit === "kg" ? "kg" : "pc"}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {product.description || "Une pièce d'exception sélectionnée pour sa qualité supérieure."}
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
