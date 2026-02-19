import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Shield, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useStore();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(product?.priceUnit === "kg" ? 0.5 : 1);
  const [customWeight, setCustomWeight] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Produit non trouvé.</p>
        </div>
        <Footer />
      </>
    );
  }

  const isKg = product.priceUnit === "kg";
  const step = isKg ? 0.25 : 1;
  const minQty = isKg ? 0.25 : 1;

  const effectiveQty = customWeight ? parseFloat(customWeight) : quantity;
  const totalPrice = product.price * (effectiveQty || 0);

  const handleAdd = () => {
    const qty = customWeight ? parseFloat(customWeight) : quantity;
    if (!qty || qty <= 0) return;
    addItem(product, qty);
    navigate("/cart");
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour aux produits
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-square bg-secondary overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              {product.halalCertified && (
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Halal Certifié AVS</span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              <div className="text-2xl font-semibold mb-8">
                {product.price.toFixed(2)} € / {isKg ? "kg" : "pièce"}
              </div>

              {/* Quantity selector */}
              <div className="space-y-4 mb-8">
                <label className="text-sm uppercase tracking-widest">
                  {isKg ? "Poids (kg)" : "Quantité"}
                </label>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(minQty, quantity - step))}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium w-16 text-center">
                    {isKg ? `${quantity.toFixed(2)}` : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + step)}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {isKg && (
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Ou saisissez un poids personnalisé (kg)</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.01"
                      value={customWeight}
                      onChange={(e) => setCustomWeight(e.target.value)}
                      placeholder="Ex: 1.75"
                      className="w-40 border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              {/* Dynamic price */}
              <div className="border-t border-border pt-6 mb-8">
                <div className="flex justify-between text-lg">
                  <span>Total estimé</span>
                  <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
