export interface Category {
  id: string;
  name: string;
  nameTa: string;
  image: string;
  displayOrder: number;
  slug: string;
  status: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}
export interface Product {
  id: string;
  sno: number;
  categoryId: string | { id: string; _id?: string };
  name: string;
  nameTa: string;
  price: number;
  per: string;
  discountPrice: number;
  image: string;
  slug: string;
  status: boolean;
  category?: { id: string; name: string };
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
}

export interface WhyChooseUsItem {
  id: string;
  icon: string;
  title: string;
}

export interface SpecificationItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface WayWeWorkStep {
  id: string;
  title: string;
  desc: string;
}

export interface TrustedPartner {
  id: string;
  image: string;
  alt: string;
}

export interface HomeContent {
  banners: Banner[];
  whyChooseUs: WhyChooseUsItem[];
  specifications: SpecificationItem[];
  wayWeWork: WayWeWorkStep[];
  trustedPartners: TrustedPartner[];
  wayWeWorkImage: string;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

export interface OrderLineItem {
  productId: string;
  name: string;
  per: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface OrderEditHistoryEntry {
  id: string;
  action: "order_edit" | "status_update" | string;
  note: string;
  changedAt: string;
  changedBy: {
    id: string;
    name: string;
    email: string;
  };
  changes: unknown;
}

export interface Order {
  id: string;
  items: OrderLineItem[];
  customer: { name: string; phone: string; address: string };
  totalQty: number;
  totalAmount: number;
  status: "pending_payment" | "paid" | "fulfilled" | "cancelled";
  editHistory?: OrderEditHistoryEntry[];
  createdAt: string;
  paidAt: string | null;
}

export interface ContentResponse {
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  }; 
}