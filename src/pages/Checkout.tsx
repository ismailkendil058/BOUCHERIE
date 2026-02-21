import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { addOrder } = useStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!pickupDate || !pickupTime) {
      toast.error("Veuillez sélectionner une date et heure de retrait.");
      return;
    }

    addOrder({
      items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      customer: { firstName, lastName, phone },
      mode: "pickup",
      pickupDate,
      pickupTime,
      deliveryFee: 0,
      subtotal: total,
      total: total,
    });

    clearCart();
    toast.success("Commande validée avec succès !");
    navigate("/");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2 text-center">Validation de commande</h1>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-10" />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer info */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Prénom *</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Nom *</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Téléphone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
              </div>
            </section>

            {/* Mode (Always Pickup) */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Retrait en magasin</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Toutes les commandes sont à retirer directement dans notre boutique à l'heure qui vous convient.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Jour de retrait *</label>
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Heure de retrait *</label>
                  <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} × {item.product.priceUnit === "kg" ? `${item.quantity.toFixed(2)} kg` : item.quantity}</span>
                    <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </section>

            <button type="submit" className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Confirmer la commande
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
