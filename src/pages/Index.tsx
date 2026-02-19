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
        <section className="py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "Halal Certifié AVS", desc: "Toutes nos viandes sont certifiées par l'organisme AVS, garantissant le respect des normes halal." },
                { icon: Award, title: "Qualité Premium", desc: "Des pièces sélectionnées avec soin auprès des meilleurs éleveurs français." },
                { icon: Truck, title: "Livraison Paris", desc: "Livraison dans tout Paris, ou retrait en magasin selon votre convenance." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="text-center p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commander ?</h2>
            <p className="text-muted-foreground mb-8">Découvrez notre sélection de viandes halal premium et produits frais.</p>
            <Link to="/products" className="inline-block bg-primary text-primary-foreground px-10 py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Voir tous nos produits
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
