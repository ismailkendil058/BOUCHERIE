import { MapPin, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background py-24 mt-0 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-2">
          <Link to="/" className="group flex flex-col mb-8">
            <span className="text-3xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
              Boucherie <span className="text-primary italic">Paix</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-4 bg-primary transition-all group-hover:w-8" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 group-hover:text-primary transition-colors">Halal Certifié AVS</span>
            </div>
          </Link>
          <p className="text-white/60 text-lg leading-relaxed max-w-md mb-10">
            Votre artisan boucher de référence à Paris. Nous sélectionnons avec passion les meilleures viandes pour une expérience culinaire d'exception.
          </p>
          <div className="flex gap-6">
            {/* Social placeholders could go here */}
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H7.03v4.2h2.47V21h4.5v-9.35h3.85l.42-4.19z" /></svg>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] mb-10 text-primary font-bold">Contact</h4>
          <div className="space-y-6 text-white/60">
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm">12 Rue de la Paix, 75002 Paris</p>
            </div>
            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm">01 23 45 67 89</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] mb-10 text-primary font-bold">Horaires</h4>
          <div className="space-y-6 text-white/60">
            <div className="flex gap-4 font-medium">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div className="text-sm">
                <p className="text-white mb-1">Lundi – Samedi</p>
                <p>8h00 – 20h00</p>
              </div>
            </div>
            <div className="ml-9 text-sm leading-relaxed">
              <p className="text-white mb-1">Dimanche</p>
              <p>8h00 – 13h00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 mt-20 pt-10 flex flex-col items-center gap-6 text-center">
        <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} Boucherie de la Paix – L'excellence au service de la tradition
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">
          <Link to="#" className="hover:text-primary transition-colors">Mentions Légales</Link>
          <Link to="#" className="hover:text-primary transition-colors">CGV</Link>
          <Link to="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
