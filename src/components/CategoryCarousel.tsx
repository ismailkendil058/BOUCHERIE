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
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Catégories</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto" />
        </div>

        <div className="relative">
          <button onClick={() => scroll("left")} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg rounded-full p-2 hover:bg-secondary transition-colors hidden md:block">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="group flex-shrink-0 w-48 md:w-56 snap-start border-0"
                >
                  <div className="w-48 h-48 md:w-56 md:aspect-square overflow-hidden mb-4 border-0 rounded-none">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 border-0 rounded-none"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-center text-sm uppercase tracking-widest group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <button onClick={() => scroll("right")} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-background shadow-lg rounded-full p-2 hover:bg-secondary transition-colors hidden md:block">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
