
-- ============================================================
-- BOUCHERIE DE LA PAIX — Full Supabase Schema
-- ============================================================

-- 1. ENUM for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. USER ROLES TABLE (stored separately for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function: safe role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: Only admins can view user_roles
CREATE POLICY "Admins can view user_roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. CATEGORIES TABLE
-- ============================================================
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT USING (true);

-- Only admins can insert/update/delete categories
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. PRODUCTS TABLE
-- ============================================================
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_unit TEXT NOT NULL DEFAULT 'kg' CHECK (price_unit IN ('kg', 'piece')),
  image TEXT NOT NULL DEFAULT '',
  halal_certified BOOLEAN NOT NULL DEFAULT true,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read products
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT USING (true);

-- Only admins can mutate products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. DELIVERY ZONES TABLE
-- ============================================================
CREATE TABLE public.delivery_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Public can read delivery zones
CREATE POLICY "Anyone can view delivery zones"
  ON public.delivery_zones FOR SELECT USING (true);

-- Only admins can mutate delivery zones
CREATE POLICY "Admins can insert delivery zones"
  ON public.delivery_zones FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update delivery zones"
  ON public.delivery_zones FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete delivery zones"
  ON public.delivery_zones FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 6. ORDERS TABLE
-- ============================================================
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('pickup', 'delivery')),
  pickup_date TEXT,
  pickup_time TEXT,
  delivery_zone_id TEXT REFERENCES public.delivery_zones(id) ON DELETE SET NULL,
  delivery_zone_name TEXT,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create an order (no auth required for customers)
CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT WITH CHECK (true);

-- Only admins can view all orders
CREATE POLICY "Admins can view orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update order status
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 7. ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  product_price_unit TEXT NOT NULL DEFAULT 'kg',
  product_image TEXT NOT NULL DEFAULT '',
  quantity NUMERIC(10,3) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can insert order items (linked to orders)
CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT WITH CHECK (true);

-- Only admins can view order items
CREATE POLICY "Admins can view order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 8. SEED: CATEGORIES
-- ============================================================
INSERT INTO public.categories (id, name, image) VALUES
  ('boeuf',    'Bœuf',               'https://images.unsplash.com/photo-1588347818036-558601350947?w=400&q=80'),
  ('agneau',   'Agneau',             'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400&q=80'),
  ('volaille', 'Volaille',           'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80'),
  ('preparees','Viandes Préparées',  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80'),
  ('legumes',  'Légumes',            'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&q=80'),
  ('laitiers', 'Produits Laitiers',  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80');

-- ============================================================
-- 9. SEED: PRODUCTS
-- ============================================================
INSERT INTO public.products (id, name, category, description, price, price_unit, image, halal_certified, in_stock) VALUES
  ('b1','Entrecôte de Bœuf','boeuf','Entrecôte tendre et persillée, idéale pour la grillade. Viande de bœuf sélectionnée avec soin, certifiée Halal AVS.',32.90,'kg','https://images.unsplash.com/photo-1588347818036-558601350947?w=600&q=80',true,true),
  ('b2','Faux-filet de Bœuf','boeuf','Pièce noble du bœuf, savoureuse et juteuse. Parfaite pour une cuisson à la poêle ou au barbecue.',29.90,'kg','https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&q=80',true,true),
  ('b3','Viande Hachée de Bœuf','boeuf','Viande hachée fraîche, 100% bœuf. Idéale pour burgers, boulettes et sauces bolognaise.',16.90,'kg','https://images.unsplash.com/photo-1602473812169-36a015ef8f09?w=600&q=80',true,true),
  ('b4','Côte de Bœuf','boeuf','Pièce d''exception pour les grandes occasions. Maturation optimale pour un goût incomparable.',38.90,'kg','https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',true,true),
  ('a1','Gigot d''Agneau','agneau','Gigot d''agneau entier, tendre et fondant. Pièce maîtresse de vos repas de fête.',24.90,'kg','https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400&q=80',true,true),
  ('a2','Côtelettes d''Agneau','agneau','Côtelettes premières, tendres et savoureuses. Cuisson rapide à la poêle ou au grill.',28.90,'kg','https://images.unsplash.com/photo-1624174503860-5ba7be868898?w=600&q=80',true,true),
  ('a3','Épaule d''Agneau','agneau','Épaule désossée, parfaite pour un rôti lent au four. Viande fondante et parfumée.',19.90,'kg','https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80',true,true),
  ('v1','Poulet Fermier Entier','volaille','Poulet fermier élevé en plein air. Chair ferme et savoureuse, certifié Halal AVS.',9.90,'kg','https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80',true,true),
  ('v2','Cuisses de Poulet','volaille','Cuisses de poulet charnues et juteuses. Idéales pour le four ou le tajine.',7.90,'kg','https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=600&q=80',true,true),
  ('v3','Blancs de Dinde','volaille','Filets de dinde maigres et tendres. Parfaits pour une cuisine légère et saine.',12.90,'kg','https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=600&q=80',true,true),
  ('p1','Merguez Artisanales','preparees','Merguez maison épicées, préparées chaque jour. Idéales pour le barbecue.',14.90,'kg','https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',true,true),
  ('p2','Kefta Maison','preparees','Boulettes de viande hachée épicées, recette traditionnelle. Prêtes à cuire.',16.90,'kg','https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80',true,true),
  ('p3','Brochettes Mixtes','preparees','Assortiment de brochettes bœuf et agneau marinées. Prêtes pour le grill.',18.90,'kg','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',true,true),
  ('l1','Tomates Cœur de Bœuf','legumes','Tomates charnues et parfumées, sélectionnées chez nos producteurs locaux.',5.90,'kg','https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&q=80',false,true),
  ('l2','Oignons Rouges','legumes','Oignons rouges doux et sucrés, parfaits en salade ou en accompagnement.',3.50,'kg','https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&q=80',false,true),
  ('l3','Pommes de Terre','legumes','Pommes de terre à chair ferme, idéales pour frites, purée ou au four.',2.90,'kg','https://images.unsplash.com/photo-1518977676601-b28d17b8d0e2?w=600&q=80',false,true),
  ('d1','Fromage de Brebis','laitiers','Fromage de brebis affiné, doux et crémeux. Produit artisanal français.',24.90,'kg','https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80',false,true),
  ('d2','Lait Frais Entier','laitiers','Lait frais entier de vache, non pasteurisé. Goût authentique et riche.',2.50,'piece','https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80',false,true),
  ('d3','Beurre Fermier','laitiers','Beurre fermier doux, fabriqué de manière traditionnelle. Saveur incomparable.',4.90,'piece','https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80',false,true);

-- ============================================================
-- 10. SEED: DELIVERY ZONES (Paris 1er → 20e)
-- ============================================================
INSERT INTO public.delivery_zones (id, name, price) VALUES
  ('z1','Paris 1er',5.00),
  ('z2','Paris 2e',5.00),
  ('z3','Paris 3e',5.00),
  ('z4','Paris 4e',5.00),
  ('z5','Paris 5e',5.50),
  ('z6','Paris 6e',5.50),
  ('z7','Paris 7e',5.50),
  ('z8','Paris 8e',6.00),
  ('z9','Paris 9e',6.00),
  ('z10','Paris 10e',6.00),
  ('z11','Paris 11e',6.50),
  ('z12','Paris 12e',6.50),
  ('z13','Paris 13e',7.00),
  ('z14','Paris 14e',7.00),
  ('z15','Paris 15e',7.00),
  ('z16','Paris 16e',7.50),
  ('z17','Paris 17e',7.50),
  ('z18','Paris 18e',8.00),
  ('z19','Paris 19e',8.00),
  ('z20','Paris 20e',8.00);
