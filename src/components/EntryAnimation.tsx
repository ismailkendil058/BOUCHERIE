import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EntryAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center px-6">
            <motion.h1
              className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Boucherie de la Paix
            </motion.h1>
            <motion.div
              className="w-16 h-0.5 bg-primary mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            <motion.p
              className="text-sm md:text-lg tracking-[0.2em] uppercase text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Viandes Halal certifiées 100% AVS
            </motion.p>
            <motion.p
              className="text-xs md:text-sm tracking-[0.15em] uppercase text-muted-foreground mt-2"
              style={{ color: "hsl(0 0% 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              Qualité & Traçabilité Garantie
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryAnimation;
