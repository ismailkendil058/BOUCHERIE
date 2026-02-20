import { useStore, Category } from "@/contexts/StoreContext";
import { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) { toast.error("Nom requis"); return; }
    setLoading(true);
    try {
      if (editing) {
        await updateCategory({ id: editing.id, name, image });
        toast.success("Catégorie mise à jour");
      } else {
        await addCategory({ name, image });
        toast.success("Catégorie ajoutée");
      }
      setEditing(null); setCreating(false); setName(""); setImage("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <button onClick={() => { setCreating(true); setEditing(null); setName(""); setImage(""); }} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {(editing || creating) && (
        <div className="bg-background border border-border p-6 mb-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Modifier" : "Nouvelle catégorie"}</h2>
          <input placeholder="Nom *" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-background" />
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Image</label>
            <ImageUpload value={image} onChange={setImage} folder="categories" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={loading} className="bg-primary text-primary-foreground px-6 py-2 text-xs uppercase tracking-widest disabled:opacity-50">
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="border border-border px-6 py-2 text-xs uppercase tracking-widest">Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-background border border-border p-4 flex items-center gap-4">
            <img src={c.image} alt={c.name} className="w-16 h-16 object-cover" />
            <span className="flex-1 font-medium">{c.name}</span>
            <button onClick={() => { setEditing(c); setCreating(false); setName(c.name); setImage(c.image); }} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
            <button onClick={async () => {
              if (!confirm("Supprimer cette catégorie ?")) return;
              try {
                await deleteCategory(c.id);
                toast.success("Supprimé");
              } catch (error) {
                toast.error("Erreur, impossible de supprimer.");
              }
            }} className="text-muted-foreground hover:text-primary"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
