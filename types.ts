
export interface Product {
  id: string; // uuid
  supplier_id: string; // uuid
  name: string;
  description: string;
  price: string;
  moq: string;
  images: string[];
  category: string;
  created_at?: string;
}

export interface Supplier {
  id: string; // uuid
  user_id?: string; // uuid
  name: string;
  industry: string;
  category: string;
  location: string;
  rating: number;
  description: string;
  products: Product[];
  certifications: string[];
  contactEmail: string;
  imageUrl: string;
  isOwner?: boolean;
  belongsToOwner?: boolean;
  establishedYear?: number;
  employeeCount?: string;
  factorySize?: string;
  exportMarkets?: string[];
  businessType?: string;
  productionCapacity?: string;
  created_at?: string;
}

export interface Order {
  id: string; // uuid
  buyer_id: string; // uuid
  supplier_id: string; // uuid
  total: string;
  status: string;
  progress: number;
  est_delivery: string;
  created_at: string;
  supplier?: {
    name: string;
    industry?: string;
    location?: string;
  };
}

export interface Profile {
  id: string; // uuid matches auth.users(id)
  username: string;
  role: 'buyer' | 'supplier';
  email: string;
  phone?: string;
  company_role?: string;
  updated_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  links?: Array<{ title: string; uri: string }>;
}

export enum Industry {
  Agriculture = 'Agriculture',
  GarmentTextile = 'Garment & Textile',
  Handicrafts = 'Handicrafts',
  Electronics = 'Electronics',
  Construction = 'Construction',
  FoodProcessing = 'Food Processing',
}
