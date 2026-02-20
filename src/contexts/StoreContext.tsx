import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  priceUnit: "kg" | "piece";
  image: string;
  halalCertified: boolean;
  inStock: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: { firstName: string; lastName: string; phone: string };
  mode: "pickup" | "delivery";
  pickupDate?: string;
  pickupTime?: string;
  deliveryZone?: DeliveryZone;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  deliveryZones: DeliveryZone[];
  orders: Order[];
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addDeliveryZone: (zone: Omit<DeliveryZone, "id">) => Promise<void>;
  updateDeliveryZone: (zone: DeliveryZone) => Promise<void>;
  deleteDeliveryZone: (id: string) => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toProduct = (row: any): Product => {
  if (!row) throw new Error("Product data is missing");
  return {
    id: String(row.id || ""),
    name: String(row.name || "Produit sans nom"),
    category: String(row.category || ""),
    description: String(row.description || ""),
    price: Number(row.price || 0),
    priceUnit: (row.price_unit as "kg" | "piece") || "kg",
    image: String(row.image || ""),
    halalCertified: Boolean(row.halal_certified),
    inStock: Boolean(row.in_stock),
    featured: Boolean(row.featured),
  };
};

const toCategory = (row: any): Category => {
  if (!row) throw new Error("Category data is missing");
  return {
    id: String(row.id || ""),
    name: String(row.name || "Catégorie sans nom"),
    image: String(row.image || ""),
  };
};

const toZone = (row: any): DeliveryZone => {
  if (!row) throw new Error("Zone data is missing");
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    price: Number(row.price || 0),
  };
};

// ─── Context ─────────────────────────────────────────────────────────────────

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("app_is_admin") === "true");
  const [loading, setLoading] = useState(true);

  // ── Initial data fetch ────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        console.log("Store: Initializing data...");

        const [catsRes, prodsRes, zonesRes] = await Promise.all([
          supabase.from("categories").select("*").order("name"),
          supabase.from("products").select("*").order("name"),
          supabase.from("delivery_zones").select("*").order("name"),
        ]);

        if (catsRes.error) console.error("Error fetching categories:", catsRes.error);
        if (prodsRes.error) console.error("Error fetching products:", prodsRes.error);
        if (zonesRes.error) console.error("Error fetching zones:", zonesRes.error);

        if (catsRes.data) {
          console.log(`Store: Loaded ${catsRes.data.length} categories`);
          setCategories(catsRes.data.map(toCategory).filter(Boolean) as Category[]);
        }
        if (prodsRes.data) {
          console.log(`Store: Loaded ${prodsRes.data.length} products`);
          setProducts(prodsRes.data.map(toProduct).filter(Boolean) as Product[]);
        }
        if (zonesRes.data) {
          setDeliveryZones(zonesRes.data.map(toZone).filter(Boolean) as DeliveryZone[]);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await checkAdminRole(session.user.id);
        }
      } catch (err) {
        console.error("Store init crash:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Store: Auth Event - ${event}`, { userId: session?.user?.id });

      if (session?.user) {
        if (!isAdmin) {
          console.log("Store: Session detected, verifying admin role...");
          await checkAdminRole(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Store: Formal sign out detected, clearing admin state");
        setIsAdmin(false);
        localStorage.removeItem("app_is_admin");
        setOrders([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAdmin]);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin role:", error);
      return;
    }

    const admin = !!data;
    setIsAdmin(admin);

    if (admin) {
      localStorage.setItem("app_is_admin", "true");
      await fetchOrders();
    } else {
      localStorage.removeItem("app_is_admin");
    }
  };

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (!ordersData) return;

    const mapped: Order[] = ordersData.map((o: Record<string, unknown>) => {
      const rawItems = (o.order_items as Record<string, unknown>[]) ?? [];
      const items: OrderItem[] = rawItems.map((i: Record<string, unknown>) => ({
        product: {
          id: i.product_id as string,
          name: i.product_name as string,
          price: Number(i.product_price),
          priceUnit: i.product_price_unit as "kg" | "piece",
          image: i.product_image as string,
          category: "",
          description: "",
          halalCertified: false,
          inStock: true,
          featured: false,
        },
        quantity: Number(i.quantity),
      }));

      return {
        id: o.id as string,
        items,
        customer: {
          firstName: o.customer_first_name as string,
          lastName: o.customer_last_name as string,
          phone: o.customer_phone as string,
        },
        mode: o.mode as "pickup" | "delivery",
        pickupDate: o.pickup_date as string | undefined,
        pickupTime: o.pickup_time as string | undefined,
        deliveryZone: o.delivery_zone_id
          ? { id: o.delivery_zone_id as string, name: o.delivery_zone_name as string, price: Number(o.delivery_fee) }
          : undefined,
        deliveryFee: Number(o.delivery_fee),
        subtotal: Number(o.subtotal),
        total: Number(o.total),
        status: o.status as Order["status"],
        createdAt: o.created_at as string,
      };
    });

    setOrders(mapped);
  };

  // ── Auth ─────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log("Login attempt for:", email);

    try {
      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login request timed out")), 30000)
      );

      const loginPromise = supabase.auth.signInWithPassword({ email, password });

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      console.log("Sign in result:", { data, error });

      if (error || !data.user) {
        console.error("Login error:", error);
        return { success: false, error: error?.message || "Échec de la connexion" };
      }

      console.log("User signed in, user ID:", data.user.id);

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      console.log("Role check result:", { roleData, roleError });

      if (!roleData) {
        console.error("No admin role found for user");
        await supabase.auth.signOut();
        return { success: false, error: "Accès refusé: Vous n'avez pas les droits d'administrateur." };
      }

      console.log("Admin role found, setting isAdmin to true");
      setIsAdmin(true);
      localStorage.setItem("app_is_admin", "true");
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      console.error("Login exception:", err);
      return { success: false, error: err.message || "Une erreur inattendue est survenue." };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Store: Logout error:", err);
    } finally {
      setIsAdmin(false);
      localStorage.removeItem("app_is_admin");
      setOrders([]);
      console.log("Store: Admin logged out, local state cleared");
    }
  };

  // ── Orders ───────────────────────────────────────────────────────────────

  const addOrder = async (order: Omit<Order, "id" | "status" | "createdAt">) => {
    const orderId = `ORD-${Date.now()}`;
    const { error: insertError } = await supabase.from("orders").insert({
      id: orderId,
      customer_first_name: order.customer.firstName,
      customer_last_name: order.customer.lastName,
      customer_phone: order.customer.phone,
      mode: order.mode,
      pickup_date: order.pickupDate ?? null,
      pickup_time: order.pickupTime ?? null,
      delivery_zone_id: order.deliveryZone?.id ?? null,
      delivery_zone_name: order.deliveryZone?.name ?? null,
      delivery_fee: order.deliveryFee,
      subtotal: order.subtotal,
      total: order.total,
      status: "pending",
    } as any);

    if (insertError) throw insertError;

    const itemsToInsert = order.items.map((i) => ({
      order_id: orderId,
      product_id: i.product.id,
      product_name: i.product.name,
      product_price: i.product.price,
      product_price_unit: i.product.priceUnit,
      product_image: i.product.image,
      quantity: i.quantity,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
    if (itemsError) throw itemsError;
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) throw error;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ── Products ─────────────────────────────────────────────────────────────

  const addProduct = async (p: Omit<Product, "id">) => {
    const id = `prod-${Date.now()}`;
    const { data, error } = await supabase.from("products").insert({
      id, name: p.name, category: p.category, description: p.description,
      price: p.price, price_unit: p.priceUnit, image: p.image,
      halal_certified: p.halalCertified, in_stock: p.inStock, featured: p.featured,
    }).select().maybeSingle();

    if (error) {
      console.error("Add Product Error:", error);
      throw error;
    }
    if (data) {
      const newProd = toProduct(data);
      setProducts((prev) => [...prev, newProd]);
      console.log("Product added successfully to state");
    }
  };

  const updateProduct = async (p: Product) => {
    const { data, error } = await supabase.from("products").update({
      name: p.name, category: p.category, description: p.description,
      price: p.price, price_unit: p.priceUnit, image: p.image,
      halal_certified: p.halalCertified, in_stock: p.inStock, featured: p.featured,
    }).eq("id", p.id).select().single();

    if (error) throw error;
    if (data) setProducts((prev) => prev.map((x) => x.id === p.id ? toProduct(data as Record<string, unknown>) : x));
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  // ── Categories ───────────────────────────────────────────────────────────

  const addCategory = async (c: Omit<Category, "id">) => {
    const id = `cat-${Date.now()}`;
    const { data, error } = await supabase.from("categories").insert({ id, name: c.name, image: c.image }).select().maybeSingle();

    if (error) {
      console.error("Add Category Error:", error);
      throw error;
    }
    if (data) {
      const newCat = toCategory(data);
      setCategories((prev) => [...prev, newCat]);
      console.log("Category added successfully to state");
    }
  };

  const updateCategory = async (c: Category) => {
    const { data, error } = await supabase.from("categories").update({ name: c.name, image: c.image }).eq("id", c.id).select().single();

    if (error) throw error;
    if (data) setCategories((prev) => prev.map((x) => x.id === c.id ? toCategory(data as Record<string, unknown>) : x));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    setCategories((prev) => prev.filter((x) => x.id !== id));
  };

  // ── Delivery Zones ───────────────────────────────────────────────────────

  const addDeliveryZone = async (z: Omit<DeliveryZone, "id">) => {
    const id = `zone-${Date.now()}`;
    const { data } = await supabase.from("delivery_zones").insert({ id, name: z.name, price: z.price }).select().single();
    if (data) setDeliveryZones((prev) => [...prev, toZone(data as Record<string, unknown>)]);
  };

  const updateDeliveryZone = async (z: DeliveryZone) => {
    const { data } = await supabase.from("delivery_zones").update({ name: z.name, price: z.price }).eq("id", z.id).select().single();
    if (data) setDeliveryZones((prev) => prev.map((x) => x.id === z.id ? toZone(data as Record<string, unknown>) : x));
  };

  const deleteDeliveryZone = async (id: string) => {
    await supabase.from("delivery_zones").delete().eq("id", id);
    setDeliveryZones((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products, categories, deliveryZones, orders, isAdmin, loading,
      login, logout, addOrder, updateOrderStatus,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addDeliveryZone, updateDeliveryZone, deleteDeliveryZone,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
