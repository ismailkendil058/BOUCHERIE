import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCarousel from "@/components/CategoryCarousel";
import SpecialProductsCarousel from "@/components/SpecialProductsCarousel";
import EntryAnimation from "@/components/EntryAnimation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Truck, Award } from "lucide-react";

const Index = () => {
  const [showEntry, setShowEntry] = useState(() => {
    const seen = sessionStorage.getItem("entry_seen");
    return !seen;
  });

  const handleEntryComplete = useCallback(() => {
    setShowEntry(false);
    sessionStorage.setItem("entry_seen", "true");
  }, []);

  return (
    <>
      {showEntry && <EntryAnimation onComplete={handleEntryComplete} />}
      <Header />
      <main>
        <HeroCarousel />
        <CategoryCarousel />
        <SpecialProductsCarousel />

        {/* Trust section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
              >
                Engagement Qualité
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold">Pourquoi nous <span className="text-primary italic">faire confiance</span> ?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: Shield,
                  title: "Halal Certifié AVS",
                  desc: "Toutes nos viandes sont certifiées par l'organisme AVS, garantissant le respect le plus strict des normes halal.",
                  color: "bg-red-50"
                },
                {
                  icon: Award,
                  title: "Qualité Premium",
                  desc: "Une sélection rigoureuse des meilleures pièces de viande charolaise et bovine, choisies pour leur tendreté.",
                  color: "bg-amber-50"
                },
                {
                  icon: Truck,
                  title: "Livraison Île-de-France",
                  desc: "Service de livraison rapide et soigné dans tout Paris et sa banlieue proche, pour une fraîcheur garantie.",
                  color: "bg-blue-50"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="relative group p-10 bg-secondary/50 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600"
              className="w-full h-full object-cover"
              alt="Boucherie premium"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/95 mix-blend-multiply" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Une envie de viande <span className="italic">d'exception</span> ?
              </h2>
              <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                Commandez dès maintenant et recevez vos produits favoris directement chez vous, préparés avec passion.
              </p>
              <Link
                to="/products"
                className="inline-block bg-white text-primary px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-white transition-all duration-300 shadow-2xl"
              >
                Accéder à la boutique
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
