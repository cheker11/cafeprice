export type CityId = 'kyiv' | 'lviv' | 'odesa' | 'dnipro' | 'kharkiv';

export interface City {
  id: CityId;
  name: string;
  popularSpotsCount: number;
}

export type DrinkCategory = 
  | 'Класика еспресо' 
  | 'Фільтр & Альтернатива' 
  | 'Авторські & Чай' 
  | 'Свіжа випічка & Сендвічі';

export interface MenuItem {
  id: string;
  name: string;
  category: DrinkCategory;
  description: string;
  basePrice: number;
  image: string;
  volumeOptions?: { label: string; volume: string; priceDiff: number }[];
  allowsMilk?: boolean;
  allowsBeans?: boolean;
  allowsSyrup?: boolean;
  allowsTemperature?: boolean;
  defaultPrepMinutes: number; // typically 3-4 mins
}

export interface CoffeeShop {
  id: string;
  name: string;
  cityId: CityId;
  address: string;
  neighborhood: string;
  metro?: string;
  rating: number;
  reviewsCount: number;
  openHours: string;
  walkMinutesFromUser: number;
  distanceMeters: number;
  coverImage: string;
  thumbnail: string;
  tags: string[];
  specialtyRoast: string;
  menu: MenuItem[];
  phone: string;
}

export interface OrderItemCustomization {
  volume?: string;
  milk?: string;
  beans?: string;
  syrup?: string;
  temperature?: 'Гарячий' | 'Айс';
  sugar?: string;
  reusableCup?: boolean;
  specialNotes?: string;
}

export interface CartItem {
  id: string;
  shopId: string;
  menuItem: MenuItem;
  customization: OrderItemCustomization;
  unitPrice: number;
  quantity: number;
}

export type OrderStatus = 'received' | 'brewing' | 'ready_at_counter' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#408"
  shopId: string;
  shopName: string;
  shopAddress: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  arrivalMinutes: number; // e.g. 5 mins
  createdAt: number;
  targetPickupTimestamp: number;
  status: OrderStatus;
  paymentMethod: 'apple_pay' | 'google_pay' | 'monobank' | 'card';
  delayedMinutes?: number;
  guestArrivedAtDoor?: boolean;
}
