import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1588347818036-558601350947?w=1200&q=80",
    title: "L'Excellence de la Viande Halal",
    subtitle: "Certifiée AVS – Qualité & Traçabilité",
  },
  {
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    title: "Des Pièces d'Exception",
    subtitle: "Sélectionnées avec soin par nos artisans bouchers",
  },
  {
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=1200&q=80",
    title: "Savoir-Faire Artisanal",
    subtitle: "La tradition au service de l'excellence",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div>
          <motion.h1
            key={`title-${current}`}
            className="text-3xl md:text-6xl font-bold text-background mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {slides[current].title}
          </motion.h1>
          <motion.p
            key={`sub-${current}`}
            className="text-sm md:text-lg tracking-widest uppercase mb-8"
            style={{ color: "hsl(0 0% 80%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {slides[current].subtitle}
          </motion.p>
          <div className="flex gap-4 justify-center">
            <a href="/products" className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Commander maintenant
            </a>
            <a href="/products" className="border border-background/50 text-background px-8 py-3 text-sm uppercase tracking-widest hover:bg-background/10 transition-colors">
              Découvrir
            </a>
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-background/70 hover:text-background transition-colors">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-background/70 hover:text-background transition-colors">
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-background/40"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
