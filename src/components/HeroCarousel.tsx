import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&q=80&w=1920",
    title: "L'Excellence de la Viande Halal",
    subtitle: "Certifiée AVS – Qualité & Traçabilité",
  },
  {
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1920",
    title: "Des Pièces d'Exception",
    subtitle: "Sélectionnées avec soin par nos artisans bouchers",
  },
  {
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&q=80&w=1920",
    title: "Savoir-Faire Artisanal",
    subtitle: "La tradition au service de l'excellence",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, []);



  return (
    <section className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover opacity-60"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="text-primary font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {slides[current].subtitle}
            </motion.span>

            <h1
              className="text-4xl md:text-8xl font-bold text-white mb-10 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {current === 0 ? (
                <>L'Excellence de la <span className="text-primary italic">Viande Halal</span></>
              ) : current === 1 ? (
                <>Des Pièces <span className="text-primary italic">d'Exception</span></>
              ) : (
                <>Savoir-Faire <span className="text-primary italic">Artisanal</span></>
              )}
            </h1>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <Link
                to="/products"
                className="bg-primary text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-300 shadow-xl"
              >
                Commander maintenant
              </Link>
              <Link
                to="/products"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-foreground transition-all duration-300"
              >
                Découvrir
              </Link>
            </div>
          </motion.div>
        </div>
      </div>



      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group py-2"
          >
            <div className={`h-1 transition-all duration-500 rounded-full ${i === current ? "bg-primary w-12" : "bg-white/30 w-6 group-hover:bg-white/60"}`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
