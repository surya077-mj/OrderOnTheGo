export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  orderHistory: Order[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  cuisine: string;
  rating: number;
  reviews: Review[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  preparationTime: number;
  availability: boolean;
  promotionId?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  dishId: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDeliveryTime: string;
  deliveryFee: number;
  tax: number;
  statusHistory: OrderStatusUpdate[];
  trackingInfo?: TrackingInfo;
  promotionApplied?: Promotion;
  discountAmount?: number;
}

export interface OrderStatusUpdate {
  status: Order['status'];
  timestamp: string;
  message: string;
}

export interface TrackingInfo {
  driverName?: string;
  driverPhone?: string;
  estimatedArrival: string;
  currentLocation?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'debit-card' | 'paypal' | 'apple-pay' | 'google-pay' | 'cash-on-delivery';
  name: string;
  details?: string;
  isDefault: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed-amount' | 'buy-one-get-one' | 'free-delivery';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableDishes?: string[];
  applicableCategories?: string[];
  usageLimit?: number;
  usedCount: number;
  code?: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}