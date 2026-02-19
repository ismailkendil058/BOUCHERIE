import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">Découvrez nos produits et ajoutez-les à votre panier.</p>
          <Link to="/products" className="bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
            Voir nos produits
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2 text-center">Votre Panier</h1>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-10" />

          <div className="space-y-6">
            {items.map((item) => {
              const isKg = item.product.priceUnit === "kg";
              const step = isKg ? 0.25 : 1;
              const min = isKg ? 0.25 : 1;
              return (
                <div key={item.product.id} className="flex gap-4 border-b border-border pb-6">
                  <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.price.toFixed(2)} € / {isKg ? "kg" : "pièce"}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(min, item.quantity - step))} className="w-8 h-8 border border-border flex items-center justify-center hover:bg-secondary">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-14 text-center">{isKg ? `${item.quantity.toFixed(2)} kg` : item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + step)} className="w-8 h-8 border border-border flex items-center justify-center hover:bg-secondary">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border mt-8 pt-8">
            <div className="flex justify-between text-xl font-semibold mb-8">
              <span>Sous-total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <Link to="/checkout" className="block w-full bg-primary text-primary-foreground text-center py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Valider la commande
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
