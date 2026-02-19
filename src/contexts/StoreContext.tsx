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
  login: (email: string, password: string) => Promise<boolean>;
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

const toProduct = (row: Record<string, unknown>): Product => ({
  id: row.id as string,
  name: row.name as string,
  category: row.category as string,
  description: row.description as string,
  price: Number(row.price),
  priceUnit: row.price_unit as "kg" | "piece",
  image: row.image as string,
  halalCertified: row.halal_certified as boolean,
  inStock: row.in_stock as boolean,
  featured: (row.featured as boolean) ?? false,
});

const toCategory = (row: Record<string, unknown>): Category => ({
  id: row.id as string,
  name: row.name as string,
  image: row.image as string,
});

const toZone = (row: Record<string, unknown>): DeliveryZone => ({
  id: row.id as string,
  name: row.name as string,
  price: Number(row.price),
});

// ─── Context ─────────────────────────────────────────────────────────────────

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Initial data fetch ────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Fetch public data in parallel
      const [{ data: cats }, { data: prods }, { data: zones }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("products").select("*").order("name"),
        supabase.from("delivery_zones").select("*").order("name"),
      ]);
      if (cats) setCategories(cats.map(toCategory));
      if (prods) setProducts(prods.map(toProduct));
      if (zones) setDeliveryZones(zones.map(toZone));

      // Check current session & admin role
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await checkAdminRole(session.user.id);
      }
      setLoading(false);
    };

    init();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setOrders([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    const admin = !!data;
    setIsAdmin(admin);
    if (admin) await fetchOrders();
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

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt for:", email);
    
    try {
      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Login request timed out")), 10000)
      );
      
      const loginPromise = supabase.auth.signInWithPassword({ email, password });
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;
      
      console.log("Sign in result:", { data, error });
      
      if (error || !data.user) {
        console.error("Login error:", error);
        return false;
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
        return false;
      }
      
      console.log("Admin role found, setting isAdmin to true");
      setIsAdmin(true);
      await fetchOrders();
      return true;
    } catch (err: any) {
      console.error("Login exception:", err);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setOrders([]);
  };

  // ── Orders ───────────────────────────────────────────────────────────────

  const addOrder = async (order: Omit<Order, "id" | "status" | "createdAt">) => {
    const orderId = `ORD-${Date.now()}`;
    await supabase.from("orders").insert({
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
    });

    const itemsToInsert = order.items.map((i) => ({
      order_id: orderId,
      product_id: i.product.id,
      product_name: i.product.name,
      product_price: i.product.price,
      product_price_unit: i.product.priceUnit,
      product_image: i.product.image,
      quantity: i.quantity,
    }));
    await supabase.from("order_items").insert(itemsToInsert);
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ── Products ─────────────────────────────────────────────────────────────

  const addProduct = async (p: Omit<Product, "id">) => {
    const id = `prod-${Date.now()}`;
    const { data } = await supabase.from("products").insert({
      id, name: p.name, category: p.category, description: p.description,
      price: p.price, price_unit: p.priceUnit, image: p.image,
      halal_certified: p.halalCertified, in_stock: p.inStock, featured: p.featured,
    }).select().single();
    if (data) setProducts((prev) => [...prev, toProduct(data as Record<string, unknown>)]);
  };

  const updateProduct = async (p: Product) => {
    const { data } = await supabase.from("products").update({
      name: p.name, category: p.category, description: p.description,
      price: p.price, price_unit: p.priceUnit, image: p.image,
      halal_certified: p.halalCertified, in_stock: p.inStock, featured: p.featured,
    }).eq("id", p.id).select().single();
    if (data) setProducts((prev) => prev.map((x) => x.id === p.id ? toProduct(data as Record<string, unknown>) : x));
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  // ── Categories ───────────────────────────────────────────────────────────

  const addCategory = async (c: Omit<Category, "id">) => {
    const id = `cat-${Date.now()}`;
    const { data } = await supabase.from("categories").insert({ id, name: c.name, image: c.image }).select().single();
    if (data) setCategories((prev) => [...prev, toCategory(data as Record<string, unknown>)]);
  };

  const updateCategory = async (c: Category) => {
    const { data } = await supabase.from("categories").update({ name: c.name, image: c.image }).eq("id", c.id).select().single();
    if (data) setCategories((prev) => prev.map((x) => x.id === c.id ? toCategory(data as Record<string, unknown>) : x));
  };

  const deleteCategory = async (id: string) => {
    await supabase.from("categories").delete().eq("id", id);
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
