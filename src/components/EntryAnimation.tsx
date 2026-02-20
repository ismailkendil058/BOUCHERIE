import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EntryAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Total duration of the animation sequence
    const timer = setTimeout(() => {
      setShow(false);
      // Wait for the exit animation to finish before calling onComplete
      setTimeout(onComplete, 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.45, 0, 0.55, 1] }
          }}
        >
          {/* Decorative background light effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative text-center px-6 max-w-2xl">
            <div className="overflow-hidden mb-8">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <motion.span
                  className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4"
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  L'Art de la Boucherie
                </motion.span>
                <h1
                  className="text-4xl md:text-7xl font-bold text-white tracking-tighter"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Boucherie <span className="text-primary italic">Paix</span>
                </h1>
              </motion.div>
            </div>

            <motion.div
              className="w-24 h-[1px] bg-primary/30 mx-auto relative overflow-hidden mb-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1, delay: 0.6, ease: "circOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <div className="flex flex-col gap-3">
              <motion.p
                className="text-[10px] md:text-sm tracking-[0.3em] uppercase text-white/40 font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                Halal Certifié <span className="text-primary">AVS</span>
              </motion.p>

              <motion.p
                className="text-[9px] md:text-xs tracking-[0.2em] font-medium uppercase text-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                Qualité Premium & Traçabilité Garantie
              </motion.p>
            </div>
          </div>

          {/* Dynamic Corner Borders */}
          <motion.div
            className="absolute top-12 left-12 w-12 h-12 border-t border-l border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          />
          <motion.div
            className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryAnimation;
