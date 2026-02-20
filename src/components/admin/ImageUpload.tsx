import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const ImageUpload = ({ value, onChange, folder = "misc" }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setUploading(true);
    // Create a unique file path
    const ext = file.name.split(".").pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

    try {
      console.log("Submitting upload to folder:", folder);

      // We remove the hard 20s timeout and let Supabase handle the retry logic.
      // 100kb shouldn't take long, but we want to know the *actual* error if it fails.
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        console.error("Supabase Storage Error:", error);
        throw error;
      }

      console.log("Upload Success:", data);

      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error("Unable to retrieve public URL.");
      }

      onChange(publicUrlData.publicUrl);
      toast.success("Image téléchargée avec succès");
    } catch (err: any) {
      console.error("ImageUpload Error Trace:", err);
      // Give more specific feedback for common issues
      let msg = "Erreur lors du téléchargement.";
      if (err.message?.includes("bucket")) msg = "Erreur de configuration du stockage Supabase.";
      if (err.status === 403 || err.message?.includes("Permission")) msg = "Accès refusé. Reconnectez-vous en tant qu'admin.";

      toast.error(err.message || msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="border border-dashed border-border rounded-none flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors relative overflow-hidden"
        style={{ minHeight: 120 }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              className="w-full h-32 object-cover"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-1 right-1 bg-background/80 border border-border p-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs">Téléchargement…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
            <Upload className="w-6 h-6" />
            <span className="text-xs text-center">
              Cliquer ou glisser une image<br />
              <span className="text-[10px]">JPG, PNG, WEBP — max 5 Mo</span>
            </span>
          </div>
        )}
      </div>

      {/* URL fallback */}
      <input
        type="text"
        placeholder="Ou coller une URL d'image"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border px-3 py-2 text-sm bg-background"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default ImageUpload;
