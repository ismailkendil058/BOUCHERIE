import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminLogin = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { success, error } = await login(email, password);
    setSubmitting(false);
    if (success) {
      toast.success("Connexion réussie");
      navigate("/admin");
    } else {
      toast.error(error || "Identifiants incorrects ou accès non autorisé");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-background p-8 border border-border">
        <h1 className="text-2xl font-bold text-center mb-2">Administration</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Boucherie de la Paix</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-foreground text-background py-3 text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
