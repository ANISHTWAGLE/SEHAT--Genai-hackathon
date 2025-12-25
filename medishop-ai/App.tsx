import React, { useReducer, useEffect, useState } from 'react';
import { StoreState, StoreAction, Product, CartItem, Order } from './types';
import { PRODUCTS } from './constants';
import { ShoppingCart, Menu, X, Mic, MicOff, Search, Sparkles, Volume2, Trash2, CheckCircle, ArrowRight, Home, History, Clock } from 'lucide-react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { useGeminiTTS } from './hooks/useGeminiTTS';

// --- Reducer ---
const initialState: StoreState = {
  cart: [],
  orderHistory: [],
  isCartOpen: false,
  viewingProduct: null,
  searchQuery: '',
  view: 'BROWSE',
  lastOrder: null
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.product.id);
      const qty = action.quantity || 1;
      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.id === action.product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        newCart = [...state.cart, { ...action.product, quantity: qty }];
      }
      return { ...state, cart: newCart, isCartOpen: true };
    }
    case 'DECREMENT_CART_ITEM': {
      const existingItem = state.cart.find(item => item.id === action.productId);
      if (!existingItem) return state;
      
      if (existingItem.quantity <= action.quantity) {
         // Remove if requesting to remove more than or equal to current qty
         return { ...state, cart: state.cart.filter(i => i.id !== action.productId) };
      }
      return {
        ...state,
        cart: state.cart.map(i => i.id === action.productId ? { ...i, quantity: i.quantity - action.quantity } : i)
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.id !== action.productId) };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, cart: state.cart.filter(i => i.id !== action.productId) };
      }
      return {
        ...state,
        cart: state.cart.map(i => i.id === action.productId ? { ...i, quantity: action.quantity } : i)
      };
    case 'OPEN_CART':
      return { ...state, isCartOpen: true };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'VIEW_PRODUCT':
      return { ...state, viewingProduct: action.product };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query, view: 'BROWSE' };
    case 'CHECKOUT':
      if (state.cart.length === 0) return state;
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...state.cart],
        total: state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        status: 'Processing'
      };
      return { 
        ...state, 
        lastOrder: state.cart, 
        orderHistory: [newOrder, ...state.orderHistory],
        cart: [], 
        isCartOpen: false, 
        view: 'ORDER_SUCCESS' 
      };
    case 'VIEW_ORDER_HISTORY':
      return { ...state, view: 'ORDER_HISTORY', isCartOpen: false, viewingProduct: null };
    case 'NAVIGATE_HOME':
      return { ...state, view: 'BROWSE', searchQuery: '' };
    default:
      return state;
  }
}

// --- Components ---

interface ProductCardProps {
  product: Product;
  cart: CartItem[];
  dispatch: React.Dispatch<StoreAction>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cart, dispatch }) => {
  const cartItem = cart.find(item => item.id === product.id);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col border border-slate-100 group">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-slate-100">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        <button 
          onClick={() => dispatch({ type: 'VIEW_PRODUCT', product })}
          className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-teal-600 font-medium text-xs backdrop-blur-sm"
        >
          Quick View
        </button>
      </div>
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide">{product.category}</div>
        <div className="font-bold text-slate-800">₹{product.price.toFixed(2)}</div>
      </div>
      <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>
      
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => dispatch({ type: 'ADD_TO_CART', product })}
          className={`w-full py-2.5 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 ${
            cartItem 
              ? 'bg-teal-600 text-white hover:bg-teal-700' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <ShoppingCart size={16} />
          {cartItem ? `Add Another (${cartItem.quantity})` : 'Add to Cart'}
        </button>
        
        {cartItem && (
          <button
            onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: product.id })}
            className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
};

const CartDrawer = ({ state, dispatch }: { state: StoreState; dispatch: React.Dispatch<StoreAction> }) => {
  if (!state.isCartOpen) return null;
  
  const total = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => dispatch({ type: 'CLOSE_CART' })} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart size={20} className="text-teal-600" />
            Your Cart
          </h2>
          <button onClick={() => dispatch({ type: 'CLOSE_CART' })} className="p-2 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {state.cart.length === 0 ? (
            <div className="text-center text-slate-500 py-10 flex flex-col items-center">
              <ShoppingBagIcon className="w-12 h-12 mb-3 text-slate-300" />
              <p>Your cart is empty.</p>
              <p className="text-sm mt-1">Ask the assistant to add items!</p>
            </div>
          ) : (
            state.cart.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                  <div className="text-sm text-slate-500 mb-2">₹{item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.id, quantity: item.quantity - 1 })}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-slate-50"
                    >-</button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: item.id, quantity: item.quantity + 1 })}
                      className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-slate-50"
                    >+</button>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: item.id })}
                  className="text-slate-400 hover:text-red-500 self-start"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {state.cart.length > 0 && (
          <div className="p-5 border-t bg-slate-50">
            <div className="flex justify-between items-center mb-4 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => dispatch({ type: 'CHECKOUT' })}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductModal = ({ product, onClose, dispatch }: { product: Product; onClose: () => void; dispatch: React.Dispatch<StoreAction> }) => {
  const { speak, isPlaying } = useGeminiTTS(process.env.API_KEY);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white shadow-sm">
          <X size={20} />
        </button>
        
        <div className="md:w-1/2 bg-slate-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-2">{product.category}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>
          <div className="text-2xl font-semibold text-slate-800 mb-6">₹{product.price.toFixed(2)}</div>
          
          <div className="prose prose-sm text-slate-600 mb-6">
            <p>{product.description}</p>
          </div>

          <div className="mb-6">
             <button 
                onClick={() => speak(product.description)}
                disabled={isPlaying}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors border ${isPlaying ? 'bg-teal-50 text-teal-700 border-teal-200' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
             >
                <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
                {isPlaying ? 'Reading Description...' : 'Read Description'}
             </button>
          </div>
          
          <div className="mb-8">
            <h4 className="font-semibold text-slate-900 mb-3">Key Benefits</h4>
            <ul className="space-y-2">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-auto pt-6 border-t">
            <button
              onClick={() => {
                dispatch({ type: 'ADD_TO_CART', product });
                onClose();
              }}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderSuccessPage = ({ order, dispatch }: { order: CartItem[] | null, dispatch: React.Dispatch<StoreAction> }) => {
  if (!order) return null;
  const total = order.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-fade-in-up">
       <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
         <CheckCircle size={48} />
       </div>
       <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
       <p className="text-slate-500 mb-10">Thank you for your purchase. Your order has been placed successfully.</p>
       
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
         <div className="bg-slate-50 p-4 border-b border-slate-200 font-semibold text-slate-700">
           Order Summary
         </div>
         <div className="divide-y divide-slate-100">
            {order.map(item => (
              <div key={item.id} className="p-4 flex items-center gap-4 text-left">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-slate-100" />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{item.name}</h4>
                  <div className="text-sm text-slate-500">Qty: {item.quantity} × ₹{item.price}</div>
                </div>
                <div className="font-semibold text-slate-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
         </div>
         <div className="p-4 bg-slate-50 flex justify-between items-center font-bold text-lg border-t border-slate-200">
           <span>Total Paid</span>
           <span>₹{total.toFixed(2)}</span>
         </div>
       </div>
       
       <div className="flex justify-center gap-4">
          <button 
            onClick={() => dispatch({ type: 'NAVIGATE_HOME' })}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg hover:-translate-y-0.5"
          >
            <Home size={18} />
            Back to Store
          </button>
          <button 
            onClick={() => dispatch({ type: 'VIEW_ORDER_HISTORY' })}
            className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors"
          >
            <History size={18} />
            View All Orders
          </button>
       </div>
    </div>
  );
};

const OrderHistoryPage = ({ orders, dispatch }: { orders: Order[], dispatch: React.Dispatch<StoreAction> }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in-up">
       <div className="flex items-center gap-2 mb-8">
          <button 
             onClick={() => dispatch({ type: 'NAVIGATE_HOME' })}
             className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
             <ArrowRight className="rotate-180" size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Order History</h2>
       </div>
       
       {orders.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No past orders found.</p>
            <button 
              onClick={() => dispatch({ type: 'NAVIGATE_HOME' })}
              className="mt-4 text-teal-600 font-medium hover:underline"
            >
              Start shopping
            </button>
         </div>
       ) : (
         <div className="space-y-6">
            {orders.map(order => (
               <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                     <div>
                        <div className="text-sm text-slate-500 font-medium">Order Placed</div>
                        <div className="text-slate-900">{order.date}</div>
                     </div>
                     <div>
                        <div className="text-sm text-slate-500 font-medium">Order ID</div>
                        <div className="text-slate-900">{order.id}</div>
                     </div>
                     <div>
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                           {order.status}
                         </span>
                     </div>
                     <div className="sm:text-right">
                        <div className="text-sm text-slate-500 font-medium">Total Amount</div>
                        <div className="text-lg font-bold text-slate-900">₹{order.total.toFixed(2)}</div>
                     </div>
                  </div>
                  <div className="p-4">
                     <div className="space-y-3">
                        {order.items.map(item => (
                           <div key={item.id} className="flex items-center gap-4">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded bg-slate-100 object-cover" />
                              <div className="flex-1">
                                 <h5 className="font-medium text-slate-900 text-sm">{item.name}</h5>
                                 <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-slate-700">₹{(item.price * item.quantity).toFixed(2)}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
       )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const { isConnected, isSpeaking, connect, disconnect, error } = useGeminiLive({ 
    dispatch, 
    apiKey: process.env.API_KEY 
  });
  
  // Handle API Key missing
  const [hasKey, setHasKey] = useState(!!process.env.API_KEY);
  
  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => dispatch({ type: 'NAVIGATE_HOME' })}>
             <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles size={18} />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-900">MediShop<span className="text-teal-600">AI</span></span>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
           {state.view === 'BROWSE' && (
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search for medicines, vitamins..." 
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', query: e.target.value })}
                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
           )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => dispatch({ type: 'VIEW_ORDER_HISTORY' })}
              className={`p-2 rounded-full transition-colors hidden sm:block ${state.view === 'ORDER_HISTORY' ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Order History"
            >
               <History size={20} />
            </button>
            <button 
              onClick={() => dispatch({ type: 'OPEN_CART' })}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {state.cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {state.cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Voice Agent Control Banner */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
           {/* Abstract Background pattern */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           
           <div className="flex items-center gap-4 relative z-10">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isConnected ? 'bg-teal-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                {isConnected ? (
                  isSpeaking ? (
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full bg-white animate-pulse-ring" />
                      <Volume2 size={32} className="relative z-10" />
                    </div>
                  ) : (
                    <Mic size={32} />
                  )
                ) : (
                   <MicOff size={32} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Health Assistant</h2>
                <p className="text-slate-300 text-sm max-w-md">
                  {isConnected 
                    ? isSpeaking ? "Speaking..." : "Listening... Ask me to add items, view history, or checkout." 
                    : "Connect to start a voice shopping session."}
                </p>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>
           </div>

           <div className="relative z-10">
              {!hasKey ? (
                 <button disabled className="bg-slate-700 text-slate-400 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                   API Key Missing
                 </button>
              ) : (
                <button 
                  onClick={isConnected ? disconnect : connect}
                  className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                    isConnected 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-900'
                  }`}
                >
                  {isConnected ? 'End Session' : 'Start Conversation'}
                </button>
              )}
           </div>
        </div>

        {/* View Routing */}
        {state.view === 'ORDER_SUCCESS' ? (
           <OrderSuccessPage order={state.lastOrder} dispatch={dispatch} />
        ) : state.view === 'ORDER_HISTORY' ? (
           <OrderHistoryPage orders={state.orderHistory} dispatch={dispatch} />
        ) : (
           <div className="mb-6">
             <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Products</h2>
             {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-500">No products found matching "{state.searchQuery}"</p>
                </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredProducts.map(product => (
                   <ProductCard key={product.id} product={product} cart={state.cart} dispatch={dispatch} />
                 ))}
               </div>
             )}
           </div>
        )}
      </main>

      {/* Overlays */}
      <CartDrawer state={state} dispatch={dispatch} />
      {state.viewingProduct && (
        <ProductModal 
          product={state.viewingProduct} 
          dispatch={dispatch}
          onClose={() => dispatch({ type: 'VIEW_PRODUCT', product: null })} 
        />
      )}
    </div>
  );
}

// Simple Icon for empty state
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}