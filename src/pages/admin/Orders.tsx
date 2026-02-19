import { useStore, Order } from "@/contexts/StoreContext";
import { useState } from "react";

const statusLabels: Record<Order["status"], string> = {
  pending: "En attente",
  preparing: "En préparation",
  ready: "Prête",
  completed: "Terminée",
};

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">Aucune commande.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-background border border-border">
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="w-full text-left px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs">{o.id}</span>
                  <span className="text-sm">{o.customer.firstName} {o.customer.lastName}</span>
                  <span className="text-sm font-semibold">{o.total.toFixed(2)} €</span>
                </div>
                <span className={`text-xs uppercase tracking-widest px-2 py-1 ${
                  o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  o.status === "preparing" ? "bg-blue-100 text-blue-800" :
                  o.status === "ready" ? "bg-green-100 text-green-800" :
                  "bg-secondary text-muted-foreground"
                }`}>{statusLabels[o.status]}</span>
              </button>

              {expanded === o.id && (
                <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Client</p>
                      <p>{o.customer.firstName} {o.customer.lastName}</p>
                      <p>{o.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Mode</p>
                      <p>{o.mode === "pickup" ? `Retrait – ${o.pickupDate} à ${o.pickupTime}` : `Livraison – ${o.deliveryZone?.name}`}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Produits</p>
                    {o.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm py-1">
                        <span>{item.product.name} × {item.product.priceUnit === "kg" ? `${item.quantity.toFixed(2)} kg` : item.quantity}</span>
                        <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                    {o.deliveryFee > 0 && (
                      <div className="flex justify-between text-sm py-1 border-t border-border mt-2 pt-2">
                        <span>Livraison</span>
                        <span>{o.deliveryFee.toFixed(2)} €</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Changer le statut</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["pending", "preparing", "ready", "completed"] as Order["status"][]).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateOrderStatus(o.id, s)}
                          className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${o.status === s ? "bg-foreground text-background" : "border-border hover:border-foreground"}`}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
