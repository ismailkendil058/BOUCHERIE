import { useStore } from "@/contexts/StoreContext";
import { ShoppingCart, DollarSign, Package, Clock } from "lucide-react";

const AdminDashboard = () => {
  const { orders } = useStore();

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Total commandes", value: orders.length, icon: ShoppingCart },
    { label: "Commandes du jour", value: todayOrders.length, icon: Clock },
    { label: "Chiffre d'affaires", value: `${totalRevenue.toFixed(2)} €`, icon: DollarSign },
    { label: "En attente", value: pendingCount, icon: Package },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Commandes récentes</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune commande pour le moment.</p>
      ) : (
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">{o.customer.firstName} {o.customer.lastName}</td>
                  <td className="px-4 py-3">{o.total.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs uppercase tracking-widest px-2 py-1 ${
                      o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      o.status === "preparing" ? "bg-blue-100 text-blue-800" :
                      o.status === "ready" ? "bg-green-100 text-green-800" :
                      "bg-secondary text-muted-foreground"
                    }`}>{
                      o.status === "pending" ? "En attente" :
                      o.status === "preparing" ? "En préparation" :
                      o.status === "ready" ? "Prête" : "Terminée"
                    }</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
