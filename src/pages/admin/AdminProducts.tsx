import { useStore, Product } from "@/contexts/StoreContext";
import { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyProduct: Omit<Product, "id"> = {
  name: "", category: "", description: "", price: 0, priceUnit: "kg", image: "", halalCertified: true, inStock: true, featured: false,
};

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await updateProduct({ ...form, id: editing.id });
        toast.success("Produit mis à jour");
      } else {
        await addProduct({ ...form });
        toast.success("Produit ajouté");
      }
      setEditing(null);
      setCreating(false);
      setForm(emptyProduct);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setCreating(false);
    const { id, ...rest } = p;
    setForm(rest);
  };

  const startCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(emptyProduct);
  };

  const showForm = editing || creating;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produits</h1>
        <button onClick={startCreate} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground/90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="bg-background border border-border p-6 mb-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Modifier le produit" : "Nouveau produit"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Nom *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-border px-3 py-2 text-sm bg-background" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-border px-3 py-2 text-sm bg-background">
              <option value="">Catégorie *</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Prix *" value={form.price || ""} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="border border-border px-3 py-2 text-sm bg-background" />
            <select value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value as "kg" | "piece" })} className="border border-border px-3 py-2 text-sm bg-background">
              <option value="kg">€/kg</option>
              <option value="piece">€/pièce</option>
            </select>
            <div className="col-span-full">
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Image</label>
              <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="products" />
            </div>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-background h-20" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.halalCertified} onChange={(e) => setForm({ ...form, halalCertified: e.target.checked })} /> Halal AVS
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> En stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> ⭐ Produit spécial
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={loading} className="bg-primary text-primary-foreground px-6 py-2 text-xs uppercase tracking-widest disabled:opacity-50">
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="border border-border px-6 py-2 text-xs uppercase tracking-widest">Annuler</button>
          </div>
        </div>
      )}

      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Produit</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground hidden md:table-cell">Catégorie</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Prix</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground hidden md:table-cell">Halal</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground hidden md:table-cell">Spécial</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover" />
                  {p.name}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">{categories.find((c) => c.id === p.category)?.name || p.category}</td>
                <td className="px-4 py-3">{p.price.toFixed(2)} €/{p.priceUnit === "kg" ? "kg" : "pièce"}</td>
                <td className="px-4 py-3 hidden md:table-cell">{p.halalCertified ? "✓" : "–"}</td>
                <td className="px-4 py-3 hidden md:table-cell">{p.featured ? "⭐" : "–"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={async () => {
                      if (!confirm("Supprimer ce produit ?")) return;
                      try {
                        await deleteProduct(p.id);
                        toast.success("Produit supprimé");
                      } catch (error) {
                        toast.error("Erreur lors de la suppression");
                      }
                    }} className="text-muted-foreground hover:text-primary"><Trash2 className="w-4 h-4" /></button>
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

export default AdminProducts;
