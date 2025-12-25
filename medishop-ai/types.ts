export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  benefits: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Delivered' | 'Shipped';
}

export interface StoreState {
  cart: CartItem[];
  orderHistory: Order[];
  isCartOpen: boolean;
  viewingProduct: Product | null;
  searchQuery: string;
  view: 'BROWSE' | 'ORDER_SUCCESS' | 'ORDER_HISTORY';
  lastOrder: CartItem[] | null;
}

export type StoreAction =
  | { type: 'ADD_TO_CART'; product: Product; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'DECREMENT_CART_ITEM'; productId: string; quantity: number }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'VIEW_PRODUCT'; product: Product | null }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'CHECKOUT' }
  | { type: 'NAVIGATE_HOME' }
  | { type: 'VIEW_ORDER_HISTORY' };

export enum VoiceStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}