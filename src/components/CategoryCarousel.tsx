import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { motion } from "framer-motion";

const CategoryCarousel = () => {
  const { categories } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 md:py-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-12 h-[1px] bg-primary" />
              <span className="text-primary font-medium uppercase tracking-[0.2em] text-xs">Découvrez notre gamme</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
            >
              Nos <span className="text-primary italic">Catégories</span>
            </motion.h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-sm"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-sm"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide pb-8 pt-4 snap-x snap-mandatory touch-pan-y"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex-none"
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="group block text-center"
                >
                  <div className="relative w-40 h-40 md:w-56 md:h-56 mb-6 mx-auto">
                    <div className="absolute inset-0 rounded-3xl border border-primary/20 scale-110 group-hover:scale-125 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                    <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-background shadow-xl relative z-10 group-hover:shadow-2xl transition-all duration-500">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-[0.15em] group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-0.5 bg-primary mx-auto mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
