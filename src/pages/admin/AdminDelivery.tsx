import { useStore, DeliveryZone } from "@/contexts/StoreContext";
import { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

const AdminDelivery = () => {
  const { deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone } = useStore();
  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const handleSave = async () => {
    if (!name) { toast.error("Nom requis"); return; }
    if (editing) {
      await updateDeliveryZone({ id: editing.id, name, price });
      toast.success("Zone mise à jour");
    } else {
      await addDeliveryZone({ name, price });
      toast.success("Zone ajoutée");
    }
    setEditing(null); setCreating(false); setName(""); setPrice(0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tarifs & Adresses de livraison</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setName(""); setPrice(0); }} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {(editing || creating) && (
        <div className="bg-background border border-border p-6 mb-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Modifier" : "Nouvelle zone"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Zone / Adresse *" value={name} onChange={(e) => setName(e.target.value)} className="border border-border px-3 py-2 text-sm bg-background" />
            <input type="number" placeholder="Tarif (€)" value={price || ""} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="border border-border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-6 py-2 text-xs uppercase tracking-widest">Sauvegarder</button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="border border-border px-6 py-2 text-xs uppercase tracking-widest">Annuler</button>
          </div>
        </div>
      )}

      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Zone</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Tarif</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryZones.map((z) => (
              <tr key={z.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{z.name}</td>
                <td className="px-4 py-3">{z.price.toFixed(2)} €</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(z); setCreating(false); setName(z.name); setPrice(z.price); }} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { deleteDeliveryZone(z.id); toast.success("Supprimé"); }} className="text-muted-foreground hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDelivery;
