import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { deliveryZones, addOrder } = useStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  const zone = deliveryZones.find((z) => z.id === selectedZone);
  const deliveryFee = mode === "delivery" && zone ? zone.price : 0;
  const grandTotal = total + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (mode === "pickup" && (!pickupDate || !pickupTime)) {
      toast.error("Veuillez sélectionner une date et heure de retrait.");
      return;
    }
    if (mode === "delivery" && !selectedZone) {
      toast.error("Veuillez sélectionner une zone de livraison.");
      return;
    }

    addOrder({
      items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      customer: { firstName, lastName, phone },
      mode,
      pickupDate: mode === "pickup" ? pickupDate : undefined,
      pickupTime: mode === "pickup" ? pickupTime : undefined,
      deliveryZone: zone,
      deliveryFee,
      subtotal: total,
      total: grandTotal,
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

            {/* Mode */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Mode de réception</h2>
              <div className="flex gap-4">
                <button type="button" onClick={() => setMode("pickup")} className={`flex-1 py-3 text-sm uppercase tracking-widest border transition-colors ${mode === "pickup" ? "bg-foreground text-background" : "border-border hover:border-foreground"}`}>
                  🏪 Retrait en magasin
                </button>
                <button type="button" onClick={() => setMode("delivery")} className={`flex-1 py-3 text-sm uppercase tracking-widest border transition-colors ${mode === "delivery" ? "bg-foreground text-background" : "border-border hover:border-foreground"}`}>
                  🚚 Livraison
                </button>
              </div>

              {mode === "pickup" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Jour de retrait *</label>
                    <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Heure de retrait *</label>
                    <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                </div>
              )}

              {mode === "delivery" && (
                <div className="mt-4">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Zone de livraison *</label>
                  <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" required>
                    <option value="">Sélectionnez votre arrondissement</option>
                    {deliveryZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} – {z.price.toFixed(2)} €
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                {mode === "delivery" && (
                  <div className="flex justify-between text-sm">
                    <span>Livraison ({zone?.name || "–"})</span>
                    <span>{deliveryFee.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span>{grandTotal.toFixed(2)} €</span>
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
