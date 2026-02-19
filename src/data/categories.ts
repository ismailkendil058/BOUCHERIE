export interface Category {
  id: string;
  name: string;
  image: string;
}

export const categories: Category[] = [
  { id: "boeuf", name: "Bœuf", image: "https://images.unsplash.com/photo-1588347818036-558601350947?w=400&q=80" },
  { id: "agneau", name: "Agneau", image: "https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400&q=80" },
  { id: "volaille", name: "Volaille", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80" },
  { id: "preparees", name: "Viandes Préparées", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
  { id: "legumes", name: "Légumes", image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&q=80" },
  { id: "laitiers", name: "Produits Laitiers", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80" },
];
