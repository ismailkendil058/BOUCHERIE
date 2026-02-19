import { MapPin, Phone, Clock } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Boucherie de la Paix
          </h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Votre boucherie halal de confiance à Paris. Viandes certifiées AVS, qualité premium et traçabilité garantie.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest mb-4 text-primary">Contact</h4>
          <div className="space-y-3 text-sm opacity-70">
            <p className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4 text-primary" /> 12 Rue de la Paix, 75002 Paris</p>
            <p className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-primary" /> 01 23 45 67 89</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest mb-4 text-primary">Horaires</h4>
          <div className="space-y-2 text-sm opacity-70">
            <p className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-primary" /> Lun – Sam : 8h – 20h</p>
            <p>Dimanche : 8h – 13h</p>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 mt-8 pt-8 text-center text-xs opacity-50">
        © {new Date().getFullYear()} Boucherie de la Paix – Tous droits réservés
      </div>
    </div>
  </footer>
);

export default Footer;
